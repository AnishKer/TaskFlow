// Authentication controller
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// In-memory user store for demo (replace with DB in production)
const users = [
  { id: 1, username: 'admin', password: bcrypt.hashSync('admin123', 8), role: 'admin' },
  { id: 2, username: 'user', password: bcrypt.hashSync('user123', 8), role: 'user' }
];

function generateToken(user) {
  return jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

exports.login = (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
  const token = generateToken(user);
  res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
};

exports.signup = (req, res) => {
  const { username, password, role } = req.body;
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: 'Username already exists' });
  }
  const id = users.length + 1;
  const hashed = bcrypt.hashSync(password, 8);
  const user = { id, username, password: hashed, role: role || 'user' };
  users.push(user);
  const token = generateToken(user);
  res.status(201).json({ token, user: { id, username, role: user.role } });
};
