const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI manquant dans les variables d\'environnement');
  }
  await mongoose.connect(uri);
  console.log('MongoDB connecte');
}

module.exports = connectDB;
