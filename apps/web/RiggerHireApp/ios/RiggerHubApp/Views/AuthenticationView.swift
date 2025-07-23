import SwiftUI

struct AuthenticationView: View {
    @EnvironmentObject var authManager: AuthenticationManager
    @EnvironmentObject var themeManager: ThemeManager
    
    @State private var isSignUp = false
    @State private var email = ""
    @State private var password = ""
    @State private var confirmPassword = ""
    @State private var firstName = ""
    @State private var lastName = ""
    @State private var showForgotPassword = false
    
    var body: some View {
        ZStack {
            // Background gradient
            themeManager.backgroundGradient
                .ignoresSafeArea()
            
            ScrollView {
                VStack(spacing: 30) {
                    // Logo and title
                    VStack(spacing: 20) {
                        Image(systemName: "wrench.and.screwdriver")
                            .font(.system(size: 80))
                            .foregroundStyle(themeManager.primaryGradient)
                        
                        VStack(spacing: 8) {
                            Text("RiggerHub")
                                .font(.largeTitle)
                                .fontWeight(.bold)
                                .foregroundColor(themeManager.primaryTextColor)
                            
                            Text("Find Your Next Rigging Job")
                                .font(.headline)
                                .foregroundColor(themeManager.secondaryTextColor)
                        }
                    }
                    .padding(.top, 40)
                    
                    // Authentication form
                    VStack(spacing: 20) {
                        if isSignUp {
                            signUpForm
                        } else {
                            signInForm
                        }
                    }
                    .cardStyle(themeManager)
                    .padding(.horizontal, 20)
                    
                    // Toggle between sign in and sign up
                    HStack {
                        Text(isSignUp ? "Already have an account?" : "Don't have an account?")
                            .foregroundColor(themeManager.secondaryTextColor)
                        
                        Button(isSignUp ? "Sign In" : "Sign Up") {
                            withAnimation(.easeInOut(duration: 0.3)) {
                                isSignUp.toggle()
                                clearFields()
                            }
                        }
                        .foregroundColor(themeManager.accentColor)
                        .fontWeight(.semibold)
                    }
                    .padding(.bottom, 20)
                }
            }
        }
        .alert("Error", isPresented: .constant(authManager.errorMessage != nil)) {
            Button("OK") {
                authManager.errorMessage = nil
            }
        } message: {
            Text(authManager.errorMessage ?? "")
        }
        .sheet(isPresented: $showForgotPassword) {
            ForgotPasswordView()
        }
    }
    
    private var signInForm: some View {
        VStack(spacing: 16) {
            Text("Welcome Back")
                .font(.title2)
                .fontWeight(.bold)
                .foregroundColor(themeManager.primaryTextColor)
                .padding(.bottom, 10)
            
            // Email field
            CustomTextField(
                title: "Email",
                text: $email,
                icon: "envelope",
                keyboardType: .emailAddress
            )
            
            // Password field
            CustomSecureField(
                title: "Password",
                text: $password,
                icon: "lock"
            )
            
            // Forgot password
            HStack {
                Spacer()
                Button("Forgot Password?") {
                    showForgotPassword = true
                }
                .foregroundColor(themeManager.accentColor)
                .font(.caption)
            }
            
            // Sign in button
            Button(action: signIn) {
                HStack {
                    if authManager.isLoading {
                        ProgressView()
                            .progressViewStyle(CircularProgressViewStyle(tint: .white))
                            .scaleEffect(0.8)
                    }
                    Text("Sign In")
                        .fontWeight(.semibold)
                }
                .frame(maxWidth: .infinity)
            }
            .neonButtonStyle(themeManager)
            .disabled(authManager.isLoading || !isValidSignIn)
        }
    }
    
    private var signUpForm: some View {
        VStack(spacing: 16) {
            Text("Create Account")
                .font(.title2)
                .fontWeight(.bold)
                .foregroundColor(themeManager.primaryTextColor)
                .padding(.bottom, 10)
            
            HStack(spacing: 12) {
                CustomTextField(
                    title: "First Name",
                    text: $firstName,
                    icon: "person"
                )
                
                CustomTextField(
                    title: "Last Name",
                    text: $lastName,
                    icon: "person"
                )
            }
            
            CustomTextField(
                title: "Email",
                text: $email,
                icon: "envelope",
                keyboardType: .emailAddress
            )
            
            CustomSecureField(
                title: "Password",
                text: $password,
                icon: "lock"
            )
            
            CustomSecureField(
                title: "Confirm Password",
                text: $confirmPassword,
                icon: "lock"
            )
            
            // Password strength indicator
            if !password.isEmpty {
                PasswordStrengthView(password: password)
            }
            
            Button(action: signUp) {
                HStack {
                    if authManager.isLoading {
                        ProgressView()
                            .progressViewStyle(CircularProgressViewStyle(tint: .white))
                            .scaleEffect(0.8)
                    }
                    Text("Create Account")
                        .fontWeight(.semibold)
                }
                .frame(maxWidth: .infinity)
            }
            .neonButtonStyle(themeManager)
            .disabled(authManager.isLoading || !isValidSignUp)
        }
    }
    
