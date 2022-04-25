const { Server } = require('socket.io');
const io = new Server(3000);
console.log("サーバーが起動しました");

io.on("connection", (socket) => {
  console.log("connected");
})
