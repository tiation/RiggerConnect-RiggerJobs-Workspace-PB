import SwiftUI
import LocalAuthentication

struct LoginView: View {
    @EnvironmentObject var authManager: AuthenticationManager
    @State private var email = ""
    @State private var password = ""
    @State private var showingSignUp = false
    @State private var showingForgotPassword = false
    @State private var twoFactorCode = ""
    @State private var rememberMe = false
    
    var body: some View {
        ZStack {
            // Dark neon background
            LinearGradient(
                colors: [Color.black, Color(red: 0.1, green: 0.1, blue: 0.2)],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()
            
            ScrollView {
                VStack(spacing: 30) {
                    // Logo and Title
                    VStack(spacing: 20) {
                        Image(systemName: "hammer.circle.fill")
                            .font(.system(size: 80))
                            .foregroundColor(.cyan)
                            .shadow(color: .cyan, radius: 10)
                        
                        Text("RiggerHire")
                            .font(.largeTitle)
                            .fontWeight(.bold)
                            .foregroundColor(.white)
                        
                        Text("Enterprise B2B Labour Hire Platform")
                            .font(.subheadline)
                            .foregroundColor(.gray)
                            .multilineTextAlignment(.center)
                    }
                    .padding(.top, 50)
                    
                    // Login Form
                    VStack(spacing: 20) {
                        if authManager.requiresTwoFactorAuth {
                            twoFactorSection
                        } else {
                            loginSection
                        }
                    }
                    .padding(.horizontal, 30)
                    
                    // Biometric Authentication
                    if !authManager.requiresTwoFactorAuth {
                        biometricSection
                    }
                    
                    // Error Message
                    if let errorMessage = authManager.errorMessage {
                        Text(errorMessage)
                            .foregroundColor(.red)
                            .padding()
                            .background(Color.red.opacity(0.1))
                            .cornerRadius(8)
                            .padding(.horizontal)
                    }
                    
                    Spacer()
                }
            }
        }
        .sheet(isPresented: $showingSignUp) {
            NavigationStack {
                RegisterView()
            }
        }
        .sheet(isPresented: $showingForgotPassword) {
            NavigationStack {
                ForgotPasswordView()
            }
        }
    }
    
    private var loginSection: some View {
        VStack(spacing: 20) {
            // Email Field
            VStack(alignment: .leading, spacing: 8) {
                Text("Email")
                    .foregroundColor(.cyan)
                    .font(.headline)
                
                TextField("Enter your email", text: $email)
                    .keyboardType(.emailAddress)
                    .autocapitalization(.none)
                    .padding()
                    .background(Color.black.opacity(0.3))
                    .cornerRadius(12)
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(Color.cyan.opacity(0.5), lineWidth: 1)
                    )
                    .foregroundColor(.white)
            }
            
            // Password Field
            VStack(alignment: .leading, spacing: 8) {
                Text("Password")
                    .foregroundColor(.cyan)
                    .font(.headline)
                
                SecureField("Enter your password", text: $password)
                    .padding()
                    .background(Color.black.opacity(0.3))
                    .cornerRadius(12)
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(Color.cyan.opacity(0.5), lineWidth: 1)
                    )
                    .foregroundColor(.white)
            }
            
            // Remember Me Toggle
            HStack {
                Toggle("Remember Me", isOn: $rememberMe)
                    .toggleStyle(SwitchToggleStyle(tint: .cyan))
                    .foregroundColor(.white)
                
                Spacer()
                
                Button("Forgot Password?") {
                    showingForgotPassword = true
                }
                .foregroundColor(.cyan)
                .font(.footnote)
            }
            
            // Sign In Button
            Button {
                Task {
                    await authManager.signIn(email: email, password: password)
                }
            } label: {
                if authManager.isLoading {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle(tint: .white))
                } else {
                    Text("Sign In")
                        .fontWeight(.semibold)
                }
            }
            .frame(maxWidth: .infinity)
            .padding()
            .background(
                LinearGradient(
                    colors: [.cyan, .blue],
                    startPoint: .leading,
                    endPoint: .trailing
                )
            )
            .foregroundColor(.white)
            .cornerRadius(12)
            .disabled(authManager.isLoading || email.isEmpty || password.isEmpty)
            .shadow(color: .cyan.opacity(0.5), radius: 5)
            
