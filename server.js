const express = require('express')
const app = express()
// const server = require('http').Server(app)
const fs = require('fs');

const options = {
  key: fs.readFileSync('localhost.key').toString(),
  cert: fs.readFileSync('localhost.crt').toString(),
  ciphers: 'ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA:ECDHE-RSA-AES256-SHA384',
  honorCipherOrder: true,
  secureProtocol: 'TLSv1_2_method'
};
const httpApp = express();

httpApp.get('*', (req, res) => {
  res.redirect('https://' + req.headers.host + req.url);
});

http= require('http')
const httpServer = http.createServer(httpApp);
httpServer.listen(80);

const https = require('https');
const server = https.createServer(options, app);
const list = [];
const sockets = require('socket.io');

const socketServer = sockets(server, {
  // path: 
  path: '/socket.io'
});

// const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')
// const { PeerServer } = require("peer");
// const peerServer = PeerServer({ port: 3000, path: "/" });
var ExpressPeerServer = require('peer').ExpressPeerServer;
const session = require('express-session');
app.use(session({
  secret: 'your-secret-key',
  resave: false, 
  saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.post('/', (req, res) => {
  const { username, password } = req.body;
  if (password === fs.readFileSync('mima.txt').toString().split(String.fromCharCode(10))[0]) {
    req.session.username = username;
    res.redirect('/');
  } else {
    res.sendFile(__dirname + '/public/login.html');
  }
});

app.use((req, res, next) => {
  console.log('session', req.session);
  if (req.session && req.session.username) {
    next();
  } else {
    res.sendFile(__dirname + '/public/login.html');
  }
});

app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})
app.get('/list', (req, res) => {
  res.json(list);
}) ;
app.get('/add', (req, res) => {
  list.push(req.query.id);
  res.json({});
});
app.get('/remove', (req, res) => {
  list.splice(list.indexOf(req.query.id), 1);
  res.json();
});
app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})
const peerServer = ExpressPeerServer(server, {
   path: '/myapp2' // Optional: specify a path for the PeerJS server
});

// console.log(peerServer);
app.use('/peerjs', peerServer); // Mount the 


server.listen(443)
socketServer.on("connection", (socket) => {
  console.log('socket connected');
  socket.on('join-room', (roomId, peerId) => {
    console.log('someone joined the room ', roomId, peerId);
    
    // socket.join(roomId);
    // socket.join(roomId);
    // socket.broadcast.to(roomId).emit('message', 'Someone else joined');
    // sockets.sockets.emit('user-connected', peerId, 'joined the room');
    socket.broadcast.emit('user-connected', peerId, 'joined the room');
    // socket.broadcast.emit('message', peerId, 'joined the room');
  });
  socket.on('disconnect', () => {
    console.log('disconnected');
  });
  socket.on('message', (message) => {
    try{
      socket.broadcast.emit('message',message);
    }catch(e){}
  });
});
