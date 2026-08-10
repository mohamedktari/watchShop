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

  const subtotal = product.price * order.quantity;
  const total = subtotal + DELIVERY_FEE;

  const html = `
    <h2>Nouvelle commande recue</h2>
    <p><strong>Montre :</strong> ${product.nameFr}</p>
    <p><strong>Quantite :</strong> ${order.quantity}</p>
    <p><strong>Prix unitaire :</strong> ${product.price} TND</p>
    <p><strong>Sous-total :</strong> ${subtotal} TND</p>
    <p><strong>Livraison :</strong> +${DELIVERY_FEE} TND</p>
    <p><strong>Total :</strong> ${total} TND</p>
    <hr/>
    <p><strong>Client :</strong> ${order.prenom} ${order.nom}</p>
    <p><strong>Telephone :</strong> ${order.telephone}</p>
    <p><strong>Ville :</strong> ${order.ville}</p>
    <p><strong>Adresse :</strong> ${order.adresse}</p>
    <p><strong>Date :</strong> ${new Date(order.createdAt).toLocaleString('fr-FR')}</p>
  `;

  await transporter.sendMail({
    from: `"WatchShop" <${process.env.GMAIL_USER}>`,
    to,
    subject: `Nouvelle commande : ${product.nameFr} x${order.quantity}`,
    html,
  });
}

module.exports = { sendNewOrderEmail };
