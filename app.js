const fs = require('fs');
const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const dataFile = 'voting_data.json';

// Load the initial voting data from the JSON file
let votingData = [];
try {
  const data = fs.readFileSync(dataFile);
  votingData = JSON.parse(data);
} catch (error) {
  console.log('Error reading data file:', error);
}

// Get the current voting results
// Serve the results page
app.get('/results', (req, res) => {
  try {
    const data = fs.readFileSync(dataFile);
    const votingData = JSON.parse(data);
    res.json(votingData);
  } catch (error) {
    console.log('Error reading data file:', error);
    res.status(500).json({ error: 'Failed to retrieve voting data' });
  }
});



// Vote for an option
app.post('/vote', (req, res) => {
  const { option } = req.body;

  // Check if the option exists
  const existingOption = votingData.find((item) => item.option === option);
  if (!existingOption) {
    res.status(400).json({ error: 'Invalid option' });
    return;
  }

  // Increment the vote count for the selected option
  existingOption.votes++;

  // Save the updated voting data to the JSON file
  fs.writeFile(dataFile, JSON.stringify(votingData), (error) => {
    if (error) {
      console.log('Error writing data file:', error);
    }
  });

  res.json({ success: true });
});

// Serve the voting page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'vote.html'));
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
