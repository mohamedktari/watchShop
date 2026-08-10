const Order = require('../models/Order');
const Product = require('../models/Product');
const { sendNewOrderEmail } = require('../services/mailer');

async function create(req, res) {
  const { productId, quantity, nom, prenom, telephone, ville, adresse } = req.body;

  if (!productId || !nom || !prenom || !telephone || !ville || !adresse) {
    return res.status(400).json({ message: 'productId, nom, prenom, telephone, ville et adresse sont requis' });
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
  });

  sendNewOrderEmail(order, product).catch((err) =>
    console.error('Erreur envoi email de notification :', err.message)
  );

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
