const Product = require('../models/Product');

async function listPublic(req, res) {
  const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
  res.json(products);
}

async function getOne(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Montre introuvable' });
  res.json(product);
}

async function listAdmin(req, res) {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
}

function parseDiscountPrice(value) {
  if (value === undefined || value === null || value === '') return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}

async function create(req, res) {
  const { nameFr, nameAr, descriptionFr, descriptionAr, price, discountPrice, stock, category, isActive } = req.body;
  if (!nameFr || !nameAr || price === undefined) {
    return res.status(400).json({ message: 'nameFr, nameAr et price sont requis' });
  }

  const images = (req.files || []).map((f) => f.path);

  const product = await Product.create({
    nameFr,
    nameAr,
    descriptionFr,
    descriptionAr,
    price,
    discountPrice: parseDiscountPrice(discountPrice),
    stock,
    category,
    isActive: isActive === undefined ? true : isActive,
    images,
  });

  res.status(201).json(product);
}

async function update(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Montre introuvable' });

  const fields = ['nameFr', 'nameAr', 'descriptionFr', 'descriptionAr', 'price', 'stock', 'category', 'isActive'];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) product[f] = req.body[f];
  });
  if (req.body.discountPrice !== undefined) {
    product.discountPrice = parseDiscountPrice(req.body.discountPrice);
  }

  const newImages = (req.files || []).map((f) => f.path);
  if (newImages.length > 0) {
    product.images = product.images.concat(newImages);
  }

  await product.save();
  res.json(product);
}

async function remove(req, res) {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Montre introuvable' });
  res.json({ message: 'Montre supprimee' });
}

module.exports = { listPublic, getOne, listAdmin, create, update, remove };
