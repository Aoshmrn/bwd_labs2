import express, { Request, Response, NextFunction } from 'express';
import passport from '@config/passport';
import { checkOwnership } from '@controllers/user.controller';
import Event from '@models/event';
import {
  getEventById,
  createEvent,
  deleteEvent,
  getAllEvents,
  updateEvent,
} from '@controllers/event.controller';

declare module 'express-serve-static-core' {
  interface Request {
    model?: typeof Event;
    user?: { id: number; role: string };
  }
}

const router = express.Router();

router.use(passport.authenticate('jwt', { session: false }));

router.use((req: Request, res: Response, next: NextFunction) => {
  req.model = Event;
  next();
});

router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.post('/', createEvent);
router.put('/:id', checkOwnership, updateEvent);
router.delete('/:id', checkOwnership, deleteEvent);

export default router;

/**
 * @swagger
 * tags:
 *   - name: События
 *     description: API для управления событиями
 */

/**
 * @swagger
 * /events:
 *   get:
 *     tags: [События]
 *     summary: Получить список событий
 *     security:
 *       - bearerAuth: []
 *     description: Доступно авторизованным пользователям
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Категория мероприятия (концерт, лекция, выставка)
 *     responses:
 *       200:
 *         description: Список мероприятий
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       401:
 *         description: Не авторизован
 *       500:
 *         description: Ошибка сервера
 *   post:
 *     tags: [События]
 *     summary: Создать новое событие
 *     security:
 *       - bearerAuth: []
 *     description: Доступно авторизованным пользователям
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EventInput'
 *     responses:
 *       201:
 *         description: Мероприятие создано
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Неверные данные
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Получить мероприятие по ID
 *     tags: [События]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID мероприятия
 *     responses:
 *       200:
 *         description: Мероприятие найдено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Мероприятие не найдено
 *       500:
 *         description: Ошибка сервера
 *   put:
 *     tags: [События]
 *     summary: Обновить событие
 *     security:
 *       - bearerAuth: []
 *     description: Доступно только создателю события или админу
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID мероприятия
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EventInput'
 *     responses:
 *       200:
 *         description: Мероприятие обновлено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Мероприятие не найдено
 *       500:
 *         description: Ошибка сервера
 *   delete:
 *     tags: [События]
 *     summary: Удалить событие
 *     security:
 *       - bearerAuth: []
 *     description: Доступно только создателю события или админу
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID мероприятия
 *     responses:
 *       200:
 *         description: Мероприятие удалено
 *       404:
 *         description: Мероприятие не найдено
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *         category:
 *           type: string
 *           enum: [концерт, лекция, выставка]
 *         createdBy:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     EventInput:
 *       type: object
 *       required:
 *         - title
 *         - date
 *         - category
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *         category:
 *           type: string
 *           enum: [концерт, лекция, выставка]
 */