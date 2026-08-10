const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');

async function seedAdminIfNeeded() {
  const count = await Admin.countDocuments();
  if (count > 0) return;

  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  const nom = process.env.SEED_ADMIN_NOM || 'Admin';

  if (!email || !password) {
    console.warn('Aucun admin en base et SEED_ADMIN_EMAIL/SEED_ADMIN_PASSWORD non definis : creation manuelle requise');
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await Admin.create({ email: email.toLowerCase().trim(), passwordHash, nom });
  console.log(`Admin initial cree : ${email}`);
}

module.exports = seedAdminIfNeeded;
