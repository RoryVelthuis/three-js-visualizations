// simple-websocket-client.js
const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:5174/');

ws.on('open', function open() {
  console.log('WebSocket connection established');
  ws.send(JSON.stringify({ Test: "Hello Server" }));
});

ws.on('message', function incoming(data) {
  console.log('WebSocket message received:', data);
});

ws.on('close', function close(code, reason) {
  console.log(`WebSocket connection closed. Code: ${code}, Reason: ${reason}`);
});

ws.on('error', function error(err) {
  console.error('WebSocket error:', err);
});
