const express = require('express');
const { authenticate, authorizeAdmin } = require('../middlewares/auth');
const {
  exportOrderStats,
  exportProductReport,
  exportInvoice
} = require('../controllers/excelController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Export
 *   description: API for exporting data to Excel
 */

router.use(authenticate);
router.use(authorizeAdmin);

/**
 * @swagger
 * /api/export/orders:
 *   get:
 *     summary: Export order statistics to Excel (Admin only)
 *     tags: [Export]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: An Excel file containing order statistics.
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/orders', exportOrderStats);

/**
 * @swagger
 * /api/export/products:
 *   get:
 *     summary: Export a product report to Excel (Admin only)
 *     tags: [Export]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: An Excel file containing a product report.
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/products', exportProductReport);

/**
 * @swagger
 * /api/export/invoice/{orderId}:
 *   get:
 *     summary: Export an invoice for a specific order to Excel (Admin only)
 *     tags: [Export]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The order ID
 *     responses:
 *       200:
 *         description: An Excel file containing the invoice.
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/invoice/:orderId', exportInvoice);

module.exports = router;
