const express = require('express');
const router = express.Router();
const { Event, User } = require('../models');

// Получение списка всех мероприятий
router.get('/', async (req, res) => {
    try {
        const events = await Event.findAll({
            include: [{ model: User, attributes: ['name', 'email'] }],
        });
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении мероприятий', error });
    }
});

// Получение одного мероприятия по ID
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id, {
            include: [{ model: User, attributes: ['name', 'email'] }],
        });
        if (!event) {
            return res.status(404).json({ message: 'Мероприятие не найдено' });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении мероприятия', error });
    }
});

// Создание мероприятия
router.post('/', async (req, res) => {
    try {
        const { title, description, date, createdBy } = req.body;
        if (!title || !date || !createdBy) {
            return res.status(400).json({ message: 'Обязательные поля: title, date, createdBy' });
        }
        const event = await Event.create({ title, description, date, createdBy });
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при создании мероприятия', error });
    }
});

// Обновление мероприятия
router.put('/:id', async (req, res) => {
    try {
        const { title, description, date } = req.body;
        const event = await Event.findByPk(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Мероприятие не найдено' });
        }
        event.title = title || event.title;
        event.description = description || event.description;
        event.date = date || event.date;
        await event.save();
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при обновлении мероприятия', error });
    }
});

// Удаление мероприятия
router.delete('/:id', async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Мероприятие не найдено' });
        }
        await event.destroy();
        res.status(200).json({ message: 'Мероприятие удалено' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при удалении мероприятия', error });
    }
});

module.exports = router;