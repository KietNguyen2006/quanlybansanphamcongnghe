const { Review, Comment, Product, User } = require('../models');

exports.addReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;
    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    const review = await Review.create({ productId, userId, rating, comment });
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.findAll({ where: { productId }, include: [{ model: User, as: 'user', attributes: ['id','username'] }] });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { productId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;
    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    const comment = await Comment.create({ productId, userId, content });
    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const { productId } = req.params;
    const comments = await Comment.findAll({ where: { productId }, include: [{ model: User, as: 'user', attributes: ['id','username'] }] });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
