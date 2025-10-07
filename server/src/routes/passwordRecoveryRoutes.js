const express = require('express');
const router = express.Router();
const passwordRecoveryController = require('../controllers/passwordRecoveryController');

/**
 * @swagger
 * tags:
 *   name: Password Recovery
 *   description: API for password recovery
 */

/**
 * @swagger
 * /api/password-recovery/forgot-password:
 *   post:
 *     summary: Send a password reset email
 *     tags: [Password Recovery]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset email sent successfully.
 */
router.post('/forgot-password', passwordRecoveryController.forgotPassword);

/**
 * @swagger
 * /api/password-recovery/reset-password:
 *   post:
 *     summary: Reset the user's password
 *     tags: [Password Recovery]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully.
 */
router.post('/reset-password', passwordRecoveryController.resetPassword);

module.exports = router;
