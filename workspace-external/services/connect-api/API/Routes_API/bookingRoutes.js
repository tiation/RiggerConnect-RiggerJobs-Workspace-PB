const express = require('express');
const BookingController = require('../Controllers/BookingController');

const router = express.Router();

router.post('/create', BookingController.createBooking);
router.get('/list', BookingController.getBookings);
router.put('/cancel/:id', BookingController.cancelBooking);

module.exports = router;
