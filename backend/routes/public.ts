import express from 'express';
import { getAllEvents } from '../controllers/event.controller';

const router = express.Router();

router.get('/events', getAllEvents);

export default router;
