const express = require('express');
const router = express.Router();
const passport = require('passport');
const { createUser, getAllUser, updateUserRole, checkRole } = require("../controllers/user.controller");

router.use(passport.authenticate('jwt', { session: false }));
router.use(checkRole);

router.get('/', getAllUser);
router.post('/', createUser);
router.patch('/:id/role', updateUserRole);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Пользователи
 *   description: Управление пользователями
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Получить список пользователей
 *     tags: [Пользователи]
 *     security:
 *       - bearerAuth: []
 *     description: Доступно только для администраторов
 *     responses:
 *       200:
 *         description: Список всех пользователей
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Недостаточно прав
 *
 *   post:
 *     summary: Создать нового пользователя
 *     tags: [Пользователи]
 *     security:
 *       - bearerAuth: []
 *     description: Доступно только для администраторов
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: Пользователь создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Ошибка валидации
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Недостаточно прав
 *
 * /users/{id}/role:
 *   patch:
 *     summary: Изменить роль пользователя
 *     tags: [Пользователи]
 *     security:
 *       - bearerAuth: []
 *     description: Доступно только для администраторов
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       200:
 *         description: Роль успешно обновлена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Недостаточно прав
 *       404:
 *         description: Пользователь не найден
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *     UserInput:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 */