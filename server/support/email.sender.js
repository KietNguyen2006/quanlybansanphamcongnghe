const nodeMailer = require('nodemailer');
const Configuration = require('../src/config/Configuration');

const emailSender = async({email, subject, html}) => {
    try {
        const transporter = nodeMailer.createTransport({
            host: 'smtp.gmail.com',
            service: 'gmail',
            auth: {
                user: Configuration.GMAIL.USER, 
                pass: Configuration.GMAIL.PASS
            }
        });
        const message = {
            from: Configuration.GMAIL.USER,
            to: email,
            subject: subject,
            html: html
        };
        // Send mail
        const info = await transporter.sendMail(message);
        return info;
    } catch (error) {
        // Có thể log lỗi hoặc trả về lỗi tuỳ ý
        throw error;
    }
}

module.exports = emailSender;