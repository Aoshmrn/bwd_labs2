import express from 'express';
import passport from '@config/passport';
import {
  createUser,
  getAllUser,
  updateUserRole,
  checkRole,
  getUserProfile,
  getUserEvents,
  updateUserProfile,
} from '@controllers/user.controller';

const router = express.Router();

// Apply authentication to all routes
router.use(passport.authenticate('jwt', { session: false }));

// Public route for authenticated users
router.get('/', getAllUser);
router.get('/profile', getUserProfile);
router.patch('/profile', updateUserProfile);
router.get('/:userId/events', getUserEvents);

// Admin only routes
router.use(checkRole); 
router.post('/', createUser);
router.patch('/:id/role', updateUserRole);

export default router;

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
 * /users/profile:
 *   get:
 *     summary: Получить профиль пользователя
 *     tags: [Пользователи]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Данные профиля пользователя
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Не авторизован
 *       404:
 *         description: Пользователь не найден
 *
 *   patch:
 *     summary: Обновить профиль пользователя
 *     tags: [Пользователи]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - middleName
 *               - gender
 *               - birthDate
 *             properties:
 *               firstName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               lastName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               middleName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *               birthDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Профиль успешно обновлен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Ошибка валидации
 *       401:
 *         description: Не авторизован
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
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         middleName:
 *           type: string
 *         email:
 *           type: string
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *         birthDate:
 *           type: string
 *           format: date
 *         role:
 *           type: string
 *           enum: [user, admin]
 *         createdAt:
 *           type: string
 *           format: date-time
 *     UserInput:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - middleName
 *         - email
 *         - gender
 *         - birthDate
 *       properties:
 *         firstName:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *         lastName:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *         middleName:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *         email:
 *           type: string
 *           format: email
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *         birthDate:
 *           type: string
 *           format: date
 */
