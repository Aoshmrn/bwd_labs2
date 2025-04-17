import { NextFunction, Request, Response } from 'express';
import Event from '../models/event';
import User from '../models/user';
import { NotFoundError, ValidationError } from '../customErrors';

export const getAllEvents = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { category } = req.query;
    const validCategories = ['концерт', 'лекция', 'выставка'];
    const whereClause =
      category && validCategories.includes(category as string)
        ? { category: category as 'концерт' | 'лекция' | 'выставка' }
        : {};

    const events = await Event.findAll({
      where: whereClause,
      include: [{ model: User, attributes: ['name', 'email'] }],
    });
    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
};

export const getEventById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);
    if (!event) {
      throw new NotFoundError('Событие');
    }
    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { title, description, date, category, createdBy } = req.body;
    if (!title || !date || !category || !createdBy) {
      throw new ValidationError([
        'Все обязательные поля должны быть заполнены',
      ]);
    }
    const event = await Event.create({
      title,
      description,
      date,
      category,
      createdBy,
    });
    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, date, category } = req.body;
    const event = await Event.findByPk(id);
    if (!event) {
      throw new NotFoundError('Событие');
    }
    event.title = title;
    event.description = description;
    event.date = date;
    event.category = category;
    await event.save();
    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);
    if (!event) {
      throw new NotFoundError('Событие');
    }
    await event.destroy();
    res.status(200).json({ message: 'Событие удалено' });
  } catch (error) {
    next(error);
  }
};
