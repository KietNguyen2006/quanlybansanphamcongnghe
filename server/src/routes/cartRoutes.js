const express = require('express');
const { authenticate } = require('../middlewares/auth');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');

const router = express.Router();

// Tất cả các định tuyến trong giỏ hàng đều yêu cầu đăng nhập
router.use(authenticate);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/:productId', updateCartItem);
router.delete('/:productId', removeFromCart);
router.delete('/', clearCart);

module.exports = router;
