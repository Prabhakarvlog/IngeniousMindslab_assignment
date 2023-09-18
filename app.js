const express = require('express');
const bodyParser = require('body-parser');
const faker = require('faker');
const app = express();
const port = 3000;

app.use(bodyParser.json());

// In-memory storage for users and candidates
const users = [];
const candidates = [];

// User and Candidate models
class User {
  constructor(username, password) {
    this.id = faker.datatype.uuid();
    this.username = username;
    this.password = password;
    this.voted = false;
  }
}

class Candidate {
  constructor(name) {
    this.id = faker.datatype.uuid();
    this.name = name;
    this.votes = 0;
  }
}

// Register a new user
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Check if the username is already taken
  if (users.some(user => user.username === username)) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  const newUser = new User(username, password);
  users.push(newUser);
  res.status(201).json({ message: 'User registered successfully' });
});

// Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(user => user.username === username && user.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  if (user.voted) {
    return res.status(400).json({ message: 'You have already voted' });
  }

  res.json({ message: 'Login successful', userId: user.id });
});

// List candidates
app.get('/candidates', (req, res) => {
  res.json(candidates);
});

// Vote for a candidate
app.post('/vote', (req, res) => {
  const { userId, candidateId } = req.body;

  const user = users.find(user => user.id === userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (user.voted) {
    return res.status(400).json({ message: 'You have already voted' });
  }

  const candidate = candidates.find(candidate => candidate.id === candidateId);

  if (!candidate) {
    return res.status(404).json({ message: 'Candidate not found' });
  }

  candidate.votes++;
  user.voted = true;
  res.json({ message: 'Vote cast successfully' });
});

// Create some sample candidates
candidates.push(new Candidate('Candidate 1'));
candidates.push(new Candidate('Candidate 2'));
candidates.push(new Candidate('Candidate 3'));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
