const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
const {
  createVoucher,
  getAllVouchers,
  getVoucherById,
  updateVoucher,
  deleteVoucher
} = require('../controllers/voucherController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Voucher
 *   description: Quản lý mã giảm giá
 */

/**
 * @swagger
 * /api/vouchers:
 *   get:
 *     summary: Lấy danh sách voucher
 *     tags: [Voucher]
 *     responses:
 *       200:
 *         description: Danh sách voucher
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   code:
 *                     type: string
 *                   discount:
 *                     type: number
 *                   expiredAt:
 *                     type: string
 *                     format: date
 *                   quantity:
 *                     type: integer
 *                   active:
 *                     type: boolean
 *             example:
 *               - id: 1
 *                 code: "SALE50"
 *                 discount: 50
 *                 expiredAt: "2024-12-31"
 *                 quantity: 10
 *                 active: true
 *               - id: 2
 *                 code: "FREESHIP"
 *                 discount: 0
 *                 expiredAt: "2024-11-30"
 *                 quantity: 100
 *                 active: true
 */
router.get('/', getAllVouchers);

/**
 * @swagger
 * /api/vouchers/{id}:
 *   get:
 *     summary: Lấy chi tiết voucher theo id
 *     tags: [Voucher]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thông tin voucher
 *       404:
 *         description: Không tìm thấy voucher
 */
router.get('/:id', getVoucherById);

/**
 * @swagger
 * /api/vouchers:
 *   post:
 *     summary: Tạo voucher mới (admin)
 *     tags: [Voucher]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               discount:
 *                 type: number
 *               expiredAt:
 *                 type: string
 *                 format: date
 *               minOrderValue:
 *                 type: number
 *               quantity:
 *                 type: integer
 *               description:
 *                 type: string
 *               active:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Tạo thành công
 *       400:
 *         description: Lỗi đầu vào
 */
router.post('/', protect, authorize('admin'), createVoucher);

/**
 * @swagger
 * /api/vouchers/{id}:
 *   put:
 *     summary: Cập nhật voucher (admin)
 *     tags: [Voucher]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               discount:
 *                 type: number
 *               expiredAt:
 *                 type: string
 *                 format: date
 *               minOrderValue:
 *                 type: number
 *               quantity:
 *                 type: integer
 *               description:
 *                 type: string
 *               active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Lỗi đầu vào
 *       404:
 *         description: Không tìm thấy voucher
 */
router.put('/:id', protect, authorize('admin'), updateVoucher);

/**
 * @swagger
 * /api/vouchers/{id}:
 *   delete:
 *     summary: Xoá voucher (admin)
 *     tags: [Voucher]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Đã xoá voucher
 *       404:
 *         description: Không tìm thấy voucher
 */
router.delete('/:id', protect, authorize('admin'), deleteVoucher);

module.exports = router;
