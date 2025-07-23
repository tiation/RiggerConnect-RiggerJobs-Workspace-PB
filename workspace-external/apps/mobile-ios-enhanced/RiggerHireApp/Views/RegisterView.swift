import SwiftUI

struct RegisterView: View {
    @State private var firstName = ""
    @State private var lastName = ""
    @State private var email = ""
    @State private var phone = ""
    @State private var password = ""
    @State private var confirmPassword = ""
    @State private var experienceLevel: ExperienceLevel = .intermediate
    @State private var hasRiggingLicense = false
    @State private var acceptedTerms = false
    @State private var isLoading = false
    @State private var showingAlert = false
    @State private var alertMessage = ""
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationStack {
            ZStack {
                // Dark background
                Color.black.ignoresSafeArea()
                
                ScrollView {
                    VStack(spacing: 24) {
                        // Header
                        VStack(spacing: 16) {
                            // Logo
                            ZStack {
                                Circle()
                                    .fill(
                                        RadialGradient(
                                            colors: [.cyan.opacity(0.3), .black],
                                            center: .center,
                                            startRadius: 20,
                                            endRadius: 50
                                        )
                                    )
                                    .frame(width: 80, height: 80)
                                
                                Image(systemName: "person.crop.circle.badge.plus")
                                    .font(.system(size: 35, weight: .bold))
                                    .foregroundStyle(
                                        LinearGradient(
                                            colors: [.cyan, .magenta],
                                            startPoint: .topLeading,
                                            endPoint: .bottomTrailing
                                        )
                                    )
                            }
                            
                            VStack(spacing: 8) {
                                Text("Create Account")
                                    .font(.system(size: 28, weight: .bold, design: .rounded))
                                    .foregroundStyle(
                                        LinearGradient(
                                            colors: [.cyan, .white],
                                            startPoint: .leading,
                                            endPoint: .trailing
                                        )
                                    )
                                
                                Text("Join the rigger community")
                                    .font(.system(size: 16, weight: .medium))
                                    .foregroundColor(.gray)
                            }
                        }
                        .padding(.top, 20)
                        
                        // Registration Form
                        VStack(spacing: 20) {
                            // Personal Information
                            VStack(spacing: 16) {
                                HStack(spacing: 12) {
                                    CustomTextField(
                                        placeholder: "First Name",
                                        text: $firstName,
                                        icon: "person.fill"
                                    )
                                    
                                    CustomTextField(
                                        placeholder: "Last Name",
                                        text: $lastName,
                                        icon: "person.fill"
                                    )
                                }
                                
                                CustomTextField(
                                    placeholder: "Email Address",
                                    text: $email,
                                    icon: "envelope.fill",
                                    keyboardType: .emailAddress
                                )
                                
                                CustomTextField(
                                    placeholder: "Phone Number",
                                    text: $phone,
                                    icon: "phone.fill",
                                    keyboardType: .phonePad
                                )
                            }
                            
                            // Password Section
                            VStack(spacing: 16) {
                                CustomTextField(
                                    placeholder: "Password",
                                    text: $password,
                                    icon: "lock.fill",
                                    isSecure: true
                                )
                                
                                CustomTextField(
                                    placeholder: "Confirm Password",
                                    text: $confirmPassword,
                                    icon: "lock.fill",
                                    isSecure: true
                                )
                                
                                // Password strength indicator
                                if !password.isEmpty {
                                    PasswordStrengthView(password: password)
                                }
                            }
                            
                            // Professional Information
                            VStack(spacing: 16) {
                                // Experience Level
                                VStack(alignment: .leading, spacing: 8) {
                                    Text("Experience Level")
                                        .font(.system(size: 16, weight: .semibold))
                                        .foregroundColor(.cyan)
                                    
                                    Picker("Experience Level", selection: $experienceLevel) {
                                        ForEach(ExperienceLevel.allCases, id: \.self) { level in
                                            Text(level.displayName).tag(level)
                                        }
                                    }
                                    .pickerStyle(SegmentedPickerStyle())
                                    .background(Color.black.opacity(0.3))
                                    .cornerRadius(12)
                                }
                                
                                // Rigging License
                                HStack {
                                    Image(systemName: hasRiggingLicense ? "checkmark.square.fill" : "square")
                                        .font(.system(size: 20))
                                        .foregroundColor(hasRiggingLicense ? .cyan : .gray)
                                        .onTapGesture {
                                            hasRiggingLicense.toggle()
                                        }
                                    
                                    Text("I have a valid rigging license")
                                        .font(.system(size: 16, weight: .medium))
                                        .foregroundColor(.white)
                                    
                                    Spacer()
                                }
                                .padding(.horizontal, 4)
                            }
                            
                            // Terms and Conditions
                            HStack {
                                Image(systemName: acceptedTerms ? "checkmark.square.fill" : "square")
                                    .font(.system(size: 20))
                                    .foregroundColor(acceptedTerms ? .cyan : .gray)
                                    .onTapGesture {
                                        acceptedTerms.toggle()
                                    }
                                
                                Text("I agree to the ")
                                    .font(.system(size: 14))
                                    .foregroundColor(.gray)
                                +
                                Text("Terms of Service")
                                    .font(.system(size: 14, weight: .semibold))
                                    .foregroundColor(.cyan)
                                +
                                Text(" and ")
                                    .font(.system(size: 14))
                                    .foregroundColor(.gray)
                                +
                                Text("Privacy Policy")
                                    .font(.system(size: 14, weight: .semibold))
                                    .foregroundColor(.cyan)
                                
                                Spacer()
                            }
                            .padding(.horizontal, 4)
                        }
                        .padding(.horizontal, 24)
                        
                        // Register Button
                        Button {
                            registerUser()
                        } label: {
                            HStack {
                                if isLoading {
                                    ProgressView()
                                        .progressViewStyle(CircularProgressViewStyle(tint: .white))
                                        .scaleEffect(0.8)
                                } else {
                                    Text("Create Account")
                                        .font(.system(size: 18, weight: .bold))
                                    Image(systemName: "arrow.right.circle.fill")
                                        .font(.system(size: 18))
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
                            .shadow(color: isFormValid ? .cyan.opacity(0.3) : .clear, radius: 10)
                        }
                        .disabled(!isFormValid || isLoading)
                        .padding(.horizontal, 24)
                        
                        // Sign In Link
                        HStack {
                            Text("Already have an account?")
                                .font(.system(size: 16))
                                .foregroundColor(.gray)
                            
                            Button("Sign In") {
                                dismiss()
                            }
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(.cyan)
                        }
                        .padding(.bottom, 30)
                    }
                }
            }
            .navigationBarHidden(true)
        }
        .alert("Registration", isPresented: $showingAlert) {
            Button("OK") { }
        } message: {
            Text(alertMessage)
        }
        .preferredColorScheme(.dark)
    }
    
    private var isFormValid: Bool {
        !firstName.isEmpty &&
        !lastName.isEmpty &&
        !email.isEmpty &&
        !phone.isEmpty &&
        !password.isEmpty &&
        password == confirmPassword &&
        acceptedTerms &&
        isValidEmail(email) &&
        password.count >= 8
    }
    
    private func isValidEmail(_ email: String) -> Bool {
        let emailRegex = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}"
        let emailPredicate = NSPredicate(format:"SELF MATCHES %@", emailRegex)
        return emailPredicate.evaluate(with: email)
    }
    
