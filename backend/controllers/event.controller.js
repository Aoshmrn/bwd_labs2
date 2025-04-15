const Event = require('../models/event');
const User = require('../models/user');

const { NotFoundError, ValidationError } = require('../customErrors');

// Получение всех мероприятий с фильтрацией по категории
async function getAllEvents(req, res, next)
{
    try {
        const { category } = req.query;
        const whereClause = category ? { category } : {};

        const events = await Event.findAll({
            where: whereClause,
            include: [{ model: User, attributes: ['name', 'email'] }],
        });

        res.status(200).json(events);
    } catch (error) {
        next(error);
    }
};

// Получение одного мероприятия по ID
async function getEventById(req, res, next)
{
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
};

// Создание мероприятия
async function createEvent(req, res, next)
{
    try {
        const { title, description, date, category } = req.body;
        const errors = [];

        if (!title) errors.push('Поле title обязательно');
        if (!date) errors.push('Поле date обязательно');

        if (errors.length > 0) {
            throw new ValidationError(errors);
        }

        const createdBy = req.user.id;

        const event = await Event.create({ 
            title, 
            description, 
            date, 
            category, 
            createdBy 
        });
        
        res.status(201).json(event);
    } catch (error) {
        next(error);
    }
};

// Обновление мероприятия
async function updateEvent(req, res, next)
{
    try {
        const { title, description, date, category } = req.body;
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
};

// Удаление мероприятия
async function deleteEvent(req, res, next)
{
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
};

module.exports = { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent };