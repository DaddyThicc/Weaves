var GLOBAL_MESSAGES = [];
var personal_data = [];
var current_msg_user = "";

function login() {
    $.ajax({
        url: "/login",
        type: 'POST',
        dataType: 'json', // added data type
        data: {
            username: $("#username").val(),
            password: $("#password").val()
        },
        success: function (data) {
            personal_data = data;
            $("#profile_pic").attr("src", data['profile_pic']);
            console.log(data['friends']);
            buildFriendsList(JSON.parse(data['friends']));
            buildMessageList(JSON.parse(data['friends']));
            $("body").toggleClass("dialogIsOpen");
            $('#modal').modal('hide');
            return;
        }
    });
}

function register() {
    $.ajax({
        url: "/register",
        type: 'POST',
        dataType: 'json', // added data type
        data: {
            fname: $("#FirstName").val(),
            lname: $("#LastName").val(),
            email: $("#Email").val(),
            username: $("#username").val(),
            password: $("#password").val(),
            phone: $("#phoneNumber").val(),
            origin: $("#origin").val()

        },
        success: function (data) {
            $("#profile_pic").attr("src", data['profile_pic']);
            console.log(data['friends']);
            buildFriendsList(JSON.parse(data['friends']));
            buildMessageList(JSON.parse(data['friends']));
            $("body").toggleClass("dialogIsOpen");
            $('#modal1').modal('hide');
            return;
        }
    });
}

function buildFriendsList(data) {
    var conn = '<li href="#" class="list-group-item title">Your Connections</li>';
    for (var i = 0; i < Object.keys(data).length; i++) {
        conn = conn + '<li href="#" class="list-group-item text-left"><img class="img-thumbnail" src="' + data[i]['profile_pic'] + '"><label class="name">' + data[i]['username'] + '<br></label><label class="pull-right"><a class="btn btn-success btn-xs glyphicon glyphicon-user" href="#" title="View"></a></label><div class="break"></div></li>';
    }
    $('#connections_list').html(conn);
}

function buildMessageList(data) {
    var conn = '<li href="#" class="list-group-item title">Your Messages</li>';
    for (var i = 0; i < Object.keys(data).length; i++) {
        if (data[i]['messages'] != null) {
            GLOBAL_MESSAGES[data[i]['username']] = data[i]['messages'];
            conn = conn + '<li href="#" class="list-group-item text-left"><img class="img-thumbnail" src="' + data[i]['profile_pic'] + '"><label class="pull-right"><a class="btn btn-success btn-xs glyphicon glyphicon-envelope" onclick="openMessaging(\'' + data[i]['username'] + '\')" title="View"></a></label><label class="nameMessage">' + data[i]['username'] + '</label><label class="message">Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br></label><div class="break"></div></li>';
        }
    }
    $('#message_list').html(conn);
}


function send_msg(sendTo) {
    var data = {
        from: personal_data['username'],
        to: sendTo,
        timestamp: 0,
        message: $('#txt_msg').val()
    };
    socket.emit('direct message', data);
    return false;
}

function openMessaging(sendTo) {
    var message_btn = '<div class="row"><form><div class="input-group"><input type="text" class="form-control" placeholder="Search" id="txtSearch" /><div class="input-group-btn"><button class="btn btn-primary" type="submit">Send</button></div></div></form></div>';
    var message_box = '<div id="center-pane"></div>';
    var msgs = "";
    
    console.log(sendTo);
    
    for(var i = 0; i < Object.keys(GLOBAL_MESSAGES[sendTo]).length; i++){
        msgs += '<div id="tb-testimonial" class="testimonial testimonial-default"><div class="testimonial-section">' + data.message + '</div><div class="testimonial-desc"><img src="https://placeholdit.imgix.net/~text?txtsize=9&txt=100%C3%97100&w=100&h=100" alt="" /><div class="testimonial-writer"><div class="testimonial-writer-name"></div><div class="testimonial-writer-designation">Front End Developer</div><a href="#" class="testimonial-writer-company">Touch Base Inc</a></div></div></div>';
    }
}



// JQuery


function newUser() {
    $("#Modal-Login").hide();
    $("#Modal-Sign-Up").show();
}

function CancelLogin() {
    $("#modal").modal('hide');
    $("body").toggleClass("dialogIsOpen");
}

function SelectionToHome() {
    $("#Landing-Center").show();
    $("#Center-Selection").hide();
}

function Selection() {
    $("#Landing-Center").hide();
    $("#Center-Selection").show();
}
