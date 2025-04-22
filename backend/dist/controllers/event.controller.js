"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvent = exports.updateEvent = exports.createEvent = exports.getEventById = exports.getAllEvents = void 0;
const event_1 = __importDefault(require("@models/event"));
const user_1 = __importDefault(require("@models/user"));
const customErrors_1 = require("@/customErrors");
const getAllEvents = async (req, res, next) => {
    try {
        const { category } = req.query;
        const validCategories = ['концерт', 'лекция', 'выставка'];
        const whereClause = category && validCategories.includes(category)
            ? { category: category }
            : {};
        const events = await event_1.default.findAll({
            where: whereClause,
            include: [{ model: user_1.default, attributes: ['name', 'email'] }],
        });
        res.status(200).json(events);
    }
    catch (error) {
        next(error);
    }
};
exports.getAllEvents = getAllEvents;
const getEventById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const event = await event_1.default.findByPk(id);
        if (!event) {
            throw new customErrors_1.NotFoundError('Событие');
        }
        res.status(200).json(event);
    }
    catch (error) {
        next(error);
    }
};
exports.getEventById = getEventById;
const createEvent = async (req, res, next) => {
    try {
        const { title, description, date, category, createdBy } = req.body;
        if (!title || !date || !category || !createdBy) {
            throw new customErrors_1.ValidationError([
                'Все обязательные поля должны быть заполнены',
            ]);
        }
        const event = await event_1.default.create({
            title,
            description,
            date,
            category,
            createdBy,
        });
        res.status(201).json(event);
    }
    catch (error) {
        next(error);
    }
};
exports.createEvent = createEvent;
const updateEvent = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, date, category } = req.body;
        const event = await event_1.default.findByPk(id);
        if (!event) {
            throw new customErrors_1.NotFoundError('Событие');
        }
        event.title = title;
        event.description = description;
        event.date = date;
        event.category = category;
        await event.save();
        res.status(200).json(event);
    }
    catch (error) {
        next(error);
    }
};
exports.updateEvent = updateEvent;
const deleteEvent = async (req, res, next) => {
    try {
        const { id } = req.params;
        const event = await event_1.default.findByPk(id);
        if (!event) {
            throw new customErrors_1.NotFoundError('Событие');
        }
        await event.destroy();
        res.status(200).json({ message: 'Событие удалено' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteEvent = deleteEvent;
