 
 var datalist = [];
 
 var userId='';



const socket = io('/');
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
  host: '/',
  port: 443,
  path: '/peerjs/myapp2'
  //
  // secure: true
})
var outgoingstream;
const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  addVideoStream(myVideo, stream)

  socket.on('user-connected', (peerId) => {
    console.log('someone else has been connected', peerId);
    const userElement = document.createElement('div')
    userElement.innerText = `New user connected : ${peerId}`
    
    const userListElement = document.getElementById('userList')
    userListElement.appendChild(userElement)
    console.log('about to connect to user on stream' ,peerId, stream);
    setTimeout(() => {
      connectToNewUser(peerId, stream);
    }, 1000);
    // connectToNewUser(peerId, stream);
  
  });
  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
    call.on("close", function() {
      console.log("closingit", call.peer);
      video.remove();
      fetch('/remove?id='+call.peer)
    });

  })
  outgoingstream = stream;
})
 
myPeer.on('open', id => {
  userId = id;
  console.log('joining room ' , ROOM_ID, id);
  socket.emit('join-room', ROOM_ID, id);

  document.querySelector('#myId').innerHTML = id;
  fetch('/add?id='+id)
  .then(response => response.json())
  .then(data => {
      console.log('response is', data);
  })
  .catch(error => {
      console.error('Error fetching /a:', error);
  });
});

myPeer.on('disconnect', id => {
  alert('disconnected');
  fetch('/remove?id='+id)
  .then(response => response.json())
  .then(data => {
      console.log('response is', data);
  })
  .catch(error => {
      console.error('Error fetching /a:', error);
  });
});
myPeer.on('close', id => {
  alert('closed');
  fetch('/remove?id='+id)
  .then(response => response.json())
  .then(data => {
      console.log('response is', data);
  })
  .catch(error => {
      console.error('Error fetching /a:', error);
  });
});

function connectToNewUser(userId, stream) {
  console.log(userId, 'userid', stream, 'stream');
  const call = myPeer.call(userId, stream)
  console.log('calling', call);
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
    console.log("closingit2", call.peer);
    fetch('/remove?id='+call.peer)
  })    
  peers[userId] = call
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  });
  videoGrid.append(video)
}
 
function sendMessage() {
  const messageInput = document.querySelector('#messageInput');
  const message = messageInput.value;
  socket.emit('message', message);
  messageInput.value = '';
}
const messageList = document.querySelector('#messageList');

  // Function to add a new message to the list
  function addMessage(message) {
    const newMessage = document.createElement('div');
    newMessage.textContent = message;
    messageList.appendChild(newMessage);
  }

  // Socket event listener for receiving messages
  socket.on('message', (message) => {
    console.log(message);
    addMessage(message);
  });


  // const myPeer = new Peer(undefined, { path: '/peerjs', host: '/', port: 9000 });

  // setupSocketConnectionViaPeer(socket, myPeer);
  // setupSocketEvents(socket);


