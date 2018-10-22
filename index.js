//const Cryptr   = require('cryptr');
//const cryptr   = new Cryptr('BaCoNaNdEgGsArEsOgOoD');
var express = require('express');
var app = express();
//var mysql      = require('mysql');
var bodyParser = require('body-parser');
var Pusher = require('pusher');
const path = require('path');
const Chatkit = require('pusher-chatkit-server');

/*var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'Weaves'
});*/

// Setup
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
})); // support encoded bodies
app.use(express.static(path.join(__dirname, 'assets')));
//app.use('/styles', express.static(__dirname + 'public/css'));
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

var pusher = new Pusher({
    appId: '626390',
    key: 'd3b35616dbc5e2ec8d96',
    secret: '1fba85ea02a91d87bad2',
    cluster: 'us2',
    encrypted: true
});

const chatkit = new Chatkit.default({
    instanceLocator: "v1:us1:46a189e4-53c7-4620-a608-5205b8536b7d",
    key: "75e5d00e-029d-4490-afe1-0d291c1e3fb5:iK3SMLpnfv3TnbtLxI11y2TrbSIKb5fDDUIZy9uy3SY="
});

var home = "test.html";

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
            res.emit('close');
            res.end();
        }
    });
    connection.end();
});*/

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

app.post('/session/load', (req, res, next) => {
    // Attempt to create a new user with the email serving as the ID of the user.
    // If there is no user matching the ID, we create one but if there is one we skip
    // creating and go straight into fetching the chat room for that user
    chatkit.createUser(req.body.email, req.body.name)
        .then(() => getUserRoom(req, res, next))
        .catch(err => {
            (err.error_type === 'services/chatkit/user/user_already_exists') ?
            getUserRoom(req, res, next): next(err)
        })

    function getUserRoom(req, res, next) {
        const name = req.body.name
        const email = req.body.email

        // Get the list of rooms the user belongs to. Check within that room 
        // list for one whos name matches the users ID. If we find one, we 
        // return that as the response, else we create the room and return 
        // it as the response.
        chatkit.apiRequest({
                method: 'GET',
                'path': `/users/${email}/rooms`
            })
            .then(rooms => {
                let clientRoom = false

                // Loop through user rooms to see if there is already a room for 
                // the client
                rooms.forEach(room => {
                    return room.name === email ? (clientRoom = room) : false
                })

                if (clientRoom && clientRoom.id) {
                    return res.json(clientRoom)
                }

                const createRoomRequest = {
                    method: 'POST',
                    path: '/rooms',
                    jwt: chatkit.generateAccessToken({
                        userId: email
                    }).token,
                    body: {
                        name: email,
                        private: false,
                        user_ids: ['adminuser']
                    },
                };

                // Since we can't find a client room, we will create one and return 
                // that.
                chatkit.apiRequest(createRoomRequest)
                    .then(room => res.json(room))
                    .catch(err => next(
                        new Error(`${err.error_type} - ${err.error_description}`)
                    ))
            })
            .catch(err => next(
                new Error(`${err.error_type} - ${err.error_description}`)
            ))
    }
})

app.post('/session/auth', (req, res) => {
    res.json(chatkit.authenticate(req.body, req.query.user_id))
});

pusher.trigger('my-channel', 'my-event', {
    "message": "hello world"
});

app.listen(server_port, server_ip_address, function () {
    console.log("Listening on " + server_ip_address + ", port " + server_port)
});
