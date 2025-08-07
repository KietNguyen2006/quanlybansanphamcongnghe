const { Cart, CartItem, Product } = require('../models');

// Helper: Lấy hoặc tạo giỏ hàng cho user
async function findOrCreateCart(userId) {
  let cart = await Cart.findOne({ where: { userId } });
  if (!cart) cart = await Cart.create({ userId });
  return cart;
}

// Lấy giỏ hàng của user
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({
      where: { userId },
      include: [{ model: CartItem, include: [Product] }],
    });
    if (!cart) return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Thêm sản phẩm vào giỏ hàng
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.id;
    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    if (product.stock < quantity) return res.status(400).json({ message: 'Sản phẩm không đủ số lượng' });
    const cart = await findOrCreateCart(userId);
    let item = await CartItem.findOne({ where: { cartId: cart.id, productId } });
    if (item) {
      item.quantity += quantity;
      await item.save();
    } else {
      item = await CartItem.create({ cartId: cart.id, productId, quantity });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật số lượng sản phẩm trong giỏ
exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;
    if (quantity < 1) return res.status(400).json({ message: 'Số lượng phải lớn hơn 0' });
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
    const item = await CartItem.findOne({ where: { cartId: cart.id, productId } });
    if (!item) return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong giỏ hàng' });
    const product = await Product.findByPk(productId);
    if (!product || product.stock < quantity) return res.status(400).json({ message: 'Sản phẩm không đủ số lượng' });
    item.quantity = quantity;
    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa sản phẩm khỏi giỏ hàng
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
    const item = await CartItem.findOne({ where: { cartId: cart.id, productId } });
    if (!item) return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong giỏ hàng' });
    await item.destroy();
    res.json({ message: 'Đã xóa sản phẩm khỏi giỏ hàng' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa toàn bộ giỏ hàng
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
    await CartItem.destroy({ where: { cartId: cart.id } });
    res.json({ message: 'Đã xóa toàn bộ giỏ hàng' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};