    private func registerUser() {
        isLoading = true
        
        // Simulate registration process
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
            isLoading = false
            alertMessage = "Account created successfully! Please check your email to verify your account."
            showingAlert = true
            
            // Auto-dismiss after successful registration
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
                dismiss()
            }
        }
    }
}

struct CustomTextField: View {
    let placeholder: String
    @Binding var text: String
    let icon: String
    var isSecure: Bool = false
    var keyboardType: UIKeyboardType = .default
    
    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .font(.system(size: 16, weight: .medium))
                .foregroundColor(.cyan)
                .frame(width: 20)
            
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
        .padding(.horizontal, 16)
        .padding(.vertical, 16)
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(Color.black.opacity(0.3))
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(Color.cyan.opacity(0.3), lineWidth: 1)
                )
        )
    }
}

struct PasswordStrengthView: View {
    let password: String
    
    var strength: Int {
        var score = 0
        if password.count >= 8 { score += 1 }
        if password.range(of: "[A-Z]", options: .regularExpression) != nil { score += 1 }
        if password.range(of: "[0-9]", options: .regularExpression) != nil { score += 1 }
        if password.range(of: "[^A-Za-z0-9]", options: .regularExpression) != nil { score += 1 }
        return score
    }
    
    var strengthText: String {
        switch strength {
        case 0...1: return "Weak"
        case 2: return "Fair"
        case 3: return "Good"
        case 4: return "Strong"
        default: return "Weak"
        }
    }
    
    var strengthColor: Color {
        switch strength {
        case 0...1: return .red
        case 2: return .orange
        case 3: return .yellow
        case 4: return .green
        default: return .red
        }
    }
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text("Password Strength: ")
                    .font(.system(size: 12))
                    .foregroundColor(.gray)
                
                Text(strengthText)
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundColor(strengthColor)
                
                Spacer()
            }
            
            HStack(spacing: 4) {
                ForEach(0..<4) { index in
                    Rectangle()
                        .fill(index < strength ? strengthColor : Color.gray.opacity(0.3))
                        .frame(height: 4)
                        .cornerRadius(2)
                }
            }
        }
        .padding(.horizontal, 4)
    }
}

#Preview {
    RegisterView()
        .preferredColorScheme(.dark)
}
