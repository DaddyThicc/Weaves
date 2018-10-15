const Cryptr   = require('cryptr');
const cryptr   = new Cryptr('BaCoNaNdEgGsArEsOgOoD');
var express    = require('express');
var app        = express();
var mysql      = require('mysql');
var port       = process.env.PORT || 5000;
var bodyParser = require('body-parser');
var path = require('path');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'Weaves'
});

// Setup
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({	extended: true })); // support encoded bodies
app.use(express.static(path.join(__dirname, 'public')));


// sends landing page when you first load webpage
app.get("/", function(req, res) {
    res.sendFile('home.html' , { root : __dirname});
});

//checks login info then sends data to user and redirects to home page
app.post("/home", function(req, res){
    var query_string = `SELECT * FROM Users WHERE username = '${req.body.username}';`;
    console.log(req.body);
    connection.connect();
    connection.query(query_string, function (error, results, fields) {
        if(results == null) return;
        //else if(req.body.password != cryptr.decrypt(results[0]['password'])) return;
        else{
            var data = results[0];
            res.json({fname: data['fname'], lname: data['lname'], email: data['email'], username: data['username'], phone: data['phone'], origin: data['origin'], profile_pic: data['profile_pic'], friends: data['friends_list']});
            res.emit('close');
            res.end();
        }
    });
    connection.end();
});

// registers new user
/*app.post("/register", function(req, res) {
    
    var query_string = `INSERT INTO Users (fname, lname, email, username, password, phone, origin) VALUES ('${req.body.fname}', '${req.body.lname}', '${req.body.email}', '${req.body.username}', '${cryptr.encrypt(req.body.password)}', '${req.body.phone}', '${req.body.origin}');`;
    
    connection.connect();
    connection.query(query_string, function (error, results, fields) {
        if (error) throw error;
    });
    connection.end();
    res.send('<meta http-equiv="Refresh" content="5; url=localhost:5000/pages/login.html>');
    
});*/


//listener for server
app.listen(port, function() {
    console.log("Listening on " + port);
});