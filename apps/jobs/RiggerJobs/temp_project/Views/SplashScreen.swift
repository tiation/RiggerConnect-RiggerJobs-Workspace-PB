import SwiftUI

struct SplashScreen: View {
    @State private var isActive = false
    @State private var logoScale: CGFloat = 0.8
    @State private var logoOpacity: Double = 0.5
    @State private var glowIntensity: Double = 0.3
    @State private var businessTagOpacity: Double = 0.0
    @State private var particleAnimation: Bool = false
    
    var body: some View {
        ZStack {
            // Animated gradient background
            LinearGradient(
                colors: [
                    Color(red: 0.1, green: 0.1, blue: 0.15),
                    Color(red: 0.05, green: 0.05, blue: 0.1),
                    Color(red: 0.15, green: 0.05, blue: 0.15)
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()
            .hueRotation(.degrees(particleAnimation ? 30 : 0))
            .animation(.easeInOut(duration: 3).repeatForever(autoreverses: true), value: particleAnimation)
            
            // Floating particles
            ForEach(0..<20, id: \.self) { index in
                Circle()
                    .fill(
                        RadialGradient(
                            colors: [Color.cyan.opacity(0.6), Color.clear],
                            center: .center,
                            startRadius: 1,
                            endRadius: 4
                        )
                    )
                    .frame(width: CGFloat.random(in: 2...6))
                    .position(
                        x: CGFloat.random(in: 0...UIScreen.main.bounds.width),
                        y: CGFloat.random(in: 0...UIScreen.main.bounds.height)
                    )
                    .opacity(particleAnimation ? 0.8 : 0.2)
                    .scaleEffect(particleAnimation ? 1.2 : 0.8)
                    .animation(
                        .easeInOut(duration: Double.random(in: 2...4))
                        .repeatForever(autoreverses: true)
                        .delay(Double.random(in: 0...2)),
                        value: particleAnimation
                    )
            }
            
            VStack(spacing: 30) {
                // Main logo with business-focused styling
                VStack(spacing: 15) {
                    Image(systemName: "building.2.crop.circle")
                        .font(.system(size: 80, weight: .thin))
                        .foregroundStyle(
                            LinearGradient(
                                colors: [Color.cyan, Color.magenta],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .shadow(
                            color: Color.cyan.opacity(glowIntensity),
                            radius: 20
                        )
                        .shadow(
                            color: Color.magenta.opacity(glowIntensity * 0.7),
                            radius: 30
                        )
                        .scaleEffect(logoScale)
                        .opacity(logoOpacity)
                    
                    // App name with business emphasis
                    Text("RIGGER")
                        .font(.system(size: 42, weight: .black, design: .rounded))
                        .foregroundStyle(
                            LinearGradient(
                                colors: [Color.cyan, Color.white, Color.magenta],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .shadow(color: Color.cyan.opacity(0.8), radius: 10)
                        .scaleEffect(logoScale)
                        .opacity(logoOpacity)
                    
                    Text("JOBS")
                        .font(.system(size: 24, weight: .medium, design: .rounded))
                        .foregroundColor(.white.opacity(0.9))
                        .tracking(8)
                        .scaleEffect(logoScale)
                        .opacity(logoOpacity)
                }
                
                // Business tagline
                VStack(spacing: 8) {
                    Text("FOR EMPLOYERS")
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(.cyan)
                        .tracking(2)
                        .opacity(businessTagOpacity)
                    
                    Text("Find Skilled Riggers & Construction Workers")
                        .font(.system(size: 14, weight: .regular))
                        .foregroundColor(.white.opacity(0.7))
                        .multilineTextAlignment(.center)
                        .opacity(businessTagOpacity)
                }
                .padding(.horizontal, 40)
                
                // Loading indicator
                VStack(spacing: 15) {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle(tint: .cyan))
                        .scaleEffect(1.2)
                        .opacity(businessTagOpacity)
                    
                    Text("Initializing Business Platform...")
                        .font(.system(size: 12, weight: .medium))
                        .foregroundColor(.white.opacity(0.6))
                        .opacity(businessTagOpacity)
                }
            }
            .padding(.horizontal, 30)
        }
        .onAppear {
            startAnimations()
            
            // Navigate after splash duration
            DispatchQueue.main.asyncAfter(deadline: .now() + 3.5) {
                withAnimation(.easeOut(duration: 0.5)) {
                    isActive = true
                }
            }
        }
        .fullScreenCover(isPresented: $isActive) {
            BusinessLoginView()
        }
    }
    
    private func startAnimations() {
        particleAnimation = true
        
        // Logo entrance animation
        withAnimation(.spring(response: 1.2, dampingFraction: 0.6, blendDuration: 0.5)) {
            logoScale = 1.0
            logoOpacity = 1.0
        }
        
        // Glow pulse animation
        withAnimation(.easeInOut(duration: 2).repeatForever(autoreverses: true)) {
            glowIntensity = 0.8
        }
        
        // Business tagline fade-in
        withAnimation(.easeIn(duration: 1).delay(1.5)) {
            businessTagOpacity = 1.0
        }
    }
}

#Preview {
    SplashScreen()
        .preferredColorScheme(.dark)
}
