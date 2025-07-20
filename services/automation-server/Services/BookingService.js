const DatabaseManager = require('../Database/DatabaseManager');

class BookingService {
    static async createBooking(data) {
        const booking = await DatabaseManager.insert('bookings', data);
        return booking;
    }

    static async getBookings(query) {
        const bookings = await DatabaseManager.find('bookings', query);
        return bookings;
    }

    static async cancelBooking(bookingId) {
        const result = await DatabaseManager.update('bookings', bookingId, { status: 'cancelled' });
        return result ? 'Booking cancelled successfully' : 'Failed to cancel booking';
    }
}

module.exports = BookingService;

