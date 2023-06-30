const socket = new WebSocket('ws://localhost:1234');

function drawTarget() {
  const canvas = document.getElementById('target-canvas');
  const context = canvas.getContext('2d');
  const radiusIncrement = 36;
  const numCircles = 10;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  context.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = numCircles; i > 0; i--) {
    const radius = i * radiusIncrement;
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    context.strokeStyle = 'black';
    context.lineWidth = 2;
    context.fillStyle = 'transparent';
    context.stroke();
    context.fill();
  }
}

drawTarget();

socket.onmessage = (event) => {
  const impact = JSON.parse(event.data);
  updateImpactsList(impact);
  updateTargetDisplay(impact);
  updateScoreInfo();
};

function updateImpactsList(impact) {
  const table = document.getElementById('impacts-table');
  const row = table.insertRow(1);
  row.insertCell(0).textContent = `(${impact.x}, ${impact.y})`;
  row.insertCell(1).textContent = calculateIntegerScore(impact);
  row.insertCell(2).textContent = calculateDecimalScore(impact);

  // Check if the number of rows exceeds the limit
  const rowCount = table.rows.length;
  const rowLimit = 21; // Set the desired row limit

  if (rowCount > rowLimit) {
    // Remove the oldest row
    table.deleteRow(-1);
  }
}

function updateTargetDisplay(impact) {
  const canvas = document.getElementById('target-canvas');
  const context = canvas.getContext('2d');
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const scale = 36;

  const x = centerX + impact.x * scale;
  const y = centerY - impact.y * scale;

  // Draw the red circle at the impact point
  context.beginPath();
  context.arc(x, y, 5, 0, 2 * Math.PI);
  context.fillStyle = 'red';
  context.fill();
}

function calculateIntegerScore(impact) {
  const distanceFromCenter = Math.sqrt(impact.x ** 2 + impact.y ** 2);
  return Math.max(0, 10 - Math.floor(distanceFromCenter));
}

function calculateDecimalScore(impact) {
  const distanceFromCenter = Math.sqrt(impact.x ** 2  + impact.y ** 2);
  return Math.max(0, (10 - distanceFromCenter).toFixed(1));
}

function updateScoreInfo() {
  const displayMode = document.getElementById('display-mode').value;
  const impacts = document.querySelectorAll('#impacts-table tr:not(:first-child)');
  let totalScore = 0;

  impacts.forEach((impact) => {
    const integerScore = parseInt(impact.cells[1].textContent, 10);
    const decimalScore = parseFloat(impact.cells[2].textContent);

    if (displayMode === 'integer') {
      totalScore += Math.max(0, integerScore);
    } else {
      totalScore += Math.max(0, decimalScore);
    }
  });

  document.getElementById('total-score').textContent = displayMode === 'integer' ? totalScore.toFixed(0) : totalScore.toFixed(1);
}

document.getElementById('display-mode').addEventListener('change', () => {
  updateScoreInfo();
});

// Clean up the impacts list and target display on WebSocket close
socket.onclose = () => {
  document.getElementById('impacts-table').innerHTML = '<tr><th>Coordinate</th><th>Integer Score</th><th>Decimal Score</th></tr>';
  document.getElementById('target-display').innerHTML = '';
};
