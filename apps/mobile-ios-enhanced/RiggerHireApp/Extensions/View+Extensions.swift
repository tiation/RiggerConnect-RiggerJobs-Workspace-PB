import SwiftUI

extension View {
    func cardStyle(_ themeManager: ThemeManager) -> some View {
        self
            .padding()
            .background(themeManager.surfaceColor)
            .cornerRadius(12)
            .shadow(
                color: themeManager.shadowColor.opacity(0.1),
                radius: 8,
                x: 0,
                y: 4
            )
    }
}
