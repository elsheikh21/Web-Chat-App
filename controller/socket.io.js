var socket = io();

function setUsername() {
    var usern = document.getElementById('name').value;
    var unl = document.getElementById('name').value.length;
    var img = document.getElementById('image').value;
    var imgl = document.getElementById('image').value.length;
    // console.log(img); // what does the element return
    var pattern = new RegExp(/[^a-zA-Z]/);
    var check = pattern.test(usern); //returns false if it contains only characters (I guess it is toggeled)
    var check0 = (unl === 0);
    var check1 = (imgl === 0);
    var check2 = (check && check0 && !check1);
    if (check0) {
        alert("username is supposed to have a value");
    } else {
        if (check) {
            alert("username is only characters");
        } else {
            if (check1) {
                alert("please upload a photo to proceed")
            } else {
                var details = {username: usern, avatar: img};
                socket.emit('setUsername', details);  // proceed and pass it on for the backend

            }
        }
    }
}

var user;
var image;
socket.on('userExists', function (data) {
    document.getElementById('error-container').innerHTML = data;
});
socket.on('userSet', function (data) {
    user = document.getElementById('name').value;
    img = data.avatar;
    document.body.innerHTML = '<form><input type="text" id="message">\
              <button type="button" name="button" onclick="sendMessage()">Send</button>\
              <div id="message-container"></div></form>';
});

function sendMessage() {
    var msg = document.getElementById('message').value;
    if (msg) {
        // console.log("index.html line 109"+{username: user, message: msg, img: img});
        socket.emit('msg', {username: user, message: msg, img: img});
    } else {
        alert("You can not send an empty message.");
    }
}

socket.on('newmsg', function (data) {
    var today = new Date;
    y = today.getFullYear();
    m = today.getMonth() + 1;
    d = today.getDate();
    var h = today.getHours();
    if (h === 0)
        h = "0" + h;
    var mm = today.getMinutes();
    if (mm < 10)
        mm = "0" + mm;


    if (data.user) {
        $('#message-container').append($('<li>').text(data.user + ": " + data.message));
        $('#message-container').append($('<p>').text(d + "/" + m + "/" + y + " " + h + ":" + mm));
        var objDiv = document.getElementById('message-container');
        objDiv.scrollTop = objDiv.scrollHeight;
    }
});