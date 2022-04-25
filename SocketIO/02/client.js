const io = require("socket.io-client");
socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("connected");
})
