const express = require('express');
const router = express.Router();
const { Event, User } = require('../models');
const { ValidationError, NotFoundError } = require('../customErrors');

// Список мероприятий с фильтрацией по категории
router.get('/', async (req, res, next) => {
    try {
        const { category } = req.query;
        const whereClsuse = category ? {category} : {};
        

        const events = await Event.findAll({
            where: whereClsuse,
            include: [{model: User, attributes: ['name', 'email']}],
        });

        res.status(200).json(events);
    } catch (error) {
        next(error);
    }
});

// Получение списка всех мероприятий
router.get('/', async (req, res, next) => {
    try {
        const events = await Event.findAll({
            include: [{ model: User, attributes: ['name', 'email'] }],
        });

        res.status(200).json(events);
    } catch (error) {
        next(error);
    }
});

// Получение одного мероприятия по ID
router.get('/:id', async (req, res, next) => {
    try {
        const event = await Event.findByPk(req.params.id, {
            include: [{ model: User, attributes: ['name', 'email'] }],
        });
        if (!event) {
            throw new NotFoundError('Мероприятие');
        }
        res.status(200).json(event);
    } catch (error) {
        next(error);
    }
});

// Создание мероприятия
router.post('/', async (req, res, next) => {
    try {
        const { title, description, date, category, createdBy } = req.body;
        const errors = [];

        if (!title) errors.push('Поле title обязательно');
        if (!date) errors.push('Поле date обязательно');
        if (!createdBy) errors.push('Поле createdBy обязательно');
        
        if (errors.length > 0) {
            throw new ValidationError(errors);
        }
        
        const event = await Event.create({ title, description, date, category, createdBy });
        res.status(201).json(event);
    } catch (error) {
        next(error);
    }
});

// Обновление мероприятия
router.put('/:id', async (req, res, next) => {
    try {
        const { title, description, date, category} = req.body;
        const event = await Event.findByPk(req.params.id);
        if (!event) {
            throw new NotFoundError('Мероприятие');
        }
        event.title = title || event.title;
        event.description = description || event.description;
        event.date = date || event.date;
        event.category = category || event.category;
        await event.save();
        res.status(200).json(event);
    } catch (error) {
        next(error);
    }
});

// Удаление мероприятия
router.delete('/:id', async (req, res, next) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) {
            throw new NotFoundError('Мероприятие');
        }
        await event.destroy();
        res.status(200).json({ message: 'Мероприятие удалено' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Мероприятия
 *   description: Управление мероприятиями
 */

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Получить список мероприятий
 *     tags: [Мероприятия]
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
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Получить мероприятие по ID
 *     tags: [Мероприятия]
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
 */

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Создать новое мероприятие
 *     tags: [Мероприятия]
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
 *   put:
 *     summary: Обновить мероприятие
 *     tags: [Мероприятия]
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
 */

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Удалить мероприятие
 *     tags: [Мероприятия]
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
 *         - createdBy
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
 *         createdBy:
 *           type: integer
 */