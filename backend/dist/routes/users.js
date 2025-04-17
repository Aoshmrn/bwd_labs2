"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("../config/passport"));
const user_controller_1 = require("../controllers/user.controller");
const router = express_1.default.Router();
router.use(passport_1.default.authenticate('jwt', { session: false }));
router.use(user_controller_1.checkRole);
router.get('/', user_controller_1.getAllUser);
router.post('/', user_controller_1.createUser);
router.patch('/:id/role', user_controller_1.updateUserRole);
exports.default = router;
