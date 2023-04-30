const ws = require("ws");

const wss = new ws.Server(
  {
    port: 5000,
  },
  () => console.log(`Server started on 5000`),
);

wss.on("connection", function connection(ws) {
  ws.id = 10101010; // назначаем id комнаты
  ws.on("message", function (message) {
    console.log("message --> " + message);
    message = JSON.parse(message);
    switch (message.event) {
      case "message":
        broadcastMessage(message);
        break;
      case "connection":
        //   broadcastMessage(`Пользователь ${message.username} зашёл в чат`, message.id);
        break;
    }
  });
});

function broadcastMessage(message, id) {
  wss.clients.forEach((client) => {
    if (client.id === 10101010) {
      // делаем рассылку всем пользователям у которых id равен 10101010
      console.log("client.id -->", client.id);
      client.send(JSON.stringify(message));
    }
  });
}
