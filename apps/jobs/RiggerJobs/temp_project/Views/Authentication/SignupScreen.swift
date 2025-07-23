import SwiftUI

struct SignupScreen: View {
    @EnvironmentObject var authManager: AuthenticationManager
    @Environment(\.dismiss) private var dismiss
    
    @State private var email = ""
    @State private var password = ""
    @State private var confirmPassword = ""
    @State private var companyName = ""
    @State private var selectedBusinessType: BusinessType = .construction
    
    var body: some View {
        NavigationView {
            ZStack {
                Color.black.ignoresSafeArea()
                
                ScrollView {
                    VStack(spacing: 24) {
                        // Header
                        VStack(spacing: 12) {
                            Text("Create Account")
                                .font(.largeTitle)
                                .fontWeight(.bold)
                                .foregroundColor(.white)
                            
                            Text("Join the RiggerJobs employer network")
                                .font(.callout)
                                .foregroundColor(.gray)
                                .multilineTextAlignment(.center)
                        }
                        .padding(.top, 20)
                        
                        // Signup Form
                        VStack(spacing: 20) {
                            // Company Name
                            VStack(alignment: .leading, spacing: 8) {
                                Text("Company Name")
                                    .font(.headline)
                                    .foregroundColor(.white)
                                
                                TextField("Enter company name", text: $companyName)
                                    .textFieldStyle(NeonTextFieldStyle())
                            }
                            
                            // Business Type
                            VStack(alignment: .leading, spacing: 8) {
                                Text("Industry")
                                    .font(.headline)
                                    .foregroundColor(.white)
                                
                                Picker("Business Type", selection: $selectedBusinessType) {
                                    ForEach(BusinessType.allCases, id: \.self) { type in
                                        Text(type.displayName).tag(type)
                                    }
                                }
                                .pickerStyle(MenuPickerStyle())
                                .accentColor(.cyan)
                            }
                            
                            // Email
                            VStack(alignment: .leading, spacing: 8) {
                                Text("Email Address")
                                    .font(.headline)
                                    .foregroundColor(.white)
                                
                                TextField("Enter company email", text: $email)
                                    .textFieldStyle(NeonTextFieldStyle())
                                    .keyboardType(.emailAddress)
                                    .textContentType(.emailAddress)
                                    .autocapitalization(.none)
                            }
                            
                            // Password
                            VStack(alignment: .leading, spacing: 8) {
                                Text("Password")
                                    .font(.headline)
                                    .foregroundColor(.white)
                                
                                SecureField("Create password", text: $password)
                                    .textFieldStyle(NeonTextFieldStyle())
                                    .textContentType(.newPassword)
                            }
                            
                            // Confirm Password
                            VStack(alignment: .leading, spacing: 8) {
                                Text("Confirm Password")
                                    .font(.headline)
                                    .foregroundColor(.white)
                                
                                SecureField("Confirm password", text: $confirmPassword)
                                    .textFieldStyle(NeonTextFieldStyle())
                                    .textContentType(.newPassword)
                            }
                            
                            // Sign Up Button
                            Button(action: signupAction) {
                                HStack {
                                    if authManager.isLoading {
                                        ProgressView()
                                            .progressViewStyle(CircularProgressViewStyle(tint: .black))
                                            .scaleEffect(0.8)
                                    } else {
                                        Image(systemName: "person.badge.plus")
                                    }
                                    Text("Create Account")
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
                            .disabled(authManager.isLoading || !isFormValid)
                            
                            // Error Message
                            if let errorMessage = authManager.errorMessage {
                                Text(errorMessage)
                                    .font(.callout)
                                    .foregroundColor(.red)
                                    .multilineTextAlignment(.center)
                            }
                        }
                        .padding(.horizontal)
                    }
                }
            }
            .navigationTitle("Sign Up")
            .navigationBarTitleDisplayMode(.inline)
            .navigationBarItems(
                leading: Button("Cancel") {
                    dismiss()
                }
                .foregroundColor(.cyan)
            )
        }
    }
    
    private var isFormValid: Bool {
        !email.isEmpty &&
        !password.isEmpty &&
        !confirmPassword.isEmpty &&
        !companyName.isEmpty &&
        password == confirmPassword &&
        password.count >= 6
    }
    
    private func signupAction() {
        Task {
            await authManager.register(
                email: email,
                password: password,
                companyName: companyName,
                businessType: selectedBusinessType
            )
            
            if authManager.isAuthenticated {
                dismiss()
            }
        }
    }
}

#Preview {
    SignupScreen()
        .environmentObject(AuthenticationManager())
        .preferredColorScheme(.dark)
}
