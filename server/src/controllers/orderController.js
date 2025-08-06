const crypto = require('crypto');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const { Order, OrderItem, Product } = require('../models');
const ExcelJS = require('exceljs');
const { sendOrderExcelEmail } = require('../../support/email.sender');

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

    // Xuất file Excel đơn hàng
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Order');
    sheet.columns = [
      { header: 'Tên sản phẩm', key: 'name', width: 30 },
      { header: 'Số lượng', key: 'quantity', width: 10 },
      { header: 'Đơn giá', key: 'price', width: 15 },
      { header: 'Thành tiền', key: 'total', width: 20 },
    ];
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      sheet.addRow({
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        total: product.price * item.quantity,
      });
    }
    sheet.addRow({});
    sheet.addRow({ name: 'Tổng cộng', total: totalAmount });
    const buffer = await workbook.xlsx.writeBuffer();
    // Gửi mail nếu có email
    if (req.user && req.user.email) {
      await sendOrderExcelEmail({
        email: req.user.email,
        username: req.user.username || customerName,
        orderId: order.id,
        excelBuffer: buffer,
      });
    } else if (customerName && customerPhone) {
      // Nếu là khách chưa đăng nhập, có thể gửi qua email nhập ngoài (nếu có)
      // (Có thể mở rộng nếu muốn)
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