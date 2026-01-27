const userService = require('../service/userService');
const jwt = require('jsonwebtoken');
const SECRET = 'supersecret';

exports.register = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
  const user = userService.register(username, password);
  if (!user) return res.status(409).json({ error: 'User already exists' });
  res.status(201).json({ id: user.id, username: user.username });
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  const user = userService.findByUsername(username);
  if (!user || user.password !== password) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '1h' });
  res.json({ token });
};