            // Sign Up Link
            HStack {
                Text("Don't have an account?")
                    .foregroundColor(.gray)
                
                Button("Sign Up") {
                    showingSignUp = true
                }
                .foregroundColor(.cyan)
                .fontWeight(.semibold)
            }
            .font(.footnote)
        }
    }
    
    private var twoFactorSection: some View {
        VStack(spacing: 20) {
            VStack(spacing: 12) {
                Image(systemName: "shield.checkered")
                    .font(.system(size: 50))
                    .foregroundColor(.cyan)
                
                Text("Two-Factor Authentication")
                    .font(.title2)
                    .fontWeight(.semibold)
                    .foregroundColor(.white)
                
                Text("Enter the verification code sent to your device")
                    .font(.subheadline)
                    .foregroundColor(.gray)
                    .multilineTextAlignment(.center)
            }
            
            // 2FA Code Field
            TextField("Enter 6-digit code", text: $twoFactorCode)
                .keyboardType(.numberPad)
                .multilineTextAlignment(.center)
                .font(.title)
                .padding()
                .background(Color.black.opacity(0.3))
                .cornerRadius(12)
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(Color.cyan.opacity(0.5), lineWidth: 1)
                )
                .foregroundColor(.white)
            
            // Verify Button
            Button {
                Task {
                    await authManager.verifyTwoFactorCode(twoFactorCode)
                }
            } label: {
                if authManager.isLoading {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle(tint: .white))
                } else {
                    Text("Verify")
                        .fontWeight(.semibold)
                }
            }
            .frame(maxWidth: .infinity)
            .padding()
            .background(
                LinearGradient(
                    colors: [.cyan, .blue],
                    startPoint: .leading,
                    endPoint: .trailing
                )
            )
            .foregroundColor(.white)
            .cornerRadius(12)
            .disabled(authManager.isLoading || twoFactorCode.count != 6)
            .shadow(color: .cyan.opacity(0.5), radius: 5)
            
            // Back to Login
            Button("Back to Login") {
                authManager.requiresTwoFactorAuth = false
                twoFactorCode = ""
            }
            .foregroundColor(.gray)
        }
    }
    
    private var biometricSection: some View {
        VStack(spacing: 15) {
            Rectangle()
                .frame(height: 1)
                .foregroundColor(.gray.opacity(0.3))
            
            Text("Or sign in with")
                .foregroundColor(.gray)
                .font(.caption)
            
            Button {
                Task {
                    await authManager.signInWithBiometrics()
                }
            } label: {
                HStack {
                    Image(systemName: "faceid")
                        .font(.title2)
                    
                    Text("Face ID / Touch ID")
                        .fontWeight(.medium)
                }
            }
            .frame(maxWidth: .infinity)
            .padding()
            .background(Color.black.opacity(0.3))
            .foregroundColor(.cyan)
            .cornerRadius(12)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(Color.cyan.opacity(0.3), lineWidth: 1)
            )
        }
        .padding(.horizontal, 30)
    }
}

struct SignUpView: View {
    @EnvironmentObject var authManager: AuthenticationManager
    @Environment(\.dismiss) var dismiss
    
    @State private var firstName = ""
    @State private var lastName = ""
    @State private var email = ""
    @State private var password = ""
    @State private var confirmPassword = ""
    @State private var userType: UserType = .rigger
    @State private var agreeToTerms = false
    
    private var isFormValid: Bool {
        !firstName.isEmpty &&
        !lastName.isEmpty &&
        !email.isEmpty &&
        password.count >= 8 &&
        password == confirmPassword &&
        agreeToTerms
    }
    
