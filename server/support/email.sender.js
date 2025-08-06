const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmail({ email, subject, html, attachments }) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    html,
    attachments,
  });
}

async function sendOrderExcelEmail({ email, username, orderId, excelBuffer }) {
  await sendEmail({
    email,
    subject: `Đơn hàng #${orderId} của bạn - File Excel đính kèm`,
    html: `<p>Xin chào <b>${username}</b>,<br>Đơn hàng #${orderId} của bạn đã được đặt thành công. File chi tiết đơn hàng đính kèm bên dưới.<br>Trân trọng!</p>`,
    attachments: [
      {
        filename: `order_${orderId}.xlsx`,
        content: excelBuffer,
      },
    ],
  });
}

module.exports = {
  sendEmail,
  sendOrderExcelEmail,
};