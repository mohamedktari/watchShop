require('dotenv').config();

const app = require('../src/app');
const connectDB = require('../src/config/db');
const seedAdminIfNeeded = require('../src/seedAdmin');

// Runs once per cold start; cached across warm invocations of the same instance.
// connectDB() itself also caches the underlying Mongoose connection (see config/db.js),
// so this just guards against re-running the admin-seed query on every warm request.
let readyPromise;
function ensureReady() {
  if (!readyPromise) {
    readyPromise = connectDB().then(() => seedAdminIfNeeded());
  }
  return readyPromise;
}

module.exports = async (req, res) => {
  try {
    await ensureReady();
  } catch (err) {
    console.error('Echec initialisation (DB/seed):', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
    return;
  }
  app(req, res);
};
