const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    nameFr: { type: String, required: true, trim: true },
    nameAr: { type: String, required: true, trim: true },
    descriptionFr: { type: String, default: '' },
    descriptionAr: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0, default: null },
    images: [{ type: String }],
    stock: { type: Number, default: 0, min: 0 },
    category: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
