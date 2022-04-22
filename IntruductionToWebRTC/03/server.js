const WebSocketServer = require('ws').Server;
const port = 3000;
const wsServer = new WebSocketServer({port});
console.log("'websocket server start. port=", port);

wsServer.on('connection', (me) => 
{
  console.log("connected");

  me.on('message', (msg) => 
  {
    console.log(msg.toString());

    wsServer.clients.forEach((client) => 
    {
      if (me !== client) {
        client.send(msg);
      }
    });
  });
})
