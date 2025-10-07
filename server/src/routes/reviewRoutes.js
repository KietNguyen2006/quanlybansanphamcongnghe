const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticate } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Reviews & Comments
 *   description: API for product reviews and comments
 */

/**
 * @swagger
 * /api/products/{productId}/reviews:
 *   post:
 *     summary: Add a review to a product
 *     tags: [Reviews & Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review added successfully.
 */
router.post('/:productId/reviews', authenticate, reviewController.addReview);

/**
 * @swagger
 * /api/products/{productId}/reviews:
 *   get:
 *     summary: Get all reviews for a product
 *     tags: [Reviews & Comments]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The product ID
 *     responses:
 *       200:
 *         description: A list of reviews.
 */
router.get('/:productId/reviews', reviewController.getReviews);

/**
 * @swagger
 * /api/products/{productId}/comments:
 *   post:
 *     summary: Add a comment to a product
 *     tags: [Reviews & Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment added successfully.
 */
router.post('/:productId/comments', authenticate, reviewController.addComment);

/**
 * @swagger
 * /api/products/{productId}/comments:
 *   get:
 *     summary: Get all comments for a product
 *     tags: [Reviews & Comments]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The product ID
 *     responses:
 *       200:
 *         description: A list of comments.
 */
router.get('/:productId/comments', reviewController.getComments);

module.exports = router;
