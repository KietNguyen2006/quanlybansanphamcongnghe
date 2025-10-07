const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST, // Ensure these are in your .env
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM, // Your sender address
      to: to,
      subject: subject,
      html: html,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email could not be sent');
  }
};

const sendOrderConfirmationEmail = async (order) => {
  const subject = 'Order Confirmation';
  // Corrected HTML structure: Use a single <p> or use <div> for multiple blocks
  const html = `
    <div>
      <h1>Thank you for your order!</h1>
      <p>Your order ID is: <strong>${order.id}</strong></p>
      <p>We are preparing your items for shipment and will notify you once they are on their way.</p>
      <p>Thank you for shopping with us!</p>
    </div>
  `;
  await sendEmail(order.customerEmail, subject, html);
};

module.exports = {
  sendOrderConfirmationEmail,
  sendEmail, // Also export the base function if needed elsewhere
};