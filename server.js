const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serve frontend files

// Setup responses storage file
const dbPath = path.join(__dirname, 'responses.json');
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify([]));
}

// Ensure unique responses
app.post('/api/rsvp', (req, res) => {
  try {
    const { name, phone, guests, events } = req.body;
    
    // Validate request
    if (!name || !phone || !guests) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newResponse = {
      id: Date.now().toString(),
      name,
      phone,
      guests,
      events,
      timestamp: new Date().toISOString()
    };

    // Read current data
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Check if phone number already RSVP'd to prevent spam (optional)
    const existingIndex = data.findIndex(r => r.phone === phone);
    if (existingIndex > -1) {
      // Update existing
      data[existingIndex] = { ...data[existingIndex], ...newResponse };
    } else {
      // Add new
      data.push(newResponse);
    }

    // Save
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

    res.status(200).json({ success: true, message: 'RSVP saved properly' });
  } catch (err) {
    console.error('Error saving RSVP:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to fetch responses for the dashboard
app.get('/api/responses', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    res.status(200).json(data);
  } catch (err) {
    console.error('Error fetching responses:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  console.log(`RSVP Page info: http://localhost:${PORT}/index.html`);
  console.log(`Dashboard view: http://localhost:${PORT}/dashboard.html`);
});