    private var isValidSignIn: Bool {
        authManager.isValidEmail(email) && authManager.isValidPassword(password)
    }
    
    private var isValidSignUp: Bool {
        !firstName.isEmpty &&
        !lastName.isEmpty &&
        authManager.isValidEmail(email) &&
        authManager.isValidPassword(password) &&
        password == confirmPassword
    }
    
    private func signIn() {
        authManager.signIn(email: email, password: password)
    }
    
    private func signUp() {
        authManager.signUp(
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName
        )
    }
    
    private func clearFields() {
        email = ""
        password = ""
        confirmPassword = ""
        firstName = ""
        lastName = ""
    }
}

struct CustomTextField: View {
    let title: String
    @Binding var text: String
    let icon: String
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
                
                TextField("", text: $text)
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

struct PasswordStrengthView: View {
    let password: String
    @EnvironmentObject var authManager: AuthenticationManager
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        let strength = authManager.passwordStrength(password)
        
        VStack(alignment: .leading, spacing: 4) {
            HStack {
                Text("Password Strength:")
                    .font(.caption)
                    .foregroundColor(themeManager.secondaryTextColor)
                
                Text(strength.text)
                    .font(.caption)
                    .fontWeight(.semibold)
                    .foregroundColor(colorForStrength(strength))
            }
            
            ProgressView(value: strengthValue(strength), total: 1.0)
                .progressViewStyle(LinearProgressViewStyle(tint: colorForStrength(strength)))
        }
    }
    
    private func colorForStrength(_ strength: PasswordStrength) -> Color {
        switch strength {
        case .weak: return themeManager.errorColor
        case .fair: return themeManager.warningColor
        case .good: return Color.yellow
        case .strong: return themeManager.successColor
        }
    }
    
    private func strengthValue(_ strength: PasswordStrength) -> Double {
        switch strength {
        case .weak: return 0.25
        case .fair: return 0.5
        case .good: return 0.75
        case .strong: return 1.0
        }
    }
}

struct ForgotPasswordView: View {
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var authManager: AuthenticationManager
    @EnvironmentObject var themeManager: ThemeManager
    
    @State private var email = ""
    @State private var showSuccess = false
    
    var body: some View {
        NavigationView {
            ZStack {
                themeManager.backgroundGradient.ignoresSafeArea()
                
                VStack(spacing: 30) {
                    VStack(spacing: 16) {
                        Image(systemName: "envelope.arrow.triangle.branch")
                            .font(.system(size: 60))
                            .foregroundStyle(themeManager.primaryGradient)
                        
                        Text("Reset Password")
                            .font(.title2)
                            .fontWeight(.bold)
                            .foregroundColor(themeManager.primaryTextColor)
                        
                        Text("Enter your email address and we'll send you instructions to reset your password.")
                            .font(.body)
                            .foregroundColor(themeManager.secondaryTextColor)
                            .multilineTextAlignment(.center)
                    }
                    
                    CustomTextField(
                        title: "Email",
                        text: $email,
                        icon: "envelope",
                        keyboardType: .emailAddress
                    )
                    
                    Button("Send Reset Instructions") {
                        authManager.resetPassword(email: email)
                        showSuccess = true
                    }
                    .neonButtonStyle(themeManager)
                    .disabled(authManager.isLoading || !authManager.isValidEmail(email))
                    
                    Spacer()
                }
                .padding(20)
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        dismiss()
                    }
                    .foregroundColor(themeManager.accentColor)
                }
            }
        }
        .alert("Reset Email Sent", isPresented: $showSuccess) {
            Button("OK") {
                dismiss()
            }
        } message: {
            Text("If an account exists with this email, you'll receive password reset instructions shortly.")
        }
    }
}

struct AuthenticationView_Previews: PreviewProvider {
    static var previews: some View {
        AuthenticationView()
            .environmentObject(AuthenticationManager())
            .environmentObject(ThemeManager())
    }
}
