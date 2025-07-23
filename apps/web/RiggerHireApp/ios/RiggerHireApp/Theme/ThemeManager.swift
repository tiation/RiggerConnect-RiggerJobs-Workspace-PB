import SwiftUI

public class ThemeManager: ObservableObject {
    // Primary neon colors
    @Published public var primaryColor = Color.cyan
    @Published public var secondaryColor = Color(red: 1.0, green: 0.0, blue: 1.0) // Magenta
    @Published public var accentColor = Color(red: 0.0, green: 0.8, blue: 1.0) // Bright cyan
    
    // Background colors
    @Published public var backgroundColor = Color(red: 0.05, green: 0.05, blue: 0.1)
    @Published public var cardBackground = Color(red: 0.1, green: 0.1, blue: 0.15)
    @Published public var surfaceColor = Color(red: 0.15, green: 0.15, blue: 0.2)
    
    // Text colors
    @Published public var primaryTextColor = Color.white
    @Published public var secondaryTextColor = Color(white: 0.8)
    @Published public var mutedTextColor = Color(white: 0.6)
    @Published public var buttonTextColor = Color.white
    
    // Status colors
    @Published public var successColor = Color(red: 0.0, green: 1.0, blue: 0.5)
    @Published public var warningColor = Color(red: 1.0, green: 0.8, blue: 0.0)
    @Published public var errorColor = Color(red: 1.0, green: 0.3, blue: 0.3)
    @Published public var shadowColor = Color.black.opacity(0.2)
    
    // Theme state
    @Published public var isDarkMode: Bool = true
    
    // Gradient definitions
    public var primaryGradient: LinearGradient {
        LinearGradient(
            colors: [primaryColor, secondaryColor],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
    }
    
    public var backgroundGradient: LinearGradient {
        LinearGradient(
            colors: [
                backgroundColor,
                backgroundColor.opacity(0.8),
                accentColor.opacity(0.05)
            ],
            startPoint: .top,
            endPoint: .bottom
        )
    }
    
    public var neonGlow: LinearGradient {
        LinearGradient(
            colors: [
                accentColor.opacity(0.8),
                primaryColor.opacity(0.6),
                secondaryColor.opacity(0.4)
            ],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
    }
    
    // Initialize with default values
    public init() {
        initializeDefaultStyles()
    }
    
    // Card style modifiers
    public func cardStyle() -> some ViewModifier {
        CardStyleModifier(themeManager: self)
    }
    
    public func neonButtonStyle() -> some ViewModifier {
        NeonButtonStyleModifier(themeManager: self)
    }
    
    private func initializeDefaultStyles() {
        if isDarkMode {
            // Dark mode colors
            backgroundColor = Color(hex: "121212")
            cardBackground = Color(hex: "1E1E1E")
            surfaceColor = Color(hex: "1E1E1E")
            primaryTextColor = Color.white
            secondaryTextColor = Color(hex: "B3B3B3")
            mutedTextColor = Color(hex: "666666")
            successColor = Color(hex: "00E676")
            errorColor = Color(hex: "FF5252")
            warningColor = Color(hex: "FFD740")
            primaryColor = Color(hex: "00F5FF")
            accentColor = Color(hex: "FF00FF")
            shadowColor = Color.black.opacity(0.8)
        } else {
            // Light mode colors
            backgroundColor = Color.white
            cardBackground = Color(hex: "F5F5F5")
            surfaceColor = Color(hex: "F5F5F5")
            primaryTextColor = Color(hex: "212121")
            secondaryTextColor = Color(hex: "757575")
            mutedTextColor = Color(hex: "9E9E9E")
            successColor = Color(hex: "00C853")
            errorColor = Color(hex: "D50000")
            warningColor = Color(hex: "FFC400")
            primaryColor = Color(hex: "0088FF")
            accentColor = Color(hex: "FF0088")
            shadowColor = Color.gray.opacity(0.5)
        }
    }
}

// MARK: - Color Extensions

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 0, 0, 0)
        }
        
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}
