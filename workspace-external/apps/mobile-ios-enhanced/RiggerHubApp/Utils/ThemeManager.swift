import SwiftUI

class ThemeManager: ObservableObject {
    // Primary neon colors
    @Published var primaryColor = Color.cyan
    @Published var secondaryColor = Color(red: 1.0, green: 0.0, blue: 1.0) // Magenta
    @Published var accentColor = Color(red: 0.0, green: 0.8, blue: 1.0) // Bright cyan
    
    // Background colors
    @Published var backgroundColor = Color(red: 0.05, green: 0.05, blue: 0.1)
    @Published var cardBackground = Color(red: 0.1, green: 0.1, blue: 0.15)
    @Published var surfaceColor = Color(red: 0.15, green: 0.15, blue: 0.2)
    
    // Text colors
    @Published var primaryTextColor = Color.white
    @Published var secondaryTextColor = Color(white: 0.8)
    @Published var mutedTextColor = Color(white: 0.6)
    
    // Status colors
    @Published var successColor = Color(red: 0.0, green: 1.0, blue: 0.5)
    @Published var warningColor = Color(red: 1.0, green: 0.8, blue: 0.0)
    @Published var errorColor = Color(red: 1.0, green: 0.3, blue: 0.3)
    
    // Gradient definitions
    var primaryGradient: LinearGradient {
        LinearGradient(
            colors: [primaryColor, secondaryColor],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
    }
    
    var backgroundGradient: LinearGradient {
        LinearGradient(
            colors: [backgroundColor, cardBackground],
            startPoint: .top,
            endPoint: .bottom
        )
    }
    
    var neonGlow: LinearGradient {
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
    
    // Card style modifiers
    func cardStyle() -> some ViewModifier {
        CardStyleModifier(themeManager: self)
    }
    
    func neonButtonStyle() -> some ViewModifier {
        NeonButtonStyleModifier(themeManager: self)
    }
}

struct CardStyleModifier: ViewModifier {
    let themeManager: ThemeManager
    
    func body(content: Content) -> some View {
        content
            .padding()
            .background(themeManager.cardBackground)
            .cornerRadius(12)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(themeManager.accentColor.opacity(0.3), lineWidth: 1)
            )
            .shadow(color: themeManager.accentColor.opacity(0.2), radius: 5, x: 0, y: 2)
    }
}

struct NeonButtonStyleModifier: ViewModifier {
    let themeManager: ThemeManager
    
    func body(content: Content) -> some View {
        content
            .foregroundColor(themeManager.primaryTextColor)
            .padding(.horizontal, 24)
            .padding(.vertical, 12)
            .background(themeManager.primaryGradient)
            .cornerRadius(8)
            .overlay(
                RoundedRectangle(cornerRadius: 8)
                    .stroke(themeManager.accentColor, lineWidth: 2)
            )
            .shadow(color: themeManager.accentColor.opacity(0.5), radius: 10, x: 0, y: 0)
    }
}

extension View {
    func cardStyle(_ themeManager: ThemeManager) -> some View {
        self.modifier(themeManager.cardStyle())
    }
    
    func neonButtonStyle(_ themeManager: ThemeManager) -> some View {
        self.modifier(themeManager.neonButtonStyle())
    }
}
