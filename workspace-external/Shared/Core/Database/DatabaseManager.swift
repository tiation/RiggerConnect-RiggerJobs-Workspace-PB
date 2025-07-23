import Foundation
import SQLite

enum DatabaseError: Error {
    case connectionFailed(String)
    case queryFailed(String)
    case transactionFailed(String)
}

final class DatabaseManager {
    static let shared = DatabaseManager()
    private var connection: Connection?
    
    private init() {
        setupDatabase()
    }
    
    private func setupDatabase() {
        do {
            connection = try Connection("rigger_connect.db")
        } catch {
            print("Database connection failed: \(error)")
        }
    }
    
    func performTransaction<T>(_ operation: (Connection) throws -> T) throws -> T {
        guard let db = connection else {
            throw DatabaseError.connectionFailed("No database connection available")
        }
        
        var result: T?
        var error: Error?
        
        try db.transaction {
            do {
                result = try operation(db)
            } catch let err {
                error = err
                throw err
            }
        }
        
        if let err = error {
            throw DatabaseError.transactionFailed(err.localizedDescription)
        }
        
        return result!
    }
    
    func getConnection() throws -> Connection {
        guard let conn = connection else {
            throw DatabaseError.connectionFailed("No database connection available")
        }
        return conn
    }
}

