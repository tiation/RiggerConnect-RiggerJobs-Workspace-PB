import SwiftUI

struct LoginScreen: View {
    @State private var email = ""
    @State private var password = ""
    @State private var isLoading = false
    @State private var showError = false
    @State private var errorMessage = ""
    
    var body: some View {
        GeometryReader { geometry in
            ZStack {
                // Dark neon background
                LinearGradient(
                    colors: [Color.black, Color(hex: "#1a1a1a"), Color(hex: "#2d2d2d")],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
                .ignoresSafeArea()
                
                VStack(spacing: 30) {
                    Spacer()
                    
                    // Logo and Title
                    VStack(spacing: 20) {
                        Image(systemName: "person.crop.circle.fill")
                            .font(.system(size: 80))
                            .foregroundStyle(
                                LinearGradient(
                                    colors: [Color.cyan, Color.magenta],
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                )
                            )
                        
                        Text("RiggerHire")
                            .font(.largeTitle)
                            .fontWeight(.bold)
                            .foregroundColor(.white)
                        
                        Text("Enterprise Job Platform")
                            .font(.subheadline)
                            .foregroundColor(.gray)
                    }
                    
                    // Login Form
                    VStack(spacing: 20) {
                        // Email Field
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Email")
                                .foregroundColor(.white)
                                .font(.caption)
                                .fontWeight(.medium)
                            
                            TextField("Enter your email", text: $email)
                                .textFieldStyle(NeonTextFieldStyle())
                                .keyboardType(.emailAddress)
                                .autocapitalization(.none)
                        }
                        
                        // Password Field
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Password")
                                .foregroundColor(.white)
                                .font(.caption)
                                .fontWeight(.medium)
                            
                            SecureField("Enter your password", text: $password)
                                .textFieldStyle(NeonTextFieldStyle())
                        }
                        
                        // Login Button
                        Button(action: loginAction) {
                            HStack {
                                if isLoading {
                                    ProgressView()
                                        .scaleEffect(0.8)
                                        .tint(.white)
                                }
                                Text(isLoading ? "Signing In..." : "Sign In")
                                    .font(.headline)
                                    .fontWeight(.semibold)
                            }
                            .foregroundColor(.black)
                            .frame(maxWidth: .infinity)
                            .frame(height: 50)
                            .background(
                                LinearGradient(
                                    colors: [Color.cyan, Color.magenta],
                                    startPoint: .leading,
                                    endPoint: .trailing
                                )
                            )
                            .cornerRadius(12)
                        }
                        .disabled(isLoading || email.isEmpty || password.isEmpty)
                        
                        // Forgot Password
                        Button("Forgot Password?") {
                            // Navigate to forgot password
                        }
                        .foregroundColor(.cyan)
                        .font(.subheadline)
                    }
                    .padding(.horizontal, 30)
                    
                    Spacer()
                    
                    // Sign Up Link
                    HStack {
                        Text("Don't have an account?")
                            .foregroundColor(.gray)
                        Button("Sign Up") {
                            // Navigate to signup
                        }
                        .foregroundColor(.cyan)
                        .fontWeight(.medium)
                    }
                    .font(.subheadline)
                }
                .padding(.bottom, 30)
            }
        }
        .alert("Login Error", isPresented: $showError) {
            Button("OK") { }
        } message: {
            Text(errorMessage)
        }
    }
    
    private func loginAction() {
        isLoading = true
        // Implement authentication logic
        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
            isLoading = false
            // Handle success/error
        }
    }
}

// Custom TextField Style
struct NeonTextFieldStyle: TextFieldStyle {
    func _body(configuration: TextField<Self._Label>) -> some View {
        configuration
            .padding()
            .background(
                RoundedRectangle(cornerRadius: 10)
                    .fill(Color.black.opacity(0.3))
                    .overlay(
                        RoundedRectangle(cornerRadius: 10)
                            .stroke(
                                LinearGradient(
                                    colors: [Color.cyan.opacity(0.5), Color.magenta.opacity(0.5)],
                                    startPoint: .leading,
                                    endPoint: .trailing
                                ),
                                lineWidth: 1
                            )
                    )
            )
            .foregroundColor(.white)
    }
}

// Color extension for hex colors
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
            (a, r, g, b) = (1, 1, 1, 0)
        }
        
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue:  Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}

#Preview {
    LoginScreen()
}
