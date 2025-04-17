import express from 'express';
import { getAllEvents } from '@controllers/event.controller';

const router = express.Router();

router.get('/events', getAllEvents);

export default router;


/**
 * @swagger
 * /events:
 *   get:
 *     summary: Получить список всех мероприятий
 *     tags: [Public]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Фильтр по категории мероприятия
 *     responses:
 *       200:
 *         description: Список мероприятий
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       500:
 *         description: Ошибка сервера
 */