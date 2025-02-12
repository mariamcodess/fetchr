const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
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

// Mock dog data
const dogs = [
  { id: '1', breed: 'Beagle', description: 'Friendly and curious', age: 2, gender: 'Male' },
  { id: '2', breed: 'Bulldog', description: 'Calm and courageous', age: 3, gender: 'Female' },
  { id: '3', breed: 'Poodle', description: 'Intelligent and active', age: 1, gender: 'Male' },
  { id: '4', breed: 'Golden Retriever', description: 'Friendly and tolerant', age: 4, gender: 'Female' }
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

// Signup endpoint
app.post('/auth/signup', (req, res) => {
  const { name, email, password } = req.body;
  const userExists = users.some(u => u.email === email);

  if (userExists) {
    res.status(400).send({ message: 'User already exists' });
  } else {
    users.push({ name, email, password });
    res.cookie('fetch-access-token', 'some-auth-token', { httpOnly: true, maxAge: 3600000 });
    res.status(201).send({ message: 'Signup successful' });
  }
});

// Logout endpoint
app.post('/auth/logout', (req, res) => {
  res.clearCookie('fetch-access-token');
  res.status(200).send({ message: 'Logout successful' });
});

// Get breeds endpoint
app.get('/dogs/breeds', (req, res) => {
  const breeds = [...new Set(dogs.map(dog => dog.breed))];
  res.status(200).send(breeds);
});

// Search dogs endpoint
app.get('/dogs/search', (req, res) => {
  const { breed, sortOrder, page = 1 } = req.query;
  const pageSize = 6;
  let filteredDogs = dogs;

  if (breed) {
    filteredDogs = filteredDogs.filter(dog => dog.breed === breed);
  }

  filteredDogs = filteredDogs.sort((a, b) => {
    if (sortOrder === 'desc') {
      return b.breed.localeCompare(a.breed);
    }
    return a.breed.localeCompare(b.breed);
  });

  const total = filteredDogs.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedDogs = filteredDogs.slice(startIndex, endIndex);

  res.status(200).send({
    resultIds: paginatedDogs.map(dog => dog.id),
    dogs: paginatedDogs.reduce((acc, dog) => {
      acc[dog.id] = dog;
      return acc;
    }, {}),
    total,
    next: endIndex < total ? page + 1 : null,
    prev: startIndex > 0 ? page - 1 : null
  });
});

// Match endpoint
app.post('/dogs/match', (req, res) => {
  const { favoriteIds } = req.body;
  const favoriteDogs = dogs.filter(dog => favoriteIds.includes(dog.id));
  const match = favoriteDogs[Math.floor(Math.random() * favoriteDogs.length)];
  res.status(200).send(match);
});

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});