import SwiftUI

struct PasswordResetView: View {
    @State private var newPassword = ""
    @State private var confirmPassword = ""
    @State private var isLoading = false
    @State private var showSuccessAlert = false
    @State private var showErrorAlert = false
    @State private var errorMessage = ""
    @State private var showNewPassword = false
    @State private var showConfirmPassword = false
    
    var body: some View {
        ZStack {
            // Dark background with neon gradient
            LinearGradient(
                colors: [Color.black, Color(red: 0.1, green: 0.1, blue: 0.2)],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()
            
            VStack(spacing: 30) {
                // Header
                VStack(spacing: 10) {
                    Image(systemName: "key.fill")
                        .font(.system(size: 60))
                        .foregroundStyle(
                            LinearGradient(
                                colors: [.cyan, .purple],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                    
                    Text("Reset Password")
                        .font(.title)
                        .fontWeight(.bold)
                        .foregroundColor(.white)
                    
                    Text("Create a new secure password for your account")
                        .font(.body)
                        .foregroundColor(.gray)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 20)
                }
                
                // Password Inputs
                VStack(spacing: 20) {
                    // New Password
                    VStack(alignment: .leading, spacing: 8) {
                        Text("New Password")
                            .font(.headline)
                            .foregroundColor(.white)
                        
                        HStack {
                            if showNewPassword {
                                TextField("Enter new password", text: $newPassword)
                            } else {
                                SecureField("Enter new password", text: $newPassword)
                            }
                            
                            Button(action: {
                                showNewPassword.toggle()
                            }) {
                                Image(systemName: showNewPassword ? "eye.slash.fill" : "eye.fill")
                                    .foregroundColor(.cyan)
                            }
                        }
                        .font(.body)
                        .foregroundColor(.white)
                        .padding(.horizontal, 16)
                        .padding(.vertical, 12)
                        .background(Color.white.opacity(0.05))
                        .cornerRadius(12)
                        .overlay(
                            RoundedRectangle(cornerRadius: 12)
                                .stroke(Color.cyan.opacity(0.3), lineWidth: 1)
                        )
                    }
                    
                    // Confirm Password
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Confirm Password")
                            .font(.headline)
                            .foregroundColor(.white)
                        
                        HStack {
                            if showConfirmPassword {
                                TextField("Confirm new password", text: $confirmPassword)
                            } else {
                                SecureField("Confirm new password", text: $confirmPassword)
                            }
                            
                            Button(action: {
                                showConfirmPassword.toggle()
                            }) {
                                Image(systemName: showConfirmPassword ? "eye.slash.fill" : "eye.fill")
                                    .foregroundColor(.cyan)
                            }
                        }
                        .font(.body)
                        .foregroundColor(.white)
                        .padding(.horizontal, 16)
                        .padding(.vertical, 12)
                        .background(Color.white.opacity(0.05))
                        .cornerRadius(12)
                        .overlay(
                            RoundedRectangle(cornerRadius: 12)
                                .stroke(
                                    passwordsMatch() ? Color.cyan.opacity(0.3) : Color.red.opacity(0.5),
                                    lineWidth: 1
                                )
                        )
                    }
                }
                .padding(.horizontal, 20)
                
                // Password Requirements
                PasswordRequirementsView(password: newPassword)
                
                Spacer()
                
                // Reset Button
                Button(action: {
                    resetPassword()
                }) {
                    HStack {
                        if isLoading {
                            ProgressView()
                                .scaleEffect(0.8)
                                .foregroundColor(.black)
                        }
                        Text("Reset Password")
                            .font(.headline)
                            .foregroundColor(.black)
                    }
                    .frame(maxWidth: .infinity)
                    .frame(height: 50)
                    .background(
                        isFormValid() ?
                        LinearGradient(
                            colors: [.cyan, .purple],
                            startPoint: .leading,
                            endPoint: .trailing
                        ) :
                        Color.gray.opacity(0.5)
                    )
                    .cornerRadius(25)
                    .shadow(color: .cyan.opacity(0.3), radius: 10, x: 0, y: 5)
                }
                .disabled(!isFormValid() || isLoading)
                .padding(.horizontal, 20)
            }
            .padding(.vertical, 40)
        }
        .alert("Success", isPresented: $showSuccessAlert) {
            Button("OK") { }
        } message: {
            Text("Your password has been reset successfully")
        }
        .alert("Error", isPresented: $showErrorAlert) {
            Button("OK") { }
        } message: {
            Text(errorMessage)
        }
    }
    
    private func passwordsMatch() -> Bool {
        return newPassword == confirmPassword
    }
    
    private func isFormValid() -> Bool {
        return !newPassword.isEmpty &&
               !confirmPassword.isEmpty &&
               passwordsMatch() &&
               newPassword.count >= 8
    }
    
    private func resetPassword() {
        guard isFormValid() else {
            errorMessage = "Please ensure all fields are valid"
            showErrorAlert = true
            return
        }
        
        isLoading = true
        
        // Simulate API call
        DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
            isLoading = false
            showSuccessAlert = true
        }
    }
}

struct PasswordRequirementsView: View {
    let password: String
    
    private var requirements: [(String, Bool)] {
        [
            ("At least 8 characters", password.count >= 8),
            ("Contains uppercase letter", password.rangeOfCharacter(from: .uppercaseLetters) != nil),
            ("Contains lowercase letter", password.rangeOfCharacter(from: .lowercaseLetters) != nil),
            ("Contains number", password.rangeOfCharacter(from: .decimalDigits) != nil)
        ]
    }
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Password Requirements:")
                .font(.caption)
                .foregroundColor(.gray)
                .padding(.horizontal, 20)
            
            ForEach(Array(requirements.enumerated()), id: \.offset) { index, requirement in
                HStack(spacing: 8) {
                    Image(systemName: requirement.1 ? "checkmark.circle.fill" : "circle")
                        .foregroundColor(requirement.1 ? .green : .gray)
                        .font(.caption)
                    
                    Text(requirement.0)
                        .font(.caption)
                        .foregroundColor(requirement.1 ? .green : .gray)
                }
                .padding(.horizontal, 20)
            }
        }
    }
}

#Preview {
    PasswordResetView()
}
