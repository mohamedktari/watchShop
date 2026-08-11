const mongoose = require('mongoose');

// Cached across warm serverless invocations (module-level state survives between
// invocations on the same warm Lambda instance, avoiding exhausting Atlas's
// connection limit by reconnecting on every request).
let cached = global._mongooseConn;
if (!cached) {
  cached = global._mongooseConn = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI manquant dans les variables d'environnement");
    }
    cached.promise = mongoose.connect(uri).then((m) => {
      console.log('MongoDB connecte');
      return m;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = connectDB;
