import SwiftUI

struct LoginScreen: View {
    @EnvironmentObject var authManager: AuthenticationManager
    @State private var email = ""
    @State private var password = ""
    @State private var showingSignup = false
    @State private var showingForgotPassword = false
    
    var body: some View {
        ZStack {
            // Background gradient
            LinearGradient(
                colors: [Color.black, Color.gray.opacity(0.3)],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()
            
            VStack(spacing: 30) {
                // Logo and Title
                VStack(spacing: 20) {
                    Image(systemName: "briefcase.circle.fill")
                        .font(.system(size: 80))
                        .foregroundStyle(
                            LinearGradient(
                                colors: [.cyan, .blue],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .shadow(color: .cyan.opacity(0.5), radius: 10)
                    
                    VStack(spacing: 8) {
                        Text("RiggerJobs")
                            .font(.largeTitle)
                            .fontWeight(.bold)
                            .foregroundColor(.white)
                        
                        Text("Employer Portal")
                            .font(.title3)
                            .foregroundColor(.gray)
                    }
                }
                
                // Login Form
                VStack(spacing: 20) {
                    // Email Field
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Company Email")
                            .font(.headline)
                            .foregroundColor(.white)
                        
                        TextField("Enter your company email", text: $email)
                            .textFieldStyle(NeonTextFieldStyle())
                            .keyboardType(.emailAddress)
                            .textContentType(.emailAddress)
                            .autocapitalization(.none)
                    }
                    
                    // Password Field
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Password")
                            .font(.headline)
                            .foregroundColor(.white)
                        
                        SecureField("Enter your password", text: $password)
                            .textFieldStyle(NeonTextFieldStyle())
                            .textContentType(.password)
                    }
                    
                    // Forgot Password Button
                    HStack {
                        Spacer()
                        Button("Forgot Password?") {
                            showingForgotPassword = true
                        }
                        .font(.callout)
                        .foregroundColor(.cyan)
                    }
                    
                    // Login Button
                    Button(action: loginAction) {
                        HStack {
                            if authManager.isLoading {
                                ProgressView()
                                    .progressViewStyle(CircularProgressViewStyle(tint: .black))
                                    .scaleEffect(0.8)
                            } else {
                                Image(systemName: "arrow.right.circle.fill")
                            }
                            Text("Sign In")
                        }
                        .font(.headline)
                        .foregroundColor(.black)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(
                            LinearGradient(
                                colors: [.cyan, .blue],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .cornerRadius(12)
                        .shadow(color: .cyan.opacity(0.3), radius: 8)
                    }
                    .disabled(authManager.isLoading || email.isEmpty || password.isEmpty)
                    
                    // Error Message
                    if let errorMessage = authManager.errorMessage {
                        Text(errorMessage)
                            .font(.callout)
                            .foregroundColor(.red)
                            .multilineTextAlignment(.center)
                    }
                    
                    // Signup Link
                    HStack {
                        Text("New to RiggerJobs?")
                            .foregroundColor(.gray)
                        
                        Button("Create Account") {
                            showingSignup = true
                        }
                        .font(.callout)
                        .fontWeight(.semibold)
                        .foregroundColor(.cyan)
                    }
                }
                
                Spacer()
            }
            .padding(.horizontal, 30)
            .padding(.top, 50)
        }
        .sheet(isPresented: $showingSignup) {
            SignupScreen()
        }
        .sheet(isPresented: $showingForgotPassword) {
            ForgotPasswordScreen()
        }
    }
    
    private func loginAction() {
        Task {
            await authManager.login(email: email, password: password)
        }
    }
}

// MARK: - Custom Text Field Style

struct NeonTextFieldStyle: TextFieldStyle {
    func _body(configuration: TextField<Self._Label>) -> some View {
        configuration
            .padding()
            .background(Color.black.opacity(0.3))
            .cornerRadius(10)
            .overlay(
                RoundedRectangle(cornerRadius: 10)
                    .stroke(Color.cyan.opacity(0.5), lineWidth: 1)
            )
            .foregroundColor(.white)
    }
}

// MARK: - Preview

#Preview {
    LoginScreen()
        .environmentObject(AuthenticationManager())
        .preferredColorScheme(.dark)
}
