const { Order, OrderItem, Product } = require('../models');

exports.createOrder = async (req, res) => {
  try {
    const { items, customerName, customerPhone, customerDob, customerAddress } = req.body;
    let totalAmount = 0;

    // Tính tổng tiền và kiểm tra tồn kho
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Không tìm thấy sản phẩm với ID ${item.productId}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Sản phẩm ${product.name} không đủ số lượng` });
      }
      totalAmount += product.price * item.quantity;
    }

    // Tạo đơn hàng
    const order = await Order.create({
      userId: req.user ? req.user.id : null,
      customerName,
      customerPhone,
      customerDob,
      customerAddress,
      totalAmount
    });

    // Tạo chi tiết đơn hàng và cập nhật tồn kho
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: product.price
      });
      await product.update({ stock: product.stock - item.quantity });
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [{
        model: OrderItem,
        include: [Product]
      }]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }
    await order.update({ status });
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};