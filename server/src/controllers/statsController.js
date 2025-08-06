const { Order, OrderItem, Product, User } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

exports.getOrderStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let whereClause = {};
    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    // Thống kê theo trạng thái đơn hàng
    const statusStats = await Order.findAll({
      where: whereClause,
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status']
    });

    // Tổng doanh thu
    const totalRevenue = await Order.sum('totalAmount', {
      where: {
        ...whereClause,
        status: 'completed'
      }
    });

    // Số đơn hàng hoàn thành
    const completedOrders = await Order.count({
      where: {
        ...whereClause,
        status: 'completed'
      }
    });

    // Số đơn hàng đang xử lý
    const processingOrders = await Order.count({
      where: {
        ...whereClause,
        status: 'processing'
      }
    });

    // Số đơn hàng mới
    const pendingOrders = await Order.count({
      where: {
        ...whereClause,
        status: 'pending'
      }
    });

    res.json({
      statusStats,
      totalRevenue: totalRevenue || 0,
      completedOrders,
      processingOrders,
      pendingOrders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTopProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const topProducts = await OrderItem.findAll({
      attributes: [
        'productId',
        [sequelize.fn('SUM', sequelize.col('quantity')), 'totalSold'],
        [sequelize.fn('SUM', sequelize.literal('quantity * price')), 'totalRevenue']
      ],
      include: [{
        model: Product,
        attributes: ['name', 'imageUrl']
      }],
      group: ['productId'],
      order: [[sequelize.fn('SUM', sequelize.col('quantity')), 'DESC']],
      limit: parseInt(limit)
    });

    res.json(topProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDailyStats = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const dailyStats = await Order.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate]
        }
      },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'orderCount'],
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'revenue']
      ],
      group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']]
    });

    res.json(dailyStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = {};
    if (status) {
      whereClause.status = status;
    }

    const orders = await Order.findAndCountAll({
      where: whereClause,
      include: [{
        model: User,
        attributes: ['username', 'email']
      }, {
        model: OrderItem,
        include: [Product]
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      orders: orders.rows,
      total: orders.count,
      totalPages: Math.ceil(orders.count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 