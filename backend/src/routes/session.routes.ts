import { Router } from 'express';
import {
  sessionController,
  createSessionSchema,
} from '../controllers/session.controller';
import { authenticate, requireHostRole } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Sessions
 *   description: Quản lý phòng chơi và phiên game
 */

/**
 * @swagger
 * /sessions:
 *   post:
 *     summary: Tạo phòng chơi mới (host only)
 *     description: Tạo phòng chơi với mã PIN 6 chữ số và QR code. Host phải xác thực JWT.
 *     tags: [Sessions]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSessionBody'
 *     responses:
 *       201:
 *         description: Tạo phòng thành công
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/CreateSessionData'
 *       400:
 *         description: Quiz chưa có câu hỏi hoặc dữ liệu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Chưa xác thực
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Bộ câu hỏi không tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  '/',
  authenticate,
  requireHostRole,
  validate(createSessionSchema),
  sessionController.createSession,
);

/**
 * @swagger
 * /sessions/{pin}:
 *   get:
 *     summary: Lấy thông tin phòng chơi theo PIN (public)
 *     description: Người chơi dùng endpoint này để kiểm tra phòng trước khi tham gia qua Socket.io.
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: pin
 *         required: true
 *         schema:
 *           type: string
 *           example: '482931'
 *         description: Mã PIN 6 chữ số của phòng
 *     responses:
 *       200:
 *         description: Thông tin phòng
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Session'
 *       404:
 *         description: Phòng không tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:pin', sessionController.getSessionByPin);

/**
 * @swagger
 * /sessions/{id}/results:
 *   get:
 *     summary: Xem kết quả đầy đủ sau khi game kết thúc (host only)
 *     tags: [Sessions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID phiên chơi
 *     responses:
 *       200:
 *         description: Kết quả phiên chơi
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/SessionResults'
 *       401:
 *         description: Chưa xác thực
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Phiên chơi không tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/:id/results',
  authenticate,
  requireHostRole,
  sessionController.getSessionResults,
);

export default router;
