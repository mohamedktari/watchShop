const nodemailer = require('nodemailer');

const DELIVERY_FEE = 8;

function getTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

async function sendNewOrderEmail(order, product) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn('GMAIL_USER / GMAIL_APP_PASSWORD non configures, email non envoye');
    return;
  }

  const transporter = getTransporter();
  const to = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.GMAIL_USER;

  const hasDiscount = product.discountPrice != null && product.discountPrice < product.price;
  const unitPrice = hasDiscount ? product.discountPrice : product.price;
  const subtotal = unitPrice * order.quantity;
  const total = subtotal + DELIVERY_FEE;

  const html = `
    <h2>Nouvelle commande recue</h2>
    <p><strong>Montre :</strong> ${product.nameFr}</p>
    <p><strong>Quantite :</strong> ${order.quantity}</p>
    <p><strong>Prix unitaire :</strong> ${hasDiscount ? `<s>${product.price} TND</s> ${unitPrice} TND (promo)` : `${unitPrice} TND`}</p>
    <p><strong>Sous-total :</strong> ${subtotal} TND</p>
    <p><strong>Livraison :</strong> +${DELIVERY_FEE} TND</p>
    <p><strong>Total :</strong> ${total} TND</p>
    <hr/>
    <p><strong>Client :</strong> ${order.prenom} ${order.nom}</p>
    <p><strong>Telephone :</strong> ${order.telephone}</p>
    <p><strong>Adresse :</strong> ${order.adresse}</p>
    ${order.genre ? `<p><strong>Genre :</strong> ${order.genre === 'HOMME' ? 'Homme' : 'Femme'}</p>` : ''}
    ${order.age ? `<p><strong>Age :</strong> ${order.age} ans</p>` : ''}
    <p><strong>Date :</strong> ${new Date(order.createdAt).toLocaleString('fr-FR')}</p>
  `;

  await transporter.sendMail({
    from: `"Tivlo" <${process.env.GMAIL_USER}>`,
    to,
    subject: `Nouvelle commande : ${product.nameFr} x${order.quantity}`,
    html,
  });
}

module.exports = { sendNewOrderEmail };
