"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("../config/passport"));
const user_controller_1 = require("../controllers/user.controller");
const event_1 = __importDefault(require("../models/event"));
const event_controller_1 = require("../controllers/event.controller");
const router = express_1.default.Router();
router.use(passport_1.default.authenticate('jwt', { session: false }));
router.use((req, res, next) => {
    req.model = event_1.default;
    next();
});
router.get('/', event_controller_1.getAllEvents);
router.get('/:id', event_controller_1.getEventById);
router.post('/', event_controller_1.createEvent);
router.put('/:id', user_controller_1.checkOwnership, event_controller_1.updateEvent);
router.delete('/:id', user_controller_1.checkOwnership, event_controller_1.deleteEvent);
exports.default = router;
