/*
Author: chankruze (chankruze@geekofia.in)
Created: Tue Oct 20 2020 19:11:25 GMT+0530 (India Standard Time)

Copyright (c) Geekofia 2020 and beyond
*/

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express"),
  { PeerServer, ExpressPeerServer } = require("peer"),
  os = require("os"),
  { v4: uuidV4 } = require("uuid"),
  cors = require("cors");

// create http server
const app = express();
// peer server
// if (process.env.NODE_ENV === "production") {
//   PeerServer({
//     port: `${process.env.PEER_PORT}`,
//     host: "gconf0.herokuapp.com",
//     secure: true,
//     path: "/peer_server",
//   });
// }
// use CORS
app.use(cors());

app.set("view engine", "ejs");
// use static to render html
app.use(express.static("public"));

// GET endpoints
app.get("/", (req, res) => {
  res.redirect(`/${uuidV4()}`);
});

app.get("/:room", (req, res) => {
  // res.render(view [, locals] [, callback])
  res.render("room", { roomId: req.params.room });
});

// Print sevrer IP
const networkInterfaces = os.networkInterfaces();
let SERV_URL = networkInterfaces.eth0[0].address;

const server = app.listen(process.env.PORT, () =>
  console.log(
    `Server on network: http://${SERV_URL}:${process.env.PORT}\nServer on local: http://localhost:${process.env.PORT}`
  )
);

app.use(
  "/peer_server",
  ExpressPeerServer({
    path: "/server",
    secure: true,
    host: "/",
  })
);

// socket IO
const io = require("socket.io")(server);
// socket connection event
io.on("connection", (socket) => {
  // console.log(`socket connected: ${socket.id}`);

  // chat message event
  socket.on("join_room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user_connected", userId);
    // console.log(`${userId} has joined ${roomId}`);
    // io.emit("join_room", { user: userId, room: roomId });

    socket.on("disconnect", () => {
      socket.to(roomId).broadcast.emit("user_disconnected", userId);
    });
  });

  // disconnect event
  // socket.on("disconnect", () => {
  //   console.log(`socket disconnected: ${socket.id}`);
  // });
});
