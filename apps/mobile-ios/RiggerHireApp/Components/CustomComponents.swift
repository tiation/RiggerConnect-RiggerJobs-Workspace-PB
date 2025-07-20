import SwiftUI

// MARK: - Custom TextField
struct CustomTextField: View {
    let title: String
    @Binding var text: String
    let icon: String
    var placeholder: String = ""
    var keyboardType: UIKeyboardType = .default
    
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title)
                .foregroundColor(themeManager.secondaryTextColor)
                .font(.caption)
                .fontWeight(.medium)
            
            HStack {
                Image(systemName: icon)
                    .foregroundColor(themeManager.accentColor)
                    .frame(width: 20)
                
                TextField(placeholder, text: $text)
                    .keyboardType(keyboardType)
                    .autocapitalization(.none)
                    .foregroundColor(themeManager.primaryTextColor)
            }
            .padding()
            .background(themeManager.surfaceColor)
            .cornerRadius(8)
            .overlay(
                RoundedRectangle(cornerRadius: 8)
                    .stroke(themeManager.accentColor.opacity(0.3), lineWidth: 1)
            )
        }
    }
}

// MARK: - Custom Secure Field
struct CustomSecureField: View {
    let title: String
    @Binding var text: String
    let icon: String
    
    @EnvironmentObject var themeManager: ThemeManager
    @State private var isSecure = true
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title)
                .foregroundColor(themeManager.secondaryTextColor)
                .font(.caption)
                .fontWeight(.medium)
            
            HStack {
                Image(systemName: icon)
                    .foregroundColor(themeManager.accentColor)
                    .frame(width: 20)
                
                if isSecure {
                    SecureField("", text: $text)
                        .foregroundColor(themeManager.primaryTextColor)
                } else {
                    TextField("", text: $text)
                        .foregroundColor(themeManager.primaryTextColor)
                }
                
                Button(action: { isSecure.toggle() }) {
                    Image(systemName: isSecure ? "eye.slash" : "eye")
                        .foregroundColor(themeManager.mutedTextColor)
                }
            }
            .padding()
            .background(themeManager.surfaceColor)
            .cornerRadius(8)
            .overlay(
                RoundedRectangle(cornerRadius: 8)
                    .stroke(themeManager.accentColor.opacity(0.3), lineWidth: 1)
            )
        }
    }
}

// MARK: - Custom Progress View
struct NeonProgressView: View {
    let progress: Double
    let color: Color
    
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        GeometryReader { geometry in
            ZStack(alignment: .leading) {
                // Background
                Rectangle()
                    .fill(themeManager.surfaceColor)
                    .frame(height: 6)
                    .cornerRadius(3)
                
                // Progress
                Rectangle()
                    .fill(color)
                    .frame(width: max(0, min(geometry.size.width * progress, geometry.size.width)), height: 6)
                    .cornerRadius(3)
                    .overlay(
                        color
                            .opacity(0.3)
                            .blur(radius: 4)
                    )
            }
        }
        .frame(height: 6)
    }
}

// MARK: - Custom Badge
struct NeonBadge: View {
    let text: String
    let color: Color
    
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        Text(text)
            .font(.caption)
            .fontWeight(.semibold)
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(color.opacity(0.2))
            .foregroundColor(color)
            .cornerRadius(6)
            .overlay(
                color
                    .opacity(0.3)
                    .blur(radius: 2)
            )
    }
}

// MARK: - Loading Animation
struct PulsingLoadingView: View {
    let color: Color
    @State private var scale: CGFloat = 1.0
    
    var body: some View {
        Circle()
            .fill(color)
            .frame(width: 20, height: 20)
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

// MARK: - Loading Dots
struct LoadingDotsView: View {
    let color: Color
    @State private var animationOffset: CGFloat = 0
    
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

// MARK: - Divider with Text
struct DividerWithText: View {
    let text: String
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        HStack {
            Rectangle()
                .fill(themeManager.mutedTextColor.opacity(0.3))
                .frame(height: 1)
            
            Text(text)
                .font(.caption)
                .foregroundColor(themeManager.mutedTextColor)
            
            Rectangle()
                .fill(themeManager.mutedTextColor.opacity(0.3))
                .frame(height: 1)
        }
    }
}
