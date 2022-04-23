const https = require('https');
const fs = require('fs');
const WebSocketServer = require('ws').Server;
const port = 3000;

const server = https.createServer({
  key: fs.readFileSync(__dirname + '/../ssl/server.key'),
  cert: fs.readFileSync(__dirname + '/../ssl/server.crt'),
})

const wssServer = new WebSocketServer({server});
server.listen(port);

wssServer.on('connection', (me) => {
  me.on('message', (msg) => {
    wssServer.clients.forEach((client) => {
      if (me === client) {
        console.log("skip");
      } else {
        client.send(msg);
      }
    })
  })
});
