const WebSocket = require("ws");
const jwt = require("jsonwebtoken");

const clients = new Map();

function initializeWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws, request) => {
    try {
      const url = new URL(request.url, `http://${request.headers.host}`);
      const token = url.searchParams.get("token");

      if (!token) {
        ws.close();
        return;
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const userId = decoded.id;

      clients.set(userId, ws);

      console.log(`User ${userId} connected`);

      ws.on("close", () => {
        clients.delete(userId);
        console.log(`User ${userId} disconnected`);
      });

    } catch (err) {
      ws.close();
    }
  });
}

function sendNotification(userId, notification) {
  const socket = clients.get(userId.toString());

  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(notification));
  }
}

module.exports = {
  initializeWebSocket,
  sendNotification,
};