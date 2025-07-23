import XCTest
@testable import RiggerConnect

final class BookingServiceTest: XCTestCase {

    var bookingService: BookingService!

    override func setUp() {
        super.setUp()
        bookingService = BookingService()
    }

    override func tearDown() {
        bookingService = nil
        super.tearDown()
    }

    func testCreateBooking() throws {
        let booking = try bookingService.createBooking(clientID: "client1", jobID: "job1")
        XCTAssertNotNil(booking, "Booking should not be nil")
        XCTAssertEqual(booking.clientID, "client1", "Client ID mismatch")
    }

    func testCancelBooking() throws {
        try bookingService.createBooking(clientID: "client1", jobID: "job1")
        let result = bookingService.cancelBooking(bookingID: "booking1")
        XCTAssertTrue(result, "Cancel booking should return true")
    }
}

