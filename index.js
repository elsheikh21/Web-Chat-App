// imports to use
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
// var jquery = require('jquery');
// var bootstrap = require('bootstrap');  

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// server listens to port: 4000
http.listen(4000, function(){
  console.log('listening on *:4000');
});

// connect to dB to be created when invoked
mongoose.connect('mongodb://127.0.0.1/WebChatApp', function(err) {
  if(err) throw err;
});

// mongoose promise is depricated and thus we promise it to global
mongoose.Promise = global.Promise;

// create user schema 
var userSchema = mongoose.Schema({
  // avatar:String,
  name:String
});

// create chat schema
var chatSchema = mongoose.Schema({
  username: String,
  message:String,
  created: {type: Date, default: Date.now}
});

// create collection for Chats with chatSchema
var Chat = mongoose.model('chat',chatSchema);

// create collection for Users with userSchema  
var User = mongoose.model('user',userSchema);

var users = [];
// when socket io is
io.on('connection', function(socket){
  // console.log('A user connected');
  var newUser;
  socket.on('setUsername', function(data){
    // console.log(data);
    User.findOne({name:data},function(err, res){
      if(err) throw err;
      socket.emit('userExists', data + ' username is taken! Try some other username.');
      if(res == null){
          // create a new instance of user
          newUser = new User({name:data});
      // save it to the collection
      newUser.save(function(err, res){
        if(err) throw err;
        console.log(res);
      });
      
      socket.emit('userSet', {username: data});
    } else {
      console.log('try another username ');
    }
  });
    // if(users.indexOf(data) > -1){
    //   socket.emit('userExists', data + ' username is taken! Try some other username.');
    // }
    // else{
    // users.push(data);

    // }
  });
  socket.on('disconnect', function(){
    // console.log('user disconnected');
    // users = []
    User.remove({});
  });
  socket.on('msg', function(data){
    var newChat = new Chat({username:data.username, message:data.message});
      // save it to the collection
      newChat.save(function(err){
        if(err) throw err;
      });
      // Chat.findOne({username:data.username},function(err, res){
      //   if(err) throw err;
      //   console.log(res);
      // });
      socket.emit('userSet', {username: newUser.name});
      //Send message to everyone
      io.sockets.emit('newmsg', data);
    })
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
