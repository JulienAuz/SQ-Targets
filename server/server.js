const WebSocket = require('ws');

// Create a new WebSocket server on port 1234
const wss = new WebSocket.Server({ port: 1234 });

// Function to generate a random number between min and max (inclusive)
function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

// Function to generate a random 2D coordinate
function getRandomCoordinate() {
  const x = getRandomNumber(-10, 10).toFixed(1);
  const y = getRandomNumber(-10, 10).toFixed(1);
  return { x, y };
}

// Send a random "impact position" to each connected client every second
function sendImpactPosition() {
  wss.clients.forEach((client) => {
    const coordinate = getRandomCoordinate();
    console.log(`Sending impact position: ${JSON.stringify(coordinate)}`);
    client.send(JSON.stringify(coordinate));
  });
}

// Trigger sending the "impact position" every second
setInterval(sendImpactPosition, 1000);

// Log a message when the server starts listening
wss.on('listening', () => {
  console.log('WebSocket server is listening on port 1234');
});

// Log a message when a client connects to the server
wss.on('connection', (ws) => {
  console.log('A client connected');
  
  // Log a message when a client disconnects from the server
  ws.on('close', () => {
    console.log('A client disconnected');
  });
});