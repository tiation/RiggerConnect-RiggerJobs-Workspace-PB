import SwiftUI

struct LoginView: View {
    @EnvironmentObject var authManager: AuthenticationManager
    @State private var email = ""
    @State private var password = ""
    @State private var isLoading = false
    @State private var showError = false
    @State private var errorMessage = ""
    @State private var showRegistration = false
    
    var body: some View {
        NavigationStack {
            VStack(spacing: 20) {
                // Logo and Title
                VStack(spacing: 10) {
                    Image(systemName: "crane.fill")
                        .font(.system(size: 80))
                        .foregroundColor(.orange)
                    
                    Text("RiggerConnect")
                        .font(.largeTitle)
                        .fontWeight(.bold)
                    
                    Text("Pilbara's Premier Rigging Solution")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
                .padding(.top, 50)
                
                Spacer()
                
                // Login Form
                VStack(spacing: 15) {
                    TextField("Email", text: $email)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .textInputAutocapitalization(.never)
                        .keyboardType(.emailAddress)
                    
                    SecureField("Password", text: $password)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                    
                    Button(action: login) {
                        if isLoading {
                            ProgressView()
                                .progressViewStyle(CircularProgressViewStyle(tint: .white))
                                .frame(maxWidth: .infinity)
                        } else {
                            Text("Login")
                                .fontWeight(.semibold)
                                .frame(maxWidth: .infinity)
                        }
                    }
                    .buttonStyle(.borderedProminent)
                    .tint(.orange)
                    .controlSize(.large)
                    .disabled(isLoading || email.isEmpty || password.isEmpty)
                }
                .padding(.horizontal)
                
                // Register Link
                HStack {
                    Text("Don't have an account?")
                        .foregroundColor(.secondary)
                    Button("Register") {
                        showRegistration = true
                    }
                    .foregroundColor(.orange)
                }
                .padding(.top)
                
                Spacer()
                
                // Demo Credentials
                VStack(spacing: 5) {
                    Text("Demo Credentials")
                        .font(.caption)
                        .foregroundColor(.secondary)
                    Text("Email: rigger@demo.com")
                        .font(.caption2)
                        .foregroundColor(.secondary)
                    Text("Password: demo123")
                        .font(.caption2)
                        .foregroundColor(.secondary)
                }
                .padding(.bottom)
            }
            .navigationDestination(isPresented: $showRegistration) {
                RegistrationView()
            }
            .alert("Login Error", isPresented: $showError) {
                Button("OK") { }
            } message: {
                Text(errorMessage)
            }
        }
    }
    
    private func login() {
        isLoading = true
        
        Task {
            do {
                try await authManager.login(email: email, password: password)
            } catch {
                errorMessage = error.localizedDescription
                showError = true
            }
            
            await MainActor.run {
                isLoading = false
            }
        }
    }
}
