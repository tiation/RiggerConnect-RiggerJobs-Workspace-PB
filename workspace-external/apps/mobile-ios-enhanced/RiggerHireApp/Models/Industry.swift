import Foundation

enum Industry: String, Codable, CaseIterable {
    case mining = "mining"
    case construction = "construction"
    case manufacturing = "manufacturing"
    case energy = "energy"
    case infrastructure = "infrastructure"
    case marine = "marine"
    case aviation = "aviation"
    case industrial = "industrial"
    case oil = "oil"
    case gas = "gas"
    case renewable = "renewable"
    
    var displayName: String {
        switch self {
        case .mining:
            return "Mining"
        case .construction:
            return "Construction"
        case .manufacturing:
            return "Manufacturing"
        case .energy:
            return "Energy"
        case .infrastructure:
            return "Infrastructure"
        case .marine:
            return "Marine"
        case .aviation:
            return "Aviation"
        case .industrial:
            return "Industrial"
        case .oil:
            return "Oil"
        case .gas:
            return "Gas"
        case .renewable:
            return "Renewable Energy"
        }
    }
    
    var icon: String {
        switch self {
        case .mining:
            return "mountain.2.fill"
        case .construction:
            return "hammer.fill"
        case .manufacturing:
            return "wrench.and.screwdriver.fill"
        case .energy:
            return "bolt.fill"
        case .infrastructure:
            return "building.2.fill"
        case .marine:
            return "water.waves"
        case .aviation:
            return "airplane"
        case .industrial:
            return "gearshape.2.fill"
        case .oil:
            return "drop.fill"
        case .gas:
            return "flame.fill"
        case .renewable:
            return "sun.max.fill"
        }
    }
}
