const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: 'nxak1505@gmail.com', 
    pass: 'kqzn esvc oxgu zomn' 
  }
});

/**
 * Gửi email chào mừng đến người dùng mới
 * @param {string} to - Địa chỉ email của người nhận
 * @param {string} username - Tên người dùng
 */
const sendWelcomeEmail = async (to, username) => {
  const mailOptions = {
    from: '"WETECH" <nxak1505@gmail.com>', 
    to: to,
    subject: 'Chào mừng bạn đã đến với WETECH!',
    html: `
      <h1>Chào mừng, ${username}!</h1>
      <h3>Chúc mừng bạn đã chính thức đến với WETECH – nơi hội tụ của những sản phẩm công nghệ đỉnh cao và những trải nghiệm mua sắm mượt mà như chip Snapdragon!</h3>

Tài khoản của bạn đã được tạo thành công:

Giờ đây, bạn đã có thể:
<p>✅ Khám phá hàng ngàn sản phẩm công nghệ chính hãng  </p>
<p>✅ Theo dõi đơn hàng và lịch sử mua sắm dễ dàng  </p>
<p>✅ Nhận các ưu đãi chỉ dành riêng cho thành viên  </p>
<p>✅ Thanh toán an toàn, bảo mật chuẩn quốc tế  </p>

<p>🎁 **Đặc biệt:** Tặng bạn *[coupon, ưu đãi hoặc điểm tích lũy]* cho lần mua đầu tiên – chỉ cần đăng nhập và sử dụng!</p>

<p> Nếu có bất kỳ câu hỏi nào, đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn 24/7.  
📩 Liên hệ ngay: [nxak1505@gmail.com] | ☎️ Hotline: [0794757515]

<p>Cảm ơn bạn đã tin tưởng và lựa chọn WETECH.  
<p>Cùng nhau, chúng ta sẽ làm nên những trải nghiệm công nghệ tuyệt vời hơn mỗi ngày.</p></p>

<p>Trân trọng,  
<p>WETECH Team</p>

--- 

<p>📎 Lưu ý:</p>
<p>- Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email hoặc liên hệ với chúng tôi ngay để được hỗ trợ.</p>   
`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email chào mừng đã được gửi tới:', to);
  } catch (error) {
    console.error('Lỗi khi gửi email chào mừng:', error);
  }
};

module.exports = { sendWelcomeEmail };
