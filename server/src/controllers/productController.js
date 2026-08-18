const Product = require('../models/Product');
const { cloudinary } = require('../services/cloudinary');

// Cloudinary URLs look like https://res.cloudinary.com/<cloud>/image/upload/v123/watchshop/products/abc.jpg
// the public_id needed to delete the asset is the folder+filename in between, without the version or extension.
function extractPublicId(url) {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
  return match ? match[1] : null;
}

async function deleteCloudinaryImages(urls) {
  await Promise.all(
    urls.map(async (url) => {
      const publicId = extractPublicId(url);
      if (!publicId) return;
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error('Erreur suppression image Cloudinary :', err.message);
      }
    })
  );
}

async function listPublic(req, res) {
  const products = await Product.find({ isActive: true }).sort({ sortOrder: -1, createdAt: -1 });
  res.json(products);
}

async function getOne(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Montre introuvable' });
  res.json(product);
}

async function listAdmin(req, res) {
  const products = await Product.find().sort({ sortOrder: -1, createdAt: -1 });
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

  if (req.body.existingImages !== undefined) {
    let keptImages;
    try {
      keptImages = JSON.parse(req.body.existingImages);
    } catch {
      keptImages = product.images;
    }
    const removedImages = product.images.filter((url) => !keptImages.includes(url));
    if (removedImages.length > 0) {
      await deleteCloudinaryImages(removedImages);
    }
    product.images = keptImages.concat(newImages);
  } else if (newImages.length > 0) {
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

async function moveToTop(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Montre introuvable' });

  const highest = await Product.findOne().sort({ sortOrder: -1 });
  product.sortOrder = (highest ? highest.sortOrder : 0) + 1;
  await product.save();

  res.json(product);
}

module.exports = { listPublic, getOne, listAdmin, create, update, remove, moveToTop };
