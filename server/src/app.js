const express = require('express');
const cors = require('cors');

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// CLIENT_URL holds a comma-separated list of allowed origins (production frontend,
// localhost for dev, preview deployments, ...). Requests with no Origin header
// (curl, server-to-server, mobile) are always allowed since there's nothing to check.
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:4200')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} non autorisee par CORS`));
      }
    },
  })
);
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin/auth', authRoutes);

app.use((req, res) => res.status(404).json({ message: 'Route introuvable' }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Erreur serveur', error: err.message });
});

module.exports = app;
