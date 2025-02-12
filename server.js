const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:3001', credentials: true }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'public')));

// Mock user data
const users = [
  { name: 'John Doe', email: 'john@example.com' },
  { name: 'Jane Doe', email: 'jane@example.com' }
];

// Login endpoint
app.post('/auth/login', (req, res) => {
  const { name, email } = req.body;
  const user = users.find(u => u.name === name && u.email === email);

  if (user) {
    res.cookie('fetch-access-token', 'some-auth-token', { httpOnly: true, maxAge: 3600000 });
    res.status(200).send({ message: 'Login successful' });
  } else {
    res.status(401).send({ message: 'Invalid credentials' });
  }
});

// Logout endpoint
app.post('/auth/logout', (req, res) => {
  res.clearCookie('fetch-access-token');
  res.status(200).send({ message: 'Logout successful' });
});

// Get breeds endpoint
app.get('/dogs/breeds', (req, res) => {
  const breeds = ['Beagle', 'Bulldog', 'Poodle', 'Golden Retriever'];
  res.status(200).send(breeds);
});

// Search dogs endpoint
app.get('/dogs/search', (req, res) => {
  // Mock search results
  const resultIds = ['1', '2', '3'];
  res.status(200).send({ resultIds, total: 3, next: null, prev: null });
});

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});