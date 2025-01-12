 
 var datalist = [];
 
 var userId='';

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

  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })
  outgoingstream = stream;
})
 
myPeer.on('open', id => {
  userId = id;
  console.log(userId);
  // fetch('/add?id='+id)
  // .then(response => response.json())
  // .then(data => {
  //     console.log('response is', data);
  // })
  // .catch(error => {
  //     console.error('Error fetching /a:', error);
  // });
});

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
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
