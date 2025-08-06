const { Product } = require('../models');

// Giỏ hàng tạm thời (trong thực tế nên dùng Redis hoặc database)
let carts = {};

exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = carts[userId] || [];
    
    // Lấy thông tin chi tiết sản phẩm
    const cartWithDetails = await Promise.all(
      cart.map(async (item) => {
        const product = await Product.findByPk(item.productId);
        return {
          ...item,
          product: product
        };
      })
    );

    res.json(cartWithDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.id;

    // Kiểm tra sản phẩm tồn tại
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    // Kiểm tra tồn kho
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Sản phẩm không đủ số lượng' });
    }

    // Khởi tạo giỏ hàng nếu chưa có
    if (!carts[userId]) {
      carts[userId] = [];
    }

    // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
    const existingItem = carts[userId].find(item => item.productId === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      carts[userId].push({
        productId,
        quantity,
        price: product.price
      });
    }

    res.json({ message: 'Đã thêm vào giỏ hàng', cart: carts[userId] });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    if (!carts[userId]) {
      return res.status(404).json({ message: 'Giỏ hàng trống' });
    }

    const item = carts[userId].find(item => item.productId === parseInt(productId));
    if (!item) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong giỏ hàng' });
    }

    // Kiểm tra tồn kho
    const product = await Product.findByPk(productId);
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Sản phẩm không đủ số lượng' });
    }

    item.quantity = quantity;
    res.json({ message: 'Đã cập nhật giỏ hàng', cart: carts[userId] });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    if (!carts[userId]) {
      return res.status(404).json({ message: 'Giỏ hàng trống' });
    }

    carts[userId] = carts[userId].filter(item => item.productId !== parseInt(productId));
    res.json({ message: 'Đã xóa sản phẩm khỏi giỏ hàng', cart: carts[userId] });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    carts[userId] = [];
    res.json({ message: 'Đã xóa giỏ hàng' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 