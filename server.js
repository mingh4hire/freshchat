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
const https = require('https');
const server = https.createServer(options, app);
const list = [];

// const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')
// const { PeerServer } = require("peer");
// const peerServer = PeerServer({ port: 3000, path: "/" });
var ExpressPeerServer = require('peer').ExpressPeerServer;

// const peerServer = PeerServer({  port:3002, path: "/peer" });//, secureProtocol: 'TLSv1_2_method'});
app.set('view engine', 'ejs')
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
  res.send();
}) ;
app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})
const peerServer = ExpressPeerServer(server, {
   path: '/myapp2' // Optional: specify a path for the PeerJS server
});

console.log(peerServer);
app.use('/peerjs', peerServer); // Mount the 
//  server at a specific path

// io.on('connection', socket => {
//   socket.on('join-room', (roomId, userId) => {
//     socket.join(roomId)
//     socket.to(roomId).broadcast.emit('user-connected', userId)
//     list.push(userId);
//     socket.on('disconnect', () => {
//       socket.to(roomId).broadcast.emit('user-disconnected', userId);
//       list.splice(list.indexOf(userId), 1);
//     })
//   })
// })

server.listen(443)
