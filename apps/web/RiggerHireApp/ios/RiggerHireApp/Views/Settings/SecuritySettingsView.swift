import SwiftUI

struct SecuritySettingsView: View {
    var body: some View {
        ZStack {
            // Dark neon background gradient
            LinearGradient(
                colors: [Color.black, Color(red: 0.1, green: 0.1, blue: 0.2)],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()
            
            VStack(spacing: 20) {
                // Header with neon icon
                VStack(spacing: 10) {
                    Image(systemName: "shield")
                        .font(.system(size: 50))
                        .foregroundStyle(
                            LinearGradient(
                                colors: [.cyan, .purple],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                    
                    Text("Security")
                        .font(.title)
                        .fontWeight(.bold)
                        .foregroundColor(.white)
                    
                    Text("Manage account security settings")
                        .font(.body)
                        .foregroundColor(.gray)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 20)
                }
                
                // Main content area
                ScrollView {
                    VStack(spacing: 20) {
                        // Placeholder content with neon styling
                        ForEach(0..<3, id: \.self) { index in
                            RoundedRectangle(cornerRadius: 16)
                                .fill(Color.white.opacity(0.05))
                                .frame(height: 100)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 16)
                                        .stroke(Color.cyan.opacity(0.3), lineWidth: 1)
                                )
                                .overlay(
                                    Text("Content Section \(index + 1)")
                                        .foregroundColor(.cyan)
                                        .font(.headline)
                                )
                        }
                    }
                    .padding(.horizontal, 20)
                }
                
                // Action button
                Button(action: {
                    // Handle action
                }) {
                    Text("Primary Action")
                        .font(.headline)
                        .foregroundColor(.black)
                        .frame(maxWidth: .infinity)
                        .frame(height: 50)
                        .background(
                            LinearGradient(
                                colors: [.cyan, .purple],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .cornerRadius(25)
                        .shadow(color: .cyan.opacity(0.3), radius: 10, x: 0, y: 5)
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 20)
            }
        }
        .navigationTitle("Security")
        .navigationBarTitleDisplayMode(.inline)
    }
}

#Preview {
    SecuritySettingsView()
}