    var body: some View {
        NavigationView {
            ZStack {
                LinearGradient(
                    colors: [Color.black, Color(red: 0.1, green: 0.1, blue: 0.2)],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
                .ignoresSafeArea()
                
                ScrollView {
                    VStack(spacing: 25) {
                        // Header
                        VStack(spacing: 10) {
                            Image(systemName: "person.badge.plus.fill")
                                .font(.system(size: 60))
                                .foregroundColor(.cyan)
                            
                            Text("Create Account")
                                .font(.title)
                                .fontWeight(.bold)
                                .foregroundColor(.white)
                        }
                        .padding(.top, 20)
                        
                        VStack(spacing: 20) {
                            // User Type Selection
                            VStack(alignment: .leading, spacing: 8) {
                                Text("Account Type")
                                    .foregroundColor(.cyan)
                                    .font(.headline)
                                
                                Picker("User Type", selection: $userType) {
                                    ForEach(UserType.allCases, id: \.self) { type in
                                        Text(type.displayName).tag(type)
                                    }
                                }
                                .pickerStyle(SegmentedPickerStyle())
                                .background(Color.black.opacity(0.3))
                                .cornerRadius(8)
                            }
                            
                            HStack(spacing: 15) {
                                VStack(alignment: .leading, spacing: 8) {
                                    Text("First Name")
                                        .foregroundColor(.cyan)
                                        .font(.headline)
                                    
                                    TextField("First name", text: $firstName)
                                        .padding()
                                        .background(Color.black.opacity(0.3))
                                        .cornerRadius(12)
                                        .overlay(
                                            RoundedRectangle(cornerRadius: 12)
                                                .stroke(Color.cyan.opacity(0.5), lineWidth: 1)
                                        )
                                        .foregroundColor(.white)
                                }
                                
                                VStack(alignment: .leading, spacing: 8) {
                                    Text("Last Name")
                                        .foregroundColor(.cyan)
                                        .font(.headline)
                                    
                                    TextField("Last name", text: $lastName)
                                        .padding()
                                        .background(Color.black.opacity(0.3))
                                        .cornerRadius(12)
                                        .overlay(
                                            RoundedRectangle(cornerRadius: 12)
                                                .stroke(Color.cyan.opacity(0.5), lineWidth: 1)
                                        )
                                        .foregroundColor(.white)
                                }
                            }
                            
                            VStack(alignment: .leading, spacing: 8) {
                                Text("Email")
                                    .foregroundColor(.cyan)
                                    .font(.headline)
                                
                                TextField("Enter your email", text: $email)
                                    .keyboardType(.emailAddress)
                                    .autocapitalization(.none)
                                    .padding()
                                    .background(Color.black.opacity(0.3))
                                    .cornerRadius(12)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 12)
                                            .stroke(Color.cyan.opacity(0.5), lineWidth: 1)
                                    )
                                    .foregroundColor(.white)
                            }
                            
                            VStack(alignment: .leading, spacing: 8) {
                                Text("Password")
                                    .foregroundColor(.cyan)
                                    .font(.headline)
                                
                                SecureField("Create password", text: $password)
                                    .padding()
                                    .background(Color.black.opacity(0.3))
                                    .cornerRadius(12)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 12)
                                            .stroke(Color.cyan.opacity(0.5), lineWidth: 1)
                                    )
                                    .foregroundColor(.white)
                                
                                Text("Must be at least 8 characters")
                                    .font(.caption)
                                    .foregroundColor(.gray)
                            }
                            
                            VStack(alignment: .leading, spacing: 8) {
                                Text("Confirm Password")
                                    .foregroundColor(.cyan)
                                    .font(.headline)
                                
                                SecureField("Confirm password", text: $confirmPassword)
                                    .padding()
                                    .background(Color.black.opacity(0.3))
                                    .cornerRadius(12)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 12)
                                            .stroke(
                                                password == confirmPassword || confirmPassword.isEmpty ? 
                                                Color.cyan.opacity(0.5) : Color.red.opacity(0.5), 
                                                lineWidth: 1
                                            )
                                    )
                                    .foregroundColor(.white)
                            }
                            
                            // Terms Agreement
                            HStack(alignment: .top, spacing: 10) {
                                Toggle("", isOn: $agreeToTerms)
                                    .toggleStyle(CheckboxToggleStyle())
                                
                                VStack(alignment: .leading, spacing: 5) {
                                    Text("I agree to the Terms of Service and Privacy Policy")
                                        .foregroundColor(.white)
                                        .font(.footnote)
                                    
                                    HStack {
                                        Button("Terms of Service") {
                                            // Open terms
                                        }
                                        .foregroundColor(.cyan)
                                        
                                        Text("and")
                                            .foregroundColor(.gray)
                                        
                                        Button("Privacy Policy") {
                                            // Open privacy policy
                                        }
                                        .foregroundColor(.cyan)
                                    }
                                    .font(.caption)
                                }
                                
                                Spacer()
                            }
                        }
                        .padding(.horizontal, 30)
                        
