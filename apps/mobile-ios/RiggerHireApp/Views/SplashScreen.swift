import SwiftUI

struct SplashScreen: View {
    @State private var isLoading = true
    @State private var logoScale: CGFloat = 0.8
    @State private var logoOpacity: Double = 0.3
    @State private var glowIntensity: Double = 0.0
    @State private var rotationAngle: Double = 0
    
    var body: some View {
        ZStack {
            // Dark background with gradient
            LinearGradient(
                colors: [
                    Color.black,
                    Color(red: 0.1, green: 0.1, blue: 0.2),
                    Color.black
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()
            
            // Animated background particles
            ForEach(0..<6, id: \.self) { i in
                Circle()
                    .fill(
                        RadialGradient(
                            colors: [.cyan.opacity(0.1), .clear],
                            center: .center,
                            startRadius: 10,
                            endRadius: 50
                        )
                    )
                    .frame(width: 100, height: 100)
                    .offset(
                        x: CGFloat(cos(Double(i) * .pi / 3 + rotationAngle * .pi / 180)) * 150,
                        y: CGFloat(sin(Double(i) * .pi / 3 + rotationAngle * .pi / 180)) * 150
                    )
                    .animation(
                        Animation.linear(duration: 20).repeatForever(autoreverses: false),
                        value: rotationAngle
                    )
            }
            
            VStack(spacing: 30) {
                // Main Logo
                ZStack {
                    // Outer glow ring
                    Circle()
                        .stroke(
                            LinearGradient(
                                colors: [.cyan, .magenta, .cyan],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            ),
                            lineWidth: 4
                        )
                        .frame(width: 120, height: 120)
                        .opacity(glowIntensity)
                        .scaleEffect(logoScale + 0.1)
                        .blur(radius: glowIntensity * 10)
                    
                    // Inner logo circle
                    Circle()
                        .fill(
                            RadialGradient(
                                colors: [
                                    .cyan.opacity(0.3),
                                    .black.opacity(0.8),
                                    .magenta.opacity(0.2)
                                ],
                                center: .center,
                                startRadius: 20,
                                endRadius: 60
                            )
                        )
                        .frame(width: 100, height: 100)
                        .overlay(
                            Circle()
                                .stroke(
                                    LinearGradient(
                                        colors: [.cyan, .magenta],
                                        startPoint: .topLeading,
                                        endPoint: .bottomTrailing
                                    ),
                                    lineWidth: 2
                                )
                        )
                        .scaleEffect(logoScale)
                        .opacity(logoOpacity)
                    
                    // Rigger icon
                    Image(systemName: "crane.fill")
                        .font(.system(size: 40, weight: .bold))
                        .foregroundStyle(
                            LinearGradient(
                                colors: [.cyan, .white, .magenta],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .scaleEffect(logoScale)
                        .opacity(logoOpacity)
                        .shadow(color: .cyan, radius: glowIntensity * 5)
                }
                
                // App Title
                VStack(spacing: 8) {
                    Text("RiggerHire")
                        .font(.system(size: 32, weight: .bold, design: .rounded))
                        .foregroundStyle(
                            LinearGradient(
                                colors: [.cyan, .white, .magenta],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .opacity(logoOpacity)
                        .shadow(color: .cyan, radius: glowIntensity * 3)
                    
                    Text("Find Your Next Opportunity")
                        .font(.system(size: 16, weight: .medium))
                        .foregroundColor(.gray)
                        .opacity(logoOpacity * 0.8)
                }
                
                // Loading indicator
                if isLoading {
                    VStack(spacing: 12) {
                        // Custom loading dots
                        HStack(spacing: 8) {
                            ForEach(0..<3) { index in
                                Circle()
                                    .fill(
                                        LinearGradient(
                                            colors: [.cyan, .magenta],
                                            startPoint: .topLeading,
                                            endPoint: .bottomTrailing
                                        )
                                    )
                                    .frame(width: 10, height: 10)
                                    .scaleEffect(logoOpacity)
                                    .opacity(glowIntensity)
                                    .animation(
                                        Animation.easeInOut(duration: 0.6)
                                            .repeatForever()
                                            .delay(Double(index) * 0.2),
                                        value: glowIntensity
                                    )
                            }
                        }
                        
                        Text("Loading...")
                            .font(.system(size: 14, weight: .medium))
                            .foregroundColor(.cyan)
                            .opacity(logoOpacity * 0.7)
                    }
                }
            }
        }
        .onAppear {
            startAnimations()
            
            // Auto-transition after 3 seconds
            DispatchQueue.main.asyncAfter(deadline: .now() + 3.0) {
                withAnimation(.easeInOut(duration: 0.5)) {
                    isLoading = false
                }
            }
        }
        .preferredColorScheme(.dark)
    }
    
    private func startAnimations() {
        // Start rotation animation
        withAnimation(Animation.linear(duration: 20).repeatForever(autoreverses: false)) {
            rotationAngle = 360
        }
        
        // Logo scale animation
        withAnimation(.easeOut(duration: 1.0)) {
            logoScale = 1.0
            logoOpacity = 1.0
        }
        
        // Glow animation
        withAnimation(.easeInOut(duration: 2.0).repeatForever(autoreverses: true)) {
            glowIntensity = 1.0
        }
    }
}

#Preview {
    SplashScreen()
        .preferredColorScheme(.dark)
}
