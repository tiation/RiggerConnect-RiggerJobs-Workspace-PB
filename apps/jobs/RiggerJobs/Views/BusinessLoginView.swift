import SwiftUI

struct BusinessLoginView: View {
    @State private var email = ""
    @State private var password = ""
    @State private var rememberMe = false
    @State private var isLoading = false
    @State private var showingAlert = false
    @State private var alertMessage = ""
    @State private var showingRegister = false
    @State private var showingForgotPassword = false
    
    var body: some View {
        NavigationStack {
            ZStack {
                // Dark gradient background
                LinearGradient(
                    colors: [
                        Color.black,
                        Color(red: 0.05, green: 0.1, blue: 0.15),
                        Color.black
                    ],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
                .ignoresSafeArea()
                
                ScrollView {
                    VStack(spacing: 32) {
                        Spacer(minLength: 60)
                        
                        // Header Section
                        VStack(spacing: 24) {
                            // Company Logo
                            ZStack {
                                Circle()
                                    .fill(
                                        RadialGradient(
                                            colors: [.cyan.opacity(0.3), .clear],
                                            center: .center,
                                            startRadius: 40,
                                            endRadius: 80
                                        )
                                    )
                                    .frame(width: 120, height: 120)
                                
                                Circle()
                                    .fill(
                                        LinearGradient(
                                            colors: [.black.opacity(0.8), .cyan.opacity(0.1)],
                                            startPoint: .topLeading,
                                            endPoint: .bottomTrailing
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
                                
                                Image(systemName: "building.2.crop.circle.fill")
                                    .font(.system(size: 50, weight: .bold))
                                    .foregroundStyle(
                                        LinearGradient(
                                            colors: [.cyan, .white, .magenta],
                                            startPoint: .topLeading,
                                            endPoint: .bottomTrailing
                                        )
                                    )
                            }
                            
                            VStack(spacing: 12) {
                                Text("RiggerJobs")
                                    .font(.system(size: 36, weight: .bold, design: .rounded))
                                    .foregroundStyle(
                                        LinearGradient(
                                            colors: [.cyan, .white, .magenta],
                                            startPoint: .leading,
                                            endPoint: .trailing
                                        )
                                    )
                                
                                Text("Enterprise Workforce Management")
                                    .font(.system(size: 16, weight: .medium))
                                    .foregroundColor(.gray)
                                    .multilineTextAlignment(.center)
                            }
                        }
                        
                        // Login Form
                        VStack(spacing: 24) {
                            VStack(spacing: 16) {
                                // Email Field
                                BusinessTextField(
                                    placeholder: "Company Email",
                                    text: $email,
                                    icon: "envelope.fill",
                                    keyboardType: .emailAddress
                                )
                                
                                // Password Field
                                BusinessTextField(
                                    placeholder: "Password",
                                    text: $password,
                                    icon: "lock.fill",
                                    isSecure: true
                                )
                            }
                            
                            // Options Row
                            HStack {
                                // Remember Me
                                Button {
                                    rememberMe.toggle()
                                } label: {
                                    HStack(spacing: 8) {
                                        Image(systemName: rememberMe ? "checkmark.square.fill" : "square")
                                            .font(.system(size: 18))
                                            .foregroundColor(rememberMe ? .cyan : .gray)
                                        
                                        Text("Remember me")
                                            .font(.system(size: 14, weight: .medium))
                                            .foregroundColor(.gray)
                                    }
                                }
                                
                                Spacer()
                                
                                // Forgot Password
                                Button("Forgot Password?") {
                                    showingForgotPassword = true
                                }
                                .font(.system(size: 14, weight: .medium))
                                .foregroundColor(.cyan)
                            }
                            .padding(.horizontal, 4)
                            
                            // Login Button
                            Button {
                                loginUser()
                            } label: {
                                HStack(spacing: 12) {
                                    if isLoading {
                                        ProgressView()
                                            .progressViewStyle(CircularProgressViewStyle(tint: .white))
                                            .scaleEffect(0.8)
                                    } else {
                                        Image(systemName: "building.2.fill")
                                            .font(.system(size: 16, weight: .bold))
                                        Text("Sign In to Dashboard")
                                            .font(.system(size: 18, weight: .bold))
                                    }
                                }
                                .foregroundColor(.white)
                                .frame(maxWidth: .infinity)
                                .frame(height: 56)
                                .background(
                                    LinearGradient(
                                        colors: isFormValid ? [.cyan, .magenta] : [.gray.opacity(0.3)],
                                        startPoint: .leading,
                                        endPoint: .trailing
                                    )
                                )
                                .cornerRadius(16)
                                .shadow(color: isFormValid ? .cyan.opacity(0.4) : .clear, radius: 15)
                            }
                            .disabled(!isFormValid || isLoading)
                        }
                        .padding(.horizontal, 24)
                        
                        // Divider
                        HStack {
                            Rectangle()
                                .fill(Color.gray.opacity(0.3))
                                .frame(height: 1)
                            
                            Text("OR")
                                .font(.system(size: 14, weight: .medium))
                                .foregroundColor(.gray)
                                .padding(.horizontal, 16)
                            
                            Rectangle()
                                .fill(Color.gray.opacity(0.3))
                                .frame(height: 1)
                        }
                        .padding(.horizontal, 24)
                        
                        // SSO Options
                        VStack(spacing: 12) {
                            // Microsoft SSO
                            Button {
                                // Handle Microsoft SSO
                            } label: {
                                HStack(spacing: 12) {
                                    Image(systemName: "microsoft.logo")
                                        .font(.system(size: 18, weight: .bold))
                                        .foregroundColor(.white)
                                    
                                    Text("Continue with Microsoft")
                                        .font(.system(size: 16, weight: .semibold))
                                        .foregroundColor(.white)
                                }
                                .frame(maxWidth: .infinity)
                                .frame(height: 48)
                                .background(
                                    RoundedRectangle(cornerRadius: 12)
                                        .fill(Color.black.opacity(0.4))
                                        .overlay(
                                            RoundedRectangle(cornerRadius: 12)
                                                .stroke(Color.gray.opacity(0.3), lineWidth: 1)
                                        )
                                )
                            }
                            
                            // Google SSO
                            Button {
                                // Handle Google SSO
                            } label: {
                                HStack(spacing: 12) {
                                    Image(systemName: "globe")
                                        .font(.system(size: 18, weight: .bold))
                                        .foregroundColor(.white)
                                    
                                    Text("Continue with Google")
                                        .font(.system(size: 16, weight: .semibold))
                                        .foregroundColor(.white)
                                }
                                .frame(maxWidth: .infinity)
                                .frame(height: 48)
                                .background(
                                    RoundedRectangle(cornerRadius: 12)
                                        .fill(Color.black.opacity(0.4))
                                        .overlay(
                                            RoundedRectangle(cornerRadius: 12)
                                                .stroke(Color.gray.opacity(0.3), lineWidth: 1)
                                        )
                                )
                            }
                        }
                        .padding(.horizontal, 24)
                        
                        // Register Link
                        VStack(spacing: 16) {
                            HStack {
                                Text("New to RiggerJobs?")
                                    .font(.system(size: 16))
                                    .foregroundColor(.gray)
                                
                                Button("Create Business Account") {
                                    showingRegister = true
                                }
                                .font(.system(size: 16, weight: .semibold))
                                .foregroundColor(.cyan)
                            }
                            
                            // Enterprise Contact
                            Text("Need enterprise features? ")
                                .font(.system(size: 14))
                                .foregroundColor(.gray)
                            +
                            Text("Contact Sales")
                                .font(.system(size: 14, weight: .semibold))
                                .foregroundColor(.magenta)
                        }
                        
                        Spacer(minLength: 40)
                    }
                }
            }
            .navigationBarHidden(true)
        }
        .sheet(isPresented: $showingRegister) {
            BusinessRegisterView()
        }
        .sheet(isPresented: $showingForgotPassword) {
            ForgotPasswordView()
        }
        .alert("Login Error", isPresented: $showingAlert) {
            Button("OK") { }
        } message: {
            Text(alertMessage)
        }
        .preferredColorScheme(.dark)
    }
    
    private var isFormValid: Bool {
        !email.isEmpty && !password.isEmpty && isValidEmail(email)
    }
    
    private func isValidEmail(_ email: String) -> Bool {
        let emailRegex = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}"
        let emailPredicate = NSPredicate(format:"SELF MATCHES %@", emailRegex)
        return emailPredicate.evaluate(with: email)
    }
    
    private func loginUser() {
        isLoading = true
        
        // Simulate login process
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
            isLoading = false
            
            if email == "admin@demo.com" && password == "demo123" {
                // Navigate to dashboard
                // UserDefaults.standard.set(true, forKey: "isBusinessLoggedIn")
            } else {
                alertMessage = "Invalid credentials. Please try again."
                showingAlert = true
            }
        }
    }
}

struct BusinessTextField: View {
    let placeholder: String
    @Binding var text: String
    let icon: String
    var isSecure: Bool = false
    var keyboardType: UIKeyboardType = .default
    
    var body: some View {
        HStack(spacing: 16) {
            Image(systemName: icon)
                .font(.system(size: 18, weight: .medium))
                .foregroundColor(.cyan)
                .frame(width: 24)
            
            if isSecure {
                SecureField(placeholder, text: $text)
                    .font(.system(size: 16))
                    .foregroundColor(.white)
            } else {
                TextField(placeholder, text: $text)
                    .font(.system(size: 16))
                    .foregroundColor(.white)
                    .keyboardType(keyboardType)
                    .autocapitalization(.none)
                    .disableAutocorrection(true)
            }
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 18)
        .background(
            RoundedRectangle(cornerRadius: 14)
                .fill(Color.black.opacity(0.4))
                .overlay(
                    RoundedRectangle(cornerRadius: 14)
                        .stroke(
                            LinearGradient(
                                colors: [.cyan.opacity(0.3), .magenta.opacity(0.2)],
                                startPoint: .leading,
                                endPoint: .trailing
                            ),
                            lineWidth: 1
                        )
                )
        )
    }
}

#Preview {
    BusinessLoginView()
        .preferredColorScheme(.dark)
}