                        // Sign Up Button
                        Button {
                            Task {
                                await authManager.signUp(
                                    firstName: firstName,
                                    lastName: lastName,
                                    email: email,
                                    password: password,
                                    userType: userType
                                )
                            }
                        } label: {
                            if authManager.isLoading {
                                ProgressView()
                                    .progressViewStyle(CircularProgressViewStyle(tint: .white))
                            } else {
                                Text("Create Account")
                                    .fontWeight(.semibold)
                            }
                        }
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(
                            LinearGradient(
                                colors: isFormValid ? [.cyan, .blue] : [.gray, .gray],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .foregroundColor(.white)
                        .cornerRadius(12)
                        .disabled(!isFormValid || authManager.isLoading)
                        .shadow(color: isFormValid ? .cyan.opacity(0.5) : .clear, radius: 5)
                        .padding(.horizontal, 30)
                        
                        Spacer(minLength: 50)
                    }
                }
            }
            .navigationTitle("")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        dismiss()
                    }
                    .foregroundColor(.cyan)
                }
            }
        }
    }
}

struct ForgotPasswordView: View {
    @EnvironmentObject var authManager: AuthenticationManager
    @Environment(\.dismiss) var dismiss
    
    @State private var email = ""
    @State private var isEmailSent = false
    
    var body: some View {
        NavigationView {
            ZStack {
                LinearGradient(
                    colors: [Color.black, Color(red: 0.1, green: 0.1, blue: 0.2)],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
                .ignoresSafeArea()
                
                VStack(spacing: 30) {
                    VStack(spacing: 20) {
                        Image(systemName: "envelope.circle.fill")
                            .font(.system(size: 60))
                            .foregroundColor(.cyan)
                        
                        Text(isEmailSent ? "Check Your Email" : "Reset Password")
                            .font(.title)
                            .fontWeight(.bold)
                            .foregroundColor(.white)
                        
                        Text(isEmailSent ?
                             "We've sent a password reset link to \(email)" :
                             "Enter your email address and we'll send you a link to reset your password"
                        )
                        .font(.subheadline)
                        .foregroundColor(.gray)
                        .multilineTextAlignment(.center)
                    }
                    .padding(.horizontal)
                    
                    if !isEmailSent {
                        VStack(spacing: 20) {
                            TextField("Enter your email", text: $email)
                                .keyboardType(.emailAddress)
                                .autocapitalization(.none)
                                .padding()
                                .background(Color.black.opacity(0.3))
                                .cornerRadius(12)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 12)
                                        .stroke(Color.cyan.opacity(0.5), lineWidth: 1)
                                )
                                .foregroundColor(.white)
                            
                            Button {
                                Task {
                                    let success = await authManager.forgotPassword(email: email)
                                    if success {
                                        isEmailSent = true
                                    }
                                }
                            } label: {
                                if authManager.isLoading {
                                    ProgressView()
                                        .progressViewStyle(CircularProgressViewStyle(tint: .white))
                                } else {
                                    Text("Send Reset Link")
                                        .fontWeight(.semibold)
                                }
                            }
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(
                                LinearGradient(
                                    colors: [.cyan, .blue],
                                    startPoint: .leading,
                                    endPoint: .trailing
                                )
                            )
                            .foregroundColor(.white)
                            .cornerRadius(12)
                            .disabled(email.isEmpty || authManager.isLoading)
                            .shadow(color: .cyan.opacity(0.5), radius: 5)
                        }
                        .padding(.horizontal, 30)
                    } else {
                        Button("Back to Login") {
                            dismiss()
                        }
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.black.opacity(0.3))
                        .foregroundColor(.cyan)
                        .cornerRadius(12)
                        .overlay(
                            RoundedRectangle(cornerRadius: 12)
                                .stroke(Color.cyan.opacity(0.3), lineWidth: 1)
                        )
                        .padding(.horizontal, 30)
                    }
                    
                    Spacer()
                }
                .padding(.top, 50)
            }
            .navigationTitle("")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        dismiss()
                    }
                    .foregroundColor(.cyan)
                }
            }
        }
    }
}

// Custom Toggle Style for Checkbox
struct CheckboxToggleStyle: ToggleStyle {
    func makeBody(configuration: Configuration) -> some View {
        Button {
            configuration.isOn.toggle()
        } label: {
            HStack {
                Image(systemName: configuration.isOn ? "checkmark.square.fill" : "square")
                    .foregroundColor(configuration.isOn ? .cyan : .gray)
                    .font(.title3)
            }
        }
        .buttonStyle(PlainButtonStyle())
    }
}

#Preview {
    LoginView()
        .environmentObject(AuthenticationManager())
        .preferredColorScheme(.dark)
}
