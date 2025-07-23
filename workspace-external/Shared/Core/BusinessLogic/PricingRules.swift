import Foundation

protocol PricingRule {
    var id: UUID { get }
    var description: String { get }
    func apply(baseRate: Double, context: PricingContext) -> Double
}

struct PricingContext {
    let jobDuration: TimeInterval
    let surgeMultiplier: Double
}

struct SurgePricingRule: PricingRule {
    let id = UUID()
    let description = "Apply surge pricing"

    func apply(baseRate: Double, context: PricingContext) -> Double {
        return baseRate * context.surgeMultiplier
    }
}

import Foundation

/// Protocol defining pricing strategy requirements
protocol PricingStrategy {
    func calculateBasePrice(for service: Service) -> Decimal
    func applyDynamicPricing(basePrice: Decimal, demand: Double) -> Decimal
    func calculateFinalPrice(basePrice: Decimal, modifiers: [PriceModifier]) -> Decimal
}

/// Manages dynamic pricing strategies and calculations
final class PricingRules: PricingStrategy {
    
    private let minimumPrice: Decimal
    private let maximumPriceMultiplier: Decimal
    
    init(minimumPrice: Decimal = 50.0,
        maximumPriceMultiplier: Decimal = 3.0) {
        self.minimumPrice = minimumPrice
        self.maximumPriceMultiplier = maximumPriceMultiplier
    }
    
    func calculateBasePrice(for service: Service) -> Decimal {
        let basePrice = service.baseRate * Decimal(service.durationHours)
        return max(basePrice, minimumPrice)
    }
    
    func applyDynamicPricing(basePrice: Decimal, demand: Double) -> Decimal {
        let demandMultiplier = min(Decimal(1.0 + demand), maximumPriceMultiplier)
        return basePrice * demandMultiplier
    }
    
    func calculateFinalPrice(basePrice: Decimal, modifiers: [PriceModifier]) -> Decimal {
        return modifiers.reduce(basePrice) { price, modifier in
            switch modifier.type {
            case .percentage:
                return price * (1 + modifier.value)
            case .fixed:
                return price + modifier.value
            }
        }
    }
}

// MARK: - Supporting Types

struct Service {
    let id: UUID
    let name: String
    let baseRate: Decimal
    let durationHours: Double
    let category: ServiceCategory
}

enum ServiceCategory: String {
    case rigging
    case transportation
    case setup
    case specializedEquipment
}

struct PriceModifier {
    let type: ModifierType
    let value: Decimal
    let description: String
}

enum ModifierType {
    case percentage
    case fixed
}

