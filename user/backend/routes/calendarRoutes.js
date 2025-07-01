const express = require('express');
const router = express.Router();
const { getJadwal } = require('../controllers/calendarController');

router.get('/jadwal', getJadwal);

module.exports = router;
