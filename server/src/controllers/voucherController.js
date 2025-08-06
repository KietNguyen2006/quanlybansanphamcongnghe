const Voucher = require('../models/Voucher');

exports.createVoucher = async (req, res) => {
  try {
    const voucher = await Voucher.create(req.body);
    res.status(201).json(voucher);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllVouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.findAll();
    res.json(vouchers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getVoucherById = async (req, res) => {
  try {
    const voucher = await Voucher.findByPk(req.params.id);
    if (!voucher) return res.status(404).json({ message: 'Không tìm thấy voucher' });
    res.json(voucher);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateVoucher = async (req, res) => {
  try {
    const voucher = await Voucher.findByPk(req.params.id);
    if (!voucher) return res.status(404).json({ message: 'Không tìm thấy voucher' });
    await voucher.update(req.body);
    res.json(voucher);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteVoucher = async (req, res) => {
  try {
    const voucher = await Voucher.findByPk(req.params.id);
    if (!voucher) return res.status(404).json({ message: 'Không tìm thấy voucher' });
    await voucher.destroy();
    res.json({ message: 'Đã xoá voucher' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
