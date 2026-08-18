const Order = require('../models/Order');
const Product = require('../models/Product');
const { sendNewOrderEmail } = require('../services/mailer');

async function create(req, res) {
  const { productId, quantity, nom, prenom, telephone, ville, adresse, genre, age } = req.body;

  if (!productId || !nom || !prenom || !telephone || !adresse) {
    return res.status(400).json({ message: 'productId, nom, prenom, telephone et adresse sont requis' });
  }

  if (!/^[0-9]{8}$/.test(telephone)) {
    return res.status(400).json({ message: 'Le numero de telephone doit contenir exactement 8 chiffres' });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: 'Montre introuvable' });
  }

  const order = await Order.create({
    product: product._id,
    quantity: quantity || 1,
    nom,
    prenom,
    telephone,
    ville,
    adresse,
    genre: genre === 'HOMME' || genre === 'FEMME' ? genre : null,
    age: age ? Number(age) : null,
  });

  // Awaited on purpose: in a serverless function, anything left running after the
  // response is sent can get frozen/killed before it finishes, silently dropping
  // the notification email. Awaiting guarantees each order's email fully sends
  // (or fails loudly in logs) before this invocation ends.
  try {
    await sendNewOrderEmail(order, product);
  } catch (err) {
    console.error('Erreur envoi email de notification :', err.message);
  }

  res.status(201).json({ message: 'Commande enregistree', order });
}

async function listAdmin(req, res) {
  const orders = await Order.find().populate('product').sort({ createdAt: -1 });
  res.json(orders);
}

async function updateStatus(req, res) {
  const { statut } = req.body;
  if (!['EN_ATTENTE', 'CONFIRMEE', 'ANNULEE'].includes(statut)) {
    return res.status(400).json({ message: 'Statut invalide' });
  }

  const order = await Order.findByIdAndUpdate(req.params.id, { statut }, { new: true }).populate('product');
  if (!order) return res.status(404).json({ message: 'Commande introuvable' });

  res.json(order);
}

module.exports = { create, listAdmin, updateStatus };
