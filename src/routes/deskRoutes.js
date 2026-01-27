const express = require('express');
const router = express.Router();
const deskController = require('../controllers/deskController');
const auth = require('../middleware/auth');

router.get('/desks', auth, deskController.listAvailable);
router.post('/reserve', auth, deskController.reserve);

module.exports = router;
