require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');
const seedAdminIfNeeded = require('./seedAdmin');

const PORT = process.env.PORT || 4000;

async function start() {
  await connectDB();
  await seedAdminIfNeeded();
  app.listen(PORT, () => console.log(`Serveur demarre sur le port ${PORT}`));
}

start().catch((err) => {
  console.error('Echec du demarrage du serveur :', err);
  process.exit(1);
});
