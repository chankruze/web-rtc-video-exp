/*
Author: chankruze (chankruze@geekofia.in)
Created: Tue Oct 20 2020 19:52:58 GMT+0530 (India Standard Time)

Copyright (c) Geekofia 2020 and beyond
*/

// init socket.io
const socket = io("/");

/* Navigator User Media */
const videoConstrants = {
  aspectRatio: 1.7777777778,
};

const audioConstrants = {
  echoCancellation: true,
  noiseSuppression: true,
  sampleRate: 44100,
};

// const gdmOptionsMin = {
//   video: true,
//   audio: true,
// };

// const gdmOptionsFull = {
//   video: {
//     cursor: "always",
//   },
//   audio: {
//     echoCancellation: true,
//     noiseSuppression: true,
//     sampleRate: 44100,
//   },
// };

// find reference to video grid
// const videoGrid = document.getElementById("video_grid");
// local server
const myPeer = new Peer(undefined, {
  host: "peerserver69.herokuapp.com",
  secure: true,
});

// remote peer server
// const myPeer = new Peer();

// create a new video wrapper
// const thisVideoWrapper = document.createElement("div");
// thisVideoWrapper.className = "video_wrapper";
// create a new video element
// const thisVideo = document.createElement("video");
const thisVideo = document.getElementById("half_video");
// mute each user itself
thisVideo.muted = true;
// append video to video wrapper
// thisVideoWrapper.append(thisVideo);
// other peers call for indivisual peer
connectedPeers = {};

// camera, mic
navigator.mediaDevices
  .getUserMedia({
    audio: audioConstrants,
    video: videoConstrants,
  })
  .then((stream) => {
    // add video stream to video and render video to grid
    addVideoStream(thisVideo, stream);

    // when someone joins the room we get a call
    myPeer.on("call", (call) => {
      // answer the call
      call.answer(stream);
      // creaet new video wrapper
      // const videoWrapper = document.createElement("div");
      // videoWrapper.className = "video_wrapper";
      // create new video elem
      const video = document.getElementById("full_video");
      // append video to video wrapper
      // videoWrapper.append(video);
      // add new user stream to grid
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    // call that modafuka
    socket.on("user_connected", (userId) => {
      connectToNewUser(userId, stream);
    });
  });

// remove disconnected peer's video
socket.on("user_disconnected", (userId) => {
  if (connectedPeers[userId]) {
    connectedPeers[userId].close();
  }
});

// when a peer is connected to peer server & got an id
myPeer.on("open", (id) => {
  // notify server that nigga has joined
  socket.emit("join_room", ROOM_ID, id);
});

// call a peer & connect
const connectToNewUser = (userId, stream) => {
  // call new peer
  const call = myPeer.call(userId, stream);
  // creaet new video wrapper
  // const videoWrapper = document.createElement("div");
  // videoWrapper.className = "video_wrapper";
  // create new video elem
  const video = document.getElementById("full_video");
  // append video to video wrapper
  // videoWrapper.append(video);
  // when stream is received add that stream to video elem
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
  // remove video element
  call.on("close", () => {
    video.remove();
    // videoWrapper.remove();
  });
  // store that call to connected peers list (key = userId, value = call)
  connectedPeers[userId] = call;
};

// add video stream to video elem
const addVideoStream = (video, stream) => {
  // set stream as media  source
  video.srcObject = stream;
  // listen for metdata to load & play when loaded
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  // // append new video to grid
  // videoGrid.append(videoWrapper);
};
