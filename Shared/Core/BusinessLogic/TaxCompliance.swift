import Foundation

struct TaxCompliance {
    let country: String
    let complianceStatus: Bool
}

func validateTaxCompliance(forCountry country: String) -> Bool {
    return country == "Australia"
}

