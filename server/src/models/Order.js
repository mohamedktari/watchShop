const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    nom: { type: String, required: true, trim: true },
    prenom: { type: String, required: true, trim: true },
    telephone: { type: String, required: true, trim: true },
    ville: { type: String, required: true, trim: true },
    adresse: { type: String, required: true, trim: true },
    statut: {
      type: String,
      enum: ['EN_ATTENTE', 'CONFIRMEE', 'ANNULEE'],
      default: 'EN_ATTENTE',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
