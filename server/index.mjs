import WebSocket, { WebSocketServer } from "ws";

const wss = new WebSocketServer({port: 8080});

const clients = {};

wss.on("connection", (connection) => {
  console.log("新使用者已經連線");

  connection.on("message", (message) => {
    console.log(`收到訊息 => ${message}`);
    const parsedMessage = JSON.parse(message);
    if (parsedMessage.type === "register") {
      const userId = parsedMessage.userId;
      clients[userId] = connection;
      connection.userId = userId;

      const otherClients = Object.keys(clients);
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: "registered", otherClients }));
        }
      });
      return;
    }

    if (parsedMessage.type === "message") {

    }
  });

  connection.on("close", () => {
    console.log("已經用者斷開連線");
    let dsID = connection.userId;
    // 從客戶端列表中移除
    if (connection.userId) {
      delete clients[connection.userId];
    }
    const otherClients = Object.keys(clients);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: "disconnected", otherClients , disconnectedID: dsID}));
      }
    });
  });
});

