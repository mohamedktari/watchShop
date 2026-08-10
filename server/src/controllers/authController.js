const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

function signToken(admin) {
  return jwt.sign(
    { id: admin._id, email: admin.email, nom: admin.nom },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe requis' });
  }

  const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
  if (!admin) {
    return res.status(401).json({ message: 'Identifiants incorrects' });
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: 'Identifiants incorrects' });
  }

  const token = signToken(admin);
  res.json({ token, admin: { id: admin._id, email: admin.email, nom: admin.nom } });
}

async function register(req, res) {
  const { email, password, nom } = req.body;
  if (!email || !password || !nom) {
    return res.status(400).json({ message: 'Email, mot de passe et nom requis' });
  }

  const existing = await Admin.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    return res.status(409).json({ message: 'Un admin avec cet email existe deja' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const admin = await Admin.create({ email: email.toLowerCase().trim(), passwordHash, nom });

  res.status(201).json({ id: admin._id, email: admin.email, nom: admin.nom });
}

module.exports = { login, register };
