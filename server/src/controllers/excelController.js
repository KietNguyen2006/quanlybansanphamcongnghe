const ExcelJS = require('exceljs');
const { Order, OrderItem, Product, User } = require('../models');
const { Op } = require('sequelize');

// Hàm tạo workbook mới
const createWorkbook = () => {
  return new ExcelJS.Workbook();
};

// Xuất thống kê đơn hàng ra Excel
exports.exportOrderStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Lấy dữ liệu thống kê
    const whereClause = {};
    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const orders = await Order.findAll({
      where: whereClause,
      include: [
        { model: User, attributes: ['username', 'email'] },
        { model: OrderItem, include: [Product] }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Tạo workbook và worksheet
    const workbook = createWorkbook();
    const worksheet = workbook.addWorksheet('Thống kê đơn hàng');

    // Định dạng header
    worksheet.columns = [
      { header: 'Mã đơn hàng', key: 'id', width: 15 },
      { header: 'Ngày đặt', key: 'createdAt', width: 20 },
      { header: 'Khách hàng', key: 'customer', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Sản phẩm', key: 'products', width: 40 },
      { header: 'Số lượng', key: 'quantity', width: 10 },
      { header: 'Tổng tiền', key: 'totalAmount', width: 15, style: { numFmt: '#,##0' } },
      { header: 'Trạng thái', key: 'status', width: 15 }
    ];

    // Thêm dữ liệu
    orders.forEach(order => {
      order.OrderItems.forEach(item => {
        worksheet.addRow({
          id: order.id,
          createdAt: order.createdAt.toLocaleString('vi-VN'),
          customer: order.User?.username || 'Khách vãng lai',
          email: order.User?.email || 'N/A',
          products: item.Product.name,
          quantity: item.quantity,
          totalAmount: item.price * item.quantity,
          status: getStatusText(order.status)
        });
      });
    });

    // Định dạng tiền tệ
    worksheet.getColumn('totalAmount').numFmt = '#,##0" đ"';

    // Tạo buffer và gửi file
    const buffer = await workbook.xlsx.writeBuffer();
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=thong-ke-don-hang-${new Date().toISOString().split('T')[0]}.xlsx`);
    
    return res.send(buffer);
  } catch (error) {
    console.error('Lỗi khi xuất file Excel:', error);
    return res.status(500).json({ message: 'Có lỗi xảy ra khi xuất file Excel' });
  }
};

// Xuất báo cáo doanh thu theo sản phẩm
exports.exportProductReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let whereClause = {};
    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    // Lấy danh sách sản phẩm bán chạy
    const orderItems = await OrderItem.findAll({
      where: whereClause,
      include: [
        { 
          model: Order,
          where: { status: 'completed' },
          attributes: []
        },
        { model: Product, attributes: ['name', 'price'] }
      ],
      attributes: [
        'productId',
        [sequelize.fn('SUM', sequelize.col('quantity')), 'totalSold'],
        [sequelize.literal('SUM(quantity * OrderItem.price)'), 'totalRevenue']
      ],
      group: ['productId'],
      order: [[sequelize.literal('totalSold'), 'DESC']]
    });

    // Tạo workbook và worksheet
    const workbook = createWorkbook();
    const worksheet = workbook.addWorksheet('Báo cáo doanh thu sản phẩm');

    // Định dạng header
    worksheet.columns = [
      { header: 'Mã SP', key: 'productId', width: 10 },
      { header: 'Tên sản phẩm', key: 'name', width: 40 },
      { header: 'Đơn giá', key: 'price', width: 15, style: { numFmt: '#,##0' } },
      { header: 'Số lượng bán', key: 'totalSold', width: 15 },
      { header: 'Doanh thu', key: 'totalRevenue', width: 20, style: { numFmt: '#,##0' } }
    ];

    // Thêm dữ liệu
    orderItems.forEach(item => {
      worksheet.addRow({
        productId: item.productId,
        name: item.Product.name,
        price: item.Product.price,
        totalSold: item.dataValues.totalSold,
        totalRevenue: item.dataValues.totalRevenue
      });
    });

    // Định dạng tiền tệ
    worksheet.getColumn('price').numFmt = '#,##0" đ"';
    worksheet.getColumn('totalRevenue').numFmt = '#,##0" đ"';

    // Tính tổng doanh thu
    const totalRevenue = orderItems.reduce((sum, item) => sum + parseFloat(item.dataValues.totalRevenue || 0), 0);
    
    // Thêm dòng tổng
    const totalRow = worksheet.addRow({
      name: 'TỔNG CỘNG',
      totalRevenue: totalRevenue
    });
    
    // Định dạng dòng tổng
    totalRow.font = { bold: true };
    totalRow.getCell('name').alignment = { horizontal: 'right' };

    // Tạo buffer và gửi file
    const buffer = await workbook.xlsx.writeBuffer();
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=bao-cao-doanh-thu-${new Date().toISOString().split('T')[0]}.xlsx`);
    
    return res.send(buffer);
  } catch (error) {
    console.error('Lỗi khi xuất báo cáo sản phẩm:', error);
    return res.status(500).json({ message: 'Có lỗi xảy ra khi xuất báo cáo sản phẩm' });
  }
};

// Hàm chuyển đổi trạng thái sang tiếng Việt
function getStatusText(status) {
  const statusMap = {
    'pending': 'Chờ xử lý',
    'processing': 'Đang xử lý',
    'completed': 'Đã hoàn thành',
    'cancelled': 'Đã hủy'
  };
  return statusMap[status] || status;
}

// Xuất hóa đơn chi tiết
exports.exportInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    // Lấy thông tin đơn hàng
    const order = await Order.findByPk(orderId, {
      include: [
        { model: User, attributes: ['username', 'email', 'phone'] },
        { 
          model: OrderItem, 
          include: [Product],
          attributes: ['quantity', 'price']
        }
      ]
    });

    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    // Tạo workbook và worksheet
    const workbook = createWorkbook();
    const worksheet = workbook.addWorksheet(`Hóa đơn #${order.id}`);

    // Thêm thông tin cửa hàng
    worksheet.mergeCells('A1:D3');
    const storeNameCell = worksheet.getCell('A1');
    storeNameCell.value = 'CỬA HÀNG CÔNG NGHỆ';
    storeNameCell.font = { size: 16, bold: true };
    storeNameCell.alignment = { horizontal: 'center', vertical: 'middle' };

    // Thêm tiêu đề hóa đơn
    worksheet.mergeCells('A5:D5');
    const titleCell = worksheet.getCell('A5');
    titleCell.value = 'HÓA ĐƠN BÁN HÀNG';
    titleCell.font = { size: 14, bold: true };
    titleCell.alignment = { horizontal: 'center' };

    // Thêm thông tin đơn hàng
    worksheet.addRow(['Mã đơn hàng:', order.id, 'Ngày đặt:', order.createdAt.toLocaleString('vi-VN')]);
    worksheet.addRow(['Khách hàng:', order.User?.username || 'Khách vãng lai', 'Điện thoại:', order.User?.phone || 'N/A']);
    worksheet.addRow(['Email:', order.User?.email || 'N/A', 'Địa chỉ:', order.shippingAddress || 'N/A']);
    worksheet.addRow(['Phương thức thanh toán:', order.paymentMethod || 'Tiền mặt', 'Trạng thái:', getStatusText(order.status)]);
    
    // Thêm khoảng trống
    worksheet.addRow([]);
    
    // Thêm bảng chi tiết sản phẩm
    const headerRow = worksheet.addRow([
      'STT', 'Tên sản phẩm', 'Đơn giá', 'Số lượng', 'Thành tiền'
    ]);
    
    // Định dạng header
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: 'center' };
    
    // Thêm dữ liệu sản phẩm
    order.OrderItems.forEach((item, index) => {
      worksheet.addRow([
        index + 1,
        item.Product.name,
        { formula: `C${worksheet.rowCount}*D${worksheet.rowCount}`, result: item.price },
        item.quantity,
        { formula: `C${worksheet.rowCount}*D${worksheet.rowCount}`, result: item.price * item.quantity }
      ]);
    });
    
    // Thêm tổng tiền
    const totalRow = worksheet.addRow(['', '', '', 'Tổng tiền:', 
      { formula: `SUM(E7:E${worksheet.rowCount - 1})`, result: order.totalAmount }
    ]);
    totalRow.font = { bold: true };
    totalRow.getCell('D').alignment = { horizontal: 'right' };
    
    // Định dạng cột
    worksheet.getColumn(1).width = 8;  // STT
    worksheet.getColumn(2).width = 40; // Tên sản phẩm
    worksheet.getColumn(3).width = 15; // Đơn giá
    worksheet.getColumn(4).width = 12; // Số lượng
    worksheet.getColumn(5).width = 15; // Thành tiền
    
    // Định dạng tiền tệ
    for (let i = 7; i <= worksheet.rowCount; i++) {
      worksheet.getCell(`C${i}`).numFmt = '#,##0" đ"';
      worksheet.getCell(`E${i}`).numFmt = '#,##0" đ"';
    }
    
    // Căn giữa cột STT và số lượng
    worksheet.getColumn(1).alignment = { horizontal: 'center' };
    worksheet.getColumn(4).alignment = { horizontal: 'center' };

    // Tạo buffer và gửi file
    const buffer = await workbook.xlsx.writeBuffer();
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=hoa-don-${order.id}.xlsx`);
    
    return res.send(buffer);
  } catch (error) {
    console.error('Lỗi khi xuất hóa đơn:', error);
    return res.status(500).json({ message: 'Có lỗi xảy ra khi xuất hóa đơn' });
  }
};
