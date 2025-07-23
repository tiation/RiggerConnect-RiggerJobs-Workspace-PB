import SwiftUI

// Theme Extensions Placeholder
// ViewModifier for card style
struct CardModifier: ViewModifier {
    let themeManager: ThemeManager
    
    func body(content: Content) -> some View {
        content
            .padding()
            .background(themeManager.surfaceColor)
            .cornerRadius(12)
            .shadow(color: themeManager.accentColor.opacity(0.1), radius: 8, x: 0, y: 4)
    }
}

// ViewModifier for neon button style
struct NeonButtonModifier: ViewModifier {
    let themeManager: ThemeManager
    
    func body(content: Content) -> some View {
        content
            .padding()
            .background(themeManager.accentColor)
            .foregroundColor(.white)
            .cornerRadius(12)
            .shadow(color: themeManager.accentColor.opacity(0.5), radius: 8, x: 0, y: 4)
    }
}

extension View {
    func cardStyle(_ themeManager: ThemeManager) -> some View {
        modifier(CardModifier(themeManager: themeManager))
    }
    
    func neonButtonStyle(_ themeManager: ThemeManager) -> some View {
        modifier(NeonButtonModifier(themeManager: themeManager))
    }
}

extension Location {
    var displayLocation: String {
        "\(city), \(state)"
    }
}
