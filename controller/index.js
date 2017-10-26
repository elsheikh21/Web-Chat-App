// imports to use
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
// var Users = require('./app/model/user');
// var Chat = require('./app/model/chat');

// response for each get method
app.get('/', function (req, res) {
    try {
        var path = require("path");
        res.sendFile(path.resolve("./view/index.html"));
    } catch (err) {
        console.log(err.message.toString());
    }
});


http.listen(4000, function () { // server listens to port: 4000
    console.log('listening on: 4000');
});

mongoose.connect('mongodb://127.0.0.1/WebChatApp', {useMongoClient: true}); // connect to collection to be created when invoked

mongoose.Promise = global.Promise; // mongoose promise is depricated and thus we promise it to global

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// create user schema
var userSchema = mongoose.Schema({
    name: String,
    // avatar: {data: Buffer, contentType: String} // for image storing & importing in mongoose
    avatar: String
});

var chatSchema = mongoose.Schema({ // create chat schema
    username: String,
    message: String,
    created: {type: Date, default: Date.now}
});

var Chat = mongoose.model('chat', chatSchema);// create collection for Chats with chatSchema

var User = mongoose.model('user', userSchema);// create collection for Users with userSchema
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

io.on('connection', function (socket) {
    var newUser;
    socket.on('setUsername', function (data) {
        User.findOne({name: data.username}, function (err, res) {
            if (err) throw err;
            if (res === null) {
                socket.emit('Welcome, ', data.username + 'it is an honor.');
                newUser = new User({name: data.username, avatar: data.avatar});// create a new instance of user
                newUser.save(function (err, res) { // save it to the collection
                    if (err) throw err;
                    // console.log("line 63 index.js" + newUser);
                });
                var userSetDetails = {name: data.username, avatar: data.avatar};
                socket.emit('userSet', userSetDetails);
            } else {
                socket.emit('this username, ', data.username + 'is already taken.');
                // console.log('line 70, index.js failed ');
            }
        });
    });

    socket.on('disconnect', function () {
        User.remove({}, function (err) {
            if (err) throw err;
        });
    });

    socket.on('msg', function (data) {
        // console.log("index.js" + data.username + " +++ " + data.message + " +++ " + data.img);
        var newChat = new Chat({username: data.username, message: data.message});
        newChat.save(function (err) { // save it to the collection
            if (err) throw err;
        });
        socket.emit('userSet', {username: data.username, avatar: data.img}); //Send message to everyone
        var dataMsg = {user: data.username, message: data.message, avatar: data.img};
        io.sockets.emit('newmsg', dataMsg);
        // console.log("Message Details: " + dataMsg);
    });
});


/*
mongoose.connect('mongodb://localhost/my_database');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
 
var BlogPost = new Schema({
    author    : ObjectId,
    title     : String,
    body      : String,
    date      : Date
});


var router = express.Router();
var multer = require('multer');

var uploading = multer({
  dest: __dirname + '../public/uploads/',
  limits: {fileSize: 1000000, files:1},
});

router.post('/upload', uploading, function(req, res) {
  // add your backend
})


app.post('/profile', upload.single('avatar'), function (req, res, next) {
  // req.file is the `avatar` file 
  // req.body will hold the text fields, if there were any 
})

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

io.emit('some event', { for: 'everyone' });


 Trails on connecting users and showing it
io.on('connection', function(socket){
  console.log('a user connected');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});


/*
inside io.on
var roomno = 1; 
if(io.nsps['/'].adapter.rooms["room-"+roomno] && io.nsps['/'].adapter.rooms["room-"+roomno].length > 1)
  roomno++;
socket.join("room-"+roomno);
io.sockets.in("room-"+roomno).emit('connectToRoom', "You are in room no. "+roomno);
*/
