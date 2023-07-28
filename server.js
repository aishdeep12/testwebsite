const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// Serve static files
app.use(express.static(__dirname));

// Load data from the Excel file
app.get('/load-data', (req, res) => {
  const filePath = path.join(__dirname, 'skulist.xlsx');

  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      res.status(500).send('Error loading data.');
      return;
    }

    res.setHeader('Content-Type', 'application/octet-stream');
    res.send(data);
  });
});

// Fetch data from the Excel file
app.get('/fetch-data', (req, res) => {
  const filePath = path.join(__dirname, 'skulist.xlsx');

  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      res.status(500).json('Error fetching data.');
      return;
    }

    const workbook = XLSX.read(data, { type: 'buffer' });
    const worksheet = workbook.Sheets['Sheet1']; // Adjust sheet name as needed
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    res.json(jsonData);
  });
});

// Start the server
const port = 8080;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
