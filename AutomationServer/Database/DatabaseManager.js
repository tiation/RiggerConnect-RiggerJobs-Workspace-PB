import { v4 as uuidv4 } from 'uuid';

const Database = {
    Bookings: {
        data: [],

        async create(bookingData) {
            const booking = { id: uuidv4(), ...bookingData };
            this.data.push(booking);
            return booking;
        },

        async findById(bookingId) {
            return this.data.find((booking) => booking.id === bookingId);
        },

        async update(bookingId, updatedData) {
            const index = this.data.findIndex((booking) => booking.id === bookingId);
            if (index !== -1) {
                this.data[index] = { ...this.data[index], ...updatedData };
                return this.data[index];
            }
            throw new Error(`Booking with ID ${bookingId} not found`);
        },

        async delete(bookingId) {
            this.data = this.data.filter((booking) => booking.id !== bookingId);
        },
    },

    Riggers: {
        data: [],

        async create(riggerData) {
            const rigger = { id: uuidv4(), ...riggerData };
            this.data.push(rigger);
            return rigger;
        },

        async findById(riggerId) {
            return this.data.find((rigger) => rigger.id === riggerId);
        },
    },

    Feedback: {
        data: [],

        async create(feedbackData) {
            const feedback = { id: uuidv4(), ...feedbackData };
            this.data.push(feedback);
            return feedback;
        },

        async findById(feedbackId) {
            return this.data.find((feedback) => feedback.id === feedbackId);
        },
    },
};

export default Database;

