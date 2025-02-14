const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const axios = require('axios');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Mock user data
const users = [
  { name: 'John Doe', email: 'john@example.com', password: 'password' },
  { name: 'Jane Doe', email: 'jane@example.com', password: 'password' }
];

// Middleware to check for auth cookie
const requireAuth = (req, res, next) => {
  const token = req.cookies['fetch-access-token'];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

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
app.get('/dogs/breeds', requireAuth, async (req, res) => {
  try {
    const response = await axios.get('https://frontend-take-home-service.fetch.com/dogs/breeds', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${req.cookies['fetch-access-token']}`
      },
      withCredentials: true
    });
    const breeds = response.data;
    res.status(200).json(breeds);
  } catch (error) {
    console.error('Error fetching breeds:', error);
    res.status(500).json({ error: 'Failed to fetch breeds' });
  }
});

// Search dogs endpoint
app.get('/dogs/search', requireAuth, async (req, res) => {
  const { breeds, zipCodes, ageMin, ageMax, size = 25, from, sort } = req.query;
  try {
    const response = await axios.get('https://frontend-take-home-service.fetch.com/dogs/search', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${req.cookies['fetch-access-token']}`
      },
      params: { breeds, zipCodes, ageMin, ageMax, size, from, sort },
      withCredentials: true
    });
    const data = response.data;
    res.status(200).json(data);
  } catch (error) {
    console.error('Error searching dogs:', error);
    res.status(500).json({ error: 'Failed to search dogs' });
  }
});

// Match endpoint
app.post('/dogs/match', requireAuth, async (req, res) => {
  const { favoriteIds } = req.body;
  try {
    const response = await axios.post('https://frontend-take-home-service.fetch.com/dogs/match', { favoriteIds }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${req.cookies['fetch-access-token']}`
      },
      withCredentials: true
    });
    const match = response.data;
    res.status(200).json(match);
  } catch (error) {
    console.error('Error matching dogs:', error);
    res.status(500).json({ error: 'Failed to match dogs' });
  }
});

// Search locations endpoint
app.post('/locations/search', requireAuth, async (req, res) => {
  const { city, states, geoBoundingBox, size = 25, from } = req.body;
  try {
    const response = await axios.post('https://frontend-take-home-service.fetch.com/locations/search', {
      city,
      states,
      geoBoundingBox,
      size,
      from
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${req.cookies['fetch-access-token']}`
      },
      withCredentials: true
    });

    const { results, total } = response.data;
    res.status(200).json({ results, total });
  } catch (error) {
    console.error('Error searching locations:', error);
    res.status(500).json({ error: 'Failed to search locations' });
  }
});

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});