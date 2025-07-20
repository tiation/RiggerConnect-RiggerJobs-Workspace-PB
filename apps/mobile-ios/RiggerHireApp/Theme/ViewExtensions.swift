import SwiftUI

extension View {
    func cardStyle(_ themeManager: ThemeManager) -> some View {
        modifier(CardStyleModifier(themeManager: themeManager))
    }
    
    func neonButtonStyle(_ themeManager: ThemeManager) -> some View {
        modifier(NeonButtonStyleModifier(themeManager: themeManager))
    }
}

struct CardStyleModifier: ViewModifier {
    let themeManager: ThemeManager
    
    func body(content: Content) -> some View {
        content
            .padding()
            .background(themeManager.backgroundColor.opacity(0.6))
            .cornerRadius(12)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(themeManager.accentColor.opacity(0.3), lineWidth: 1)
            )
            .shadow(color: themeManager.shadowColor, radius: 5, x: 0, y: 5)
            .padding([.top, .horizontal])
    }
}

struct NeonButtonStyleModifier: ViewModifier {
    let themeManager: ThemeManager
    
    func body(content: Content) -> some View {
        content
            .padding()
            .background(themeManager.accentColor)
            .foregroundColor(.white)
            .cornerRadius(12)
            .shadow(color: themeManager.accentColor.opacity(0.5), radius: 10, x: 0, y: 5)
    }
}
