var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
const path = require('path');
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';

// Setup
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
})); // support encoded bodies
app.use(express.static(path.join(__dirname, 'assets')));

// Variables
var port = process.env.PORT || 3000;
var home = "home.html";
var CONNECTED_USERS = [];

// Encryption/Decryption
function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}
//////////////////////////

// sends landing page when you first load webpage
app.get("/", function (req, res) {
    res.sendFile(home, {
        root: __dirname + "/public"
    });
});

//checks login info then sends data to user and redirects to home page
/*app.post("/home", function(req, res){
    var query_string = `SELECT * FROM Users WHERE username = '${req.body.username}';`;
    console.log(req.body);
    connection.connect();
    connection.query(query_string, function (error, results, fields) {
        if(results == null) return;
        //else if(req.body.password != cryptr.decrypt(results[0]['password'])) return;
        else{
            var data = results[0];
            res.json({fname: data['fname'], lname: data['lname'], email: data['email'], username: data['username'], phone: data['phone'], origin: data['origin'], profile_pic: data['profile_pic'], friends: data['friends_list']});
            res.emit('OK!');
            res.end();
        }
    });
    connection.end();
});

// registers new user
app.post("/register", function(req, res) {
    
    var query_string = `INSERT INTO Users (fname, lname, email, username, password, phone, origin) VALUES ('${req.body.fname}', '${req.body.lname}', '${req.body.email}', '${req.body.username}', '${cryptr.encrypt(req.body.password)}', '${req.body.phone}', '${req.body.origin}');`;
    
    connection.connect();
    connection.query(query_string, function (error, results, fields) {
        if (error) throw error;
    });
    connection.end();
    res.send('<meta http-equiv="Refresh" content="5; url=localhost:5000/pages/login.html>');
    
});*/

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});