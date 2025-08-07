const { Brand } = require('../models');

exports.getBrandById = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findByPk(id);
    if (!brand) return res.status(404).json({ message: 'Không tìm thấy thương hiệu' });
    res.json(brand);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.findAll();
    res.json(brands);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createBrand = async (req, res) => {
  try {
    const { name, description } = req.body;
    const brand = await Brand.create({ name, description });
    res.status(201).json(brand);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const brand = await Brand.findByPk(id);
    if (!brand) return res.status(404).json({ message: 'Không tìm thấy thương hiệu' });
    brand.name = name || brand.name;
    brand.description = description || brand.description;
    await brand.save();
    res.json(brand);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findByPk(id);
    if (!brand) return res.status(404).json({ message: 'Không tìm thấy thương hiệu' });
    await brand.destroy();
    res.json({ message: 'Xóa thương hiệu thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
