const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticate } = require('../middlewares/auth');

// Đánh giá sản phẩm
router.post('/:productId/reviews', authenticate, reviewController.addReview);
router.get('/:productId/reviews', reviewController.getReviews);
// Bình luận sản phẩm
router.post('/:productId/comments', authenticate, reviewController.addComment);
router.get('/:productId/comments', reviewController.getComments);

module.exports = router;
