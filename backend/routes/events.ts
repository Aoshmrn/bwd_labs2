import express, { Request, Response, NextFunction } from 'express';
import passport from '../config/passport';
import { checkOwnership } from '../controllers/user.controller';
import Event from '../models/event';
import {
  getEventById,
  createEvent,
  deleteEvent,
  getAllEvents,
  updateEvent,
} from '../controllers/event.controller';

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
