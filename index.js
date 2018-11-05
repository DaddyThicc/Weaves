// Instances
const express    = require('express');
const app        = express();
const http       = require('http').Server(app);
const io         = require('socket.io')(http);
const bodyParser = require('body-parser');
const path       = require('path');
const crypto     = require('crypto'), algorithm = 'aes-256-ctr', password = 'd6F3Efeq';
const mysql      = require('mysql');

// Setup
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies
app.use(express.static(path.join(__dirname, 'assets')));

// Variables
var port            = process.env.PORT || 3000;
var home            = "home.html";
var CONNECTED_USERS = [];
var unbacked_data   = [];

var connection = mysql.createConnection({
  host     : 'db4free.net',
  user     : 'ehenry',
  password : 'Paintball132!',
  database : 'weaves'
});

// Methods
function encrypt(text) {
    var cipher = crypto.createCipher(algorithm, password)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text) {
    var decipher = crypto.createDecipher(algorithm, password)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}

function validate_user(data){
  /* Password: max_len = 20, must_hav = {capital, number, special_character}
   *    Email: max_len = 20, must_hav = {correct ending, @}
   *    Phone: max_len = 10
   * Username: max_len = 15
   *    Names: max_len = 15
   */

  var inc_data = [];

  // fname checks
  if (data.fname.length > 15) {
    inc_data['fname'] = {len: "long"};
  } else if(data.fname.length < 1){
    inc_data['fname'] = {len: "short"};
  } else if(true/* check for invalid special_characters*/){
    inc_data['fname'] = {cont: "inv_char"};
  }

  // lname checks
  if (data.lname.length > 15) {
    inc_data['lname'] = {len: "long"};
  } else if(data.lname.length < 1){
    inc_data['lname'] = {len: "short"};
  } else if(true/* check for invalid special_characters*/){
    inc_data['lname'] = {format: "invalid"};
  }

  // email checks
  if (data.email.length > 20) {
    inc_data['email'] = {len: "long"};
  } else if(data.email.length < 1){
    inc_data['email'] = {len: "short"};
  } else if(data.email.indexOf('@') == -1){
    inc_data['email'] = {format: "invalid"};
  }

  // username checks
  if (data.username.length > 20) {
    inc_data['username'] = {len: "long"};
  } else if(data.username.length < 1){
    inc_data['username'] = {len: "short"};
  } // Add checks for special_characters

  // email checks
  if (data.password.length > 20) {
    inc_data['password'] = {len: "long"};
  } else if(data.password.length < 1){
    inc_data['password'] = {len: "short"};
  } // Add checks for special characters

  // email checks
  if (data.phone.length != 10) {
    inc_data['phone'] = {len: "invalid"};
  }

  if(inc_data == []){
    return null;
  } else {
    return inc_data;
  }

}
//////////////////////////

// sends landing page when you first load webpage
app.get("/", function (req, res) {
    res.sendFile(home, {
        root: __dirname + "/public"
    });
});

//checks login info then sends data to user and redirects to home page
app.post("/login", function (req, res) {
    var query_string = `SELECT * FROM Users WHERE username = '${req.body.username}';`;
    connection.query(query_string, function (error, results, fields) {
        if(req.body.password == decrypt(results[0]['password'])){
            var data = results[0];
            res.json({fname: decrypt(data['fname']), lname: decrypt(data['lname']), email: decrypt(data['email']), username: data['username'], phone: decrypt(data['phone']), origin: data['origin'], profile_pic: data['profile_pic'], friends: data['friends_list']});
        }
        else{
            // send error and show incorrect username or password
        }
    });
});

// registers new user
app.post("/register", function (req, res) {
  //{"0":{"username": "DaddyThicc", "profile_pic": "http://www.topvending.co.za/wp-content/uploads/2015/09/placeholder-man-grid-240x268.png", "messages":{}}}
    var corrections = validate_user(req.body);
    if(true){
        var query_string = `INSERT INTO Users (fname, lname, email, username, password, phone, origin) VALUES ('${encrypt(req.body.fname)}', '${encrypt(req.body.lname)}', '${encrypt(req.body.email)}', '${req.body.username}', '${encrypt(req.body.password)}', '${encrypt(req.body.phone)}', '${req.body.origin}');`;
        connection.query(query_string, function (error, results, fields) {
            if (error) throw error;
        });
    } else {
        // inform user some info is incorrect
    }
});

// "0":{"username": "CreatorEvan", "profile_pic": "http://www.topvending.co.za/wp-content/uploads/2015/09/placeholder-man-grid-240x268.png", "messages":{}}, "1":{"username": "Narman", "profile_pic": "http://www.topvending.co.za/wp-content/uploads/2015/09/placeholder-man-grid-240x268.png", "messages":{}}

io.on('connection', function (socket) {
    if(socket.handshake.query.username != undefined){
      CONNECTED_USERS[socket.handshake.query.username] = socket;
      console.log('User \''+socket.handshake.query.username+'\' has connected to server.');
    }
    socket.on('direct message', function (data) {
        if(CONNECTED_USERS[data.to] != null){
          unbacked_data[data.to]   += {from: data.from, to: data.to, timestamp: data.timestamp, message: data.message, new: "no"}+',';
          unbacked_data[data.from] += {from: data.from, to: data.to, timestamp: data.timestamp, message: data.message, new: "no"}+',';
          io.to(COONECTED_USERS[data.to]).emit('direct message', data);
        } else {
          unbacked_data[data.to]   += {from: data.from, to: data.to, timestamp: data.timestamp, message: data.message, new: "yes"}+',';
          unbacked_data[data.from] += {from: data.from, to: data.to, timestamp: data.timestamp, message: data.message, new: "no"}+',';
        }
        console.log(unbacked_data[data.from]);
    });
});

http.listen(port, function () {
    console.log('Server starting on port: ' + port);
});
