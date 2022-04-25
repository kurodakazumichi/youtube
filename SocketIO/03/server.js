const { Server } = require('socket.io');
const io = new Server(3000);
// CORS対策を有効にする場合は↑をコメントアウトして、↓のコメントアウトを外してください
/**** CORS対策用のコード ****
const { Server } = require('socket.io');
const { createServer } = require('http');

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:8080"
  }
});
*****ここまで****/

httpServer.listen(3000);
console.log("サーバーが起動しました");

io.on("connection", (socket) => 
{
  // ソケットIDを表示する
  console.log(`connected: socket.id = ${socket.id}`);

  // サーバーに接続したら、本人以外にお知らせ
  socket.broadcast.emit("info", "新しいユーザーが接続しました。");

  // クライアントとの通信が切断したとき
  socket.on('disconnect', () => {
    console.log(`disconnect: socket.id = ${socket.id}`);
    io.emit("info", "誰かが退出しました。");
  })

  socket.on("chat", (msg) => {
    console.log(msg);
    io.emit("chat", msg);
  })
})
