const express = require('express');
const { getAllEvents } = require('../controllers/event.controller');
const router = express.Router();

router.get('/events', getAllEvents);

module.exports = router;
