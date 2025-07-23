import SwiftUI

// MARK: - View Extensions
extension View {
    func cardStyle(_ themeManager: ThemeManager) -> some View {
        self
            .padding()
            .background(themeManager.surfaceColor)
            .cornerRadius(16)
            .shadow(color: themeManager.shadowColor, radius: 8, x: 0, y: 2)
    }
    
    func primaryCardStyle(_ themeManager: ThemeManager) -> some View {
        self
            .padding()
            .background(
                LinearGradient(
                    colors: [themeManager.primaryColor.opacity(0.1), themeManager.accentColor.opacity(0.1)],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
            )
            .cornerRadius(16)
            .overlay(
                RoundedRectangle(cornerRadius: 16)
                    .stroke(themeManager.primaryColor.opacity(0.3), lineWidth: 1)
            )
    }
    
    func glowEffect(color: Color, intensity: CGFloat = 0.6) -> some View {
        self
            .shadow(color: color.opacity(intensity), radius: 10, x: 0, y: 0)
            .shadow(color: color.opacity(intensity * 0.6), radius: 20, x: 0, y: 0)
    }
}

// MARK: - Custom Button Styles
struct PrimaryButtonStyle: ButtonStyle {
    let themeManager: ThemeManager
    
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .foregroundColor(themeManager.buttonTextColor)
            .font(.headline)
            .padding(.vertical, 16)
            .padding(.horizontal, 32)
            .background(
                LinearGradient(
                    colors: [themeManager.primaryColor, themeManager.accentColor],
                    startPoint: .leading,
                    endPoint: .trailing
                )
            )
            .cornerRadius(12)
            .scaleEffect(configuration.isPressed ? 0.95 : 1.0)
            .opacity(configuration.isPressed ? 0.8 : 1.0)
            .animation(.easeInOut(duration: 0.1), value: configuration.isPressed)
            .glowEffect(color: themeManager.accentColor, intensity: 0.4)
    }
}

struct SecondaryButtonStyle: ButtonStyle {
    let themeManager: ThemeManager
    
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .foregroundColor(themeManager.accentColor)
            .font(.headline)
            .padding(.vertical, 16)
            .padding(.horizontal, 32)
            .background(themeManager.surfaceColor)
            .cornerRadius(12)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(themeManager.accentColor, lineWidth: 2)
            )
            .scaleEffect(configuration.isPressed ? 0.95 : 1.0)
            .opacity(configuration.isPressed ? 0.8 : 1.0)
            .animation(.easeInOut(duration: 0.1), value: configuration.isPressed)
    }
}

struct ActionButtonStyle: ButtonStyle {
    let themeManager: ThemeManager
    let color: Color
    
    init(themeManager: ThemeManager, color: Color? = nil) {
        self.themeManager = themeManager
        self.color = color ?? themeManager.accentColor
    }
    
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .foregroundColor(.white)
            .font(.subheadline)
            .fontWeight(.semibold)
            .padding(.vertical, 12)
            .padding(.horizontal, 20)
            .background(color)
            .cornerRadius(8)
            .scaleEffect(configuration.isPressed ? 0.95 : 1.0)
            .opacity(configuration.isPressed ? 0.8 : 1.0)
            .animation(.easeInOut(duration: 0.1), value: configuration.isPressed)
    }
}

// MARK: - Custom Progress View
struct NeonProgressView: View {
    let progress: Double
    let color: Color
    let height: CGFloat
    
    init(progress: Double, color: Color, height: CGFloat = 8) {
        self.progress = progress
        self.color = color
        self.height = height
    }
    
    var body: some View {
        GeometryReader { geometry in
            ZStack(alignment: .leading) {
                // Background
                Rectangle()
                    .fill(Color.gray.opacity(0.3))
                    .frame(height: height)
                    .cornerRadius(height / 2)
                
                // Progress
                Rectangle()
                    .fill(color)
                    .frame(width: max(0, min(geometry.size.width * progress, geometry.size.width)), height: height)
                    .cornerRadius(height / 2)
                    .glowEffect(color: color, intensity: 0.8)
                    .animation(.easeInOut(duration: 0.3), value: progress)
            }
        }
        .frame(height: height)
    }
}

// MARK: - Custom Badge View
struct BadgeView: View {
    let text: String
    let color: Color
    let textColor: Color
    
    init(_ text: String, color: Color, textColor: Color = .white) {
        self.text = text
        self.color = color
        self.textColor = textColor
    }
    
    var body: some View {
        Text(text)
            .font(.caption)
            .fontWeight(.semibold)
            .foregroundColor(textColor)
            .padding(.horizontal, 12)
            .padding(.vertical, 6)
            .background(color)
            .cornerRadius(12)
    }
}

// MARK: - Loading Animation
struct PulsingView: View {
    @State private var scale: CGFloat = 1.0
    let color: Color
    
    var body: some View {
        Circle()
            .fill(color)
            .scaleEffect(scale)
            .opacity(2 - scale)
            .onAppear {
                withAnimation(
                    Animation
                        .easeInOut(duration: 1.0)
                        .repeatForever(autoreverses: true)
                ) {
                    scale = 1.5
                }
            }
    }
}

struct LoadingDotsView: View {
    @State private var animationOffset: CGFloat = 0
    let color: Color
    
    var body: some View {
        HStack(spacing: 8) {
            ForEach(0..<3, id: \.self) { index in
                Circle()
                    .fill(color)
                    .frame(width: 8, height: 8)
                    .offset(y: animationOffset)
                    .animation(
                        Animation
                            .easeInOut(duration: 0.6)
                            .repeatForever()
                            .delay(Double(index) * 0.2),
                        value: animationOffset
                    )
            }
        }
        .onAppear {
            animationOffset = -10
        }
    }
}
