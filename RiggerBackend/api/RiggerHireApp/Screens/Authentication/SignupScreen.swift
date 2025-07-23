import SwiftUI

struct SignupScreen: View {
    @State private var firstName = ""
    @State private var lastName = ""
    @State private var email = ""
    @State private var password = ""
    @State private var confirmPassword = ""
    @State private var phoneNumber = ""
    @State private var agreeToTerms = false
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
                
                ScrollView {
                    VStack(spacing: 25) {
                        // Header
                        VStack(spacing: 15) {
                            Image(systemName: "person.badge.plus.fill")
                                .font(.system(size: 60))
                                .foregroundStyle(
                                    LinearGradient(
                                        colors: [Color.cyan, Color.magenta],
                                        startPoint: .topLeading,
                                        endPoint: .bottomTrailing
                                    )
                                )
                            
                            Text("Join RiggerHire")
                                .font(.title)
                                .fontWeight(.bold)
                                .foregroundColor(.white)
                            
                            Text("Connect with industry professionals")
                                .font(.subheadline)
                                .foregroundColor(.gray)
                                .multilineTextAlignment(.center)
                        }
                        .padding(.top, 40)
                        
                        // Signup Form
                        VStack(spacing: 20) {
                            // Name Fields
                            HStack(spacing: 12) {
                                VStack(alignment: .leading, spacing: 8) {
                                    Text("First Name")
                                        .foregroundColor(.white)
                                        .font(.caption)
                                        .fontWeight(.medium)
                                    TextField("First name", text: $firstName)
                                        .textFieldStyle(NeonTextFieldStyle())
                                }
                                
                                VStack(alignment: .leading, spacing: 8) {
                                    Text("Last Name")
                                        .foregroundColor(.white)
                                        .font(.caption)
                                        .fontWeight(.medium)
                                    TextField("Last name", text: $lastName)
                                        .textFieldStyle(NeonTextFieldStyle())
                                }
                            }
                            
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
                            
                            // Phone Field
                            VStack(alignment: .leading, spacing: 8) {
                                Text("Phone Number")
                                    .foregroundColor(.white)
                                    .font(.caption)
                                    .fontWeight(.medium)
                                TextField("+61 400 000 000", text: $phoneNumber)
                                    .textFieldStyle(NeonTextFieldStyle())
                                    .keyboardType(.phonePad)
                            }
                            
                            // Password Fields
                            VStack(alignment: .leading, spacing: 8) {
                                Text("Password")
                                    .foregroundColor(.white)
                                    .font(.caption)
                                    .fontWeight(.medium)
                                SecureField("Create password", text: $password)
                                    .textFieldStyle(NeonTextFieldStyle())
                            }
                            
                            VStack(alignment: .leading, spacing: 8) {
                                Text("Confirm Password")
                                    .foregroundColor(.white)
                                    .font(.caption)
                                    .fontWeight(.medium)
                                SecureField("Confirm password", text: $confirmPassword)
                                    .textFieldStyle(NeonTextFieldStyle())
                            }
                            
                            // Terms Checkbox
                            HStack {
                                Button(action: { agreeToTerms.toggle() }) {
                                    Image(systemName: agreeToTerms ? "checkmark.square.fill" : "square")
                                        .foregroundColor(agreeToTerms ? .cyan : .gray)
                                        .font(.title2)
                                }
                                
                                VStack(alignment: .leading, spacing: 2) {
                                    Text("I agree to the Terms of Service")
                                        .foregroundColor(.white)
                                        .font(.caption)
                                    Text("and Privacy Policy")
                                        .foregroundColor(.gray)
                                        .font(.caption2)
                                }
                                Spacer()
                            }
                            
                            // Sign Up Button
                            Button(action: signUpAction) {
                                HStack {
                                    if isLoading {
                                        ProgressView()
                                            .scaleEffect(0.8)
                                            .tint(.white)
                                    }
                                    Text(isLoading ? "Creating Account..." : "Create Account")
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
                            .disabled(!isFormValid || isLoading)
                            .opacity(!isFormValid ? 0.6 : 1.0)
                        }
                        .padding(.horizontal, 30)
                        
                        // Sign In Link
                        HStack {
                            Text("Already have an account?")
                                .foregroundColor(.gray)
                            Button("Sign In") {
                                // Navigate to login
                            }
                            .foregroundColor(.cyan)
                            .fontWeight(.medium)
                        }
                        .font(.subheadline)
                        .padding(.bottom, 30)
                    }
                }
            }
        }
        .alert("Signup Error", isPresented: $showError) {
            Button("OK") { }
        } message: {
            Text(errorMessage)
        }
    }
    
    private var isFormValid: Bool {
        !firstName.isEmpty &&
        !lastName.isEmpty &&
        !email.isEmpty &&
        !phoneNumber.isEmpty &&
        !password.isEmpty &&
        password == confirmPassword &&
        agreeToTerms
    }
    
    private func signUpAction() {
        guard isFormValid else { return }
        
        isLoading = true
        // Implement signup logic
        DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
            isLoading = false
            // Handle success/error
        }
    }
}

#Preview {
    SignupScreen()
}
