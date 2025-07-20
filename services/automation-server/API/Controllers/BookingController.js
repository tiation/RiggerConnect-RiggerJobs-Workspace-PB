const BookingService = require('../Services/BookingService');

class BookingController {
    static async createBooking(req, res) {
        try {
            const booking = await BookingService.createBooking(req.body);
            res.status(201).json({ success: true, data: booking });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async getBookings(req, res) {
        try {
            const bookings = await BookingService.getBookings(req.query);
            res.status(200).json({ success: true, data: bookings });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async cancelBooking(req, res) {
        try {
            const result = await BookingService.cancelBooking(req.params.id);
            res.status(200).json({ success: true, message: result });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = BookingController;
