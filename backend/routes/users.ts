import express from 'express';
import passport from '../config/passport';
import {
  createUser,
  getAllUser,
  updateUserRole,
  checkRole,
} from '../controllers/user.controller';

const router = express.Router();

router.use(passport.authenticate('jwt', { session: false }));
router.use(checkRole);

router.get('/', getAllUser);
router.post('/', createUser);
router.patch('/:id/role', updateUserRole);

export default router;
