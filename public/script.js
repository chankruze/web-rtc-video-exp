/*
Author: chankruze (chankruze@geekofia.in)
Created: Tue Oct 20 2020 19:52:58 GMT+0530 (India Standard Time)

Copyright (c) Geekofia 2020 and beyond
*/

// init socket.io
const socket = io("/");
// find reference to video grid
const videoGrid = document.getElementById("video_grid");
// local server
const myPeer = new Peer(undefined, {
  secure: true,
  host: "gconf0.herokuapp.com",
  path: "/peer_server",
});

// remote peer server
// const myPeer = new Peer();

// create a new video element
const thisVideo = document.createElement("video");
// mute each user itself
thisVideo.muted = true;
// other peers call for indivisual peer
connectedPeers = {};

// camera, mic
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    // add video stream to video and render video to grid
    addVideoStream(thisVideo, stream);

    // when someone joins the room we get a call
    myPeer.on("call", (call) => {
      // answer the call
      call.answer(stream);
      // create new video elem
      const video = document.createElement("video");
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
  const video = document.createElement("video");
  // when stream is received add that stream to video elem
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
  // remove video element
  call.on("close", () => {
    video.remove();
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
  // append new video to grid
  videoGrid.append(video);
};
