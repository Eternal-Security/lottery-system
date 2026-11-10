const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const dbFile = 'lottery-data.json';

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Initialize data structure
let numbers = [];

// Load or create data
if (fs.existsSync(dbFile)) {
  numbers = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
} else {
  for (let i = 1; i <= 100; i++) {
    numbers.push({ number: i, reserved: 0, participant_name: null });
  }
  saveData();
}

function saveData() {
  fs.writeFileSync(dbFile, JSON.stringify(numbers, null, 2));
}

// API Routes
app.get('/api/numbers', (req, res) => {
  res.json(numbers);
});

app.post('/api/admin/reserve', (req, res) => {
  const { number, participantName } = req.body;
  
  try {
    const index = numbers.findIndex(n => n.number === number);
    if (index !== -1) {
      numbers[index].reserved = 1;
      numbers[index].participant_name = participantName || null;
      saveData();
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, error: 'Number not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/admin/unreserve', (req, res) => {
  const { number } = req.body;
  
  try {
    const index = numbers.findIndex(n => n.number === number);
    if (index !== -1) {
      numbers[index].reserved = 0;
      numbers[index].participant_name = null;
      saveData();
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, error: 'Number not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Public view: http://localhost:${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/admin.html`);
});
