
var GLOBAL_MESSAGES;

function login() {
    $.ajax({
        url: "/home",
        type: 'POST',
        dataType: 'json', // added data type
        data: {
            username: $("#username").val(),
            password: $("#password").val()
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
        if(data[i]['messages'] != null){
            GLOBAL_MESSAGES[data[i]['username']] = data[i]['messages'];
            conn = conn + '<li href="#" class="list-group-item text-left"><img class="img-thumbnail" src="'+data[i]['profile_pic']+'"><label class="pull-right"><a class="btn btn-success btn-xs glyphicon glyphicon-envelope" href="#" title="View"></a></label><label class="nameMessage">'+data[i]['username']+'</label><label class="message">Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br></label><div class="break"></div></li>;
        }
    }
    $('#connections_list').html(conn);
}

$(document).ready(function () {
    $("#modal").modal('show');
    $("body").toggleClass("dialogIsOpen");
    $("#Modal-Login").show()
    $("#Modal-Sign-Up").hide();
    $("#Landing-Center").show().fadeIn("fast");
    $("#Center-Selection").hide();
});

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

$("#logout-btn").on("click", function() {
    $("#modal").modal('show');
    $("body").toggleClass("dialogIsOpen");
})