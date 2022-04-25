// 名前を設定
const NAME = process.argv[2];

// 自分の情報
const IAM = {
  id  : undefined,
  name: NAME,
};

const io = require("socket.io-client");

// Socket.IOサーバーに接続
const socket = io("http://localhost:3000");

// ソケットIDを表示する
console.log(`socket.id = ${socket.id}`);

// 繋がった
socket.on("connect", () => {
  console.log(`connected: socket.id = ${socket.id}`);
  IAM.id = socket.id;
})

// 標準入力の準備
process.stdin.setEncoding("utf8");
const reader = require('readline').createInterface({
  input: process.stdin
});

// 文字が入力されたときの処理
reader.on("line", (input) => {
  const msg = {
    id  : IAM.id,
    name: IAM.name,
    text: input,
  };
  socket.emit("chat", msg);
})

// チャットメッセージを受信
socket.on("chat", (msg) => {
  if (msg.id === IAM.id) return;
  show.chat(`${msg.name}:${msg.text}`);
})

// お知らせメッセージを受信
socket.on("info", (msg) => {
  show.info(msg);
})

// テキストの表示を少しオシャレにする
// 制御文字(control charactor)の定義、ターミナルの文字色を変えたりする
const cc = {
  blue  : "\u001b[34m",
  yellow: "\u001b[33m",
  reset : "\u001b[0m",
}

const show = 
{
  info: (text) => {
    const msg = "info: " + text;
    console.log(`${cc.blue}${msg}${cc.reset}`);
  },
  chat: (text) => {
    const msg = "> " + text;
    console.log(`${cc.yellow}${msg}${cc.reset}`);
  }
}
