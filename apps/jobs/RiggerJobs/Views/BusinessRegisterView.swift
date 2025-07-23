import SwiftUI

struct BusinessRegisterView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var companyName = ""
    @State private var businessEmail = ""
    @State private var password = ""
    @State private var confirmPassword = ""
    @State private var companySize = "1-10"
    @State private var industry = ""
    @State private var firstName = ""
    @State private var lastName = ""
    @State private var jobTitle = ""
    @State private var phoneNumber = ""
    @State private var agreedToTerms = false
    @State private var agreedToMarketing = false
    @State private var isLoading = false
    @State private var showingAlert = false
    @State private var alertMessage = ""
    @State private var currentStep = 0
    
    let companySizes = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"]
    let industries = [
        "Construction", "Oil & Gas", "Manufacturing", "Entertainment",
        "Telecommunications", "Transportation", "Mining", "Agriculture",
        "Marine", "Events", "Other"
    ]
    
    var body: some View {
        NavigationView {
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
                        // Header
                        VStack(spacing: 16) {
                            HStack {
                                Button("Cancel") {
                                    dismiss()
                                }
                                .font(.system(size: 16, weight: .medium))
                                .foregroundColor(.gray)
                                
                                Spacer()
                                
                                Text("Create Business Account")
                                    .font(.system(size: 20, weight: .bold))
                                    .foregroundColor(.white)
                                
                                Spacer()
                                
                                Text("Cancel")
                                    .font(.system(size: 16, weight: .medium))
                                    .foregroundColor(.clear)
                            }
                            .padding(.horizontal, 24)
                            
                            // Progress Indicator
                            ProgressIndicator(currentStep: currentStep, totalSteps: 3)
                                .padding(.horizontal, 24)
                        }
                        .padding(.top, 20)
                        
                        // Form Content
                        if currentStep == 0 {
                            companyInfoStep
                        } else if currentStep == 1 {
                            personalInfoStep
                        } else {
                            reviewStep
                        }
                        
                        // Navigation Buttons
                        navigationButtons
                        
                        Spacer(minLength: 40)
                    }
                }
            }
            .navigationBarHidden(true)
        }
        .alert("Registration Error", isPresented: $showingAlert) {
            Button("OK") { }
        } message: {
            Text(alertMessage)
        }
        .preferredColorScheme(.dark)
    }
    
    // MARK: - Step Views
    
    private var companyInfoStep: some View {
        VStack(spacing: 24) {
            VStack(spacing: 8) {
                Text("Company Information")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundStyle(
                        LinearGradient(
                            colors: [.cyan, .white],
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                    )
                
                Text("Tell us about your business")
                    .font(.system(size: 16))
                    .foregroundColor(.gray)
            }
            
            VStack(spacing: 16) {
                BusinessTextField(
                    placeholder: "Company Name",
                    text: $companyName,
                    icon: "building.2.fill"
                )
                
                BusinessTextField(
                    placeholder: "Business Email",
                    text: $businessEmail,
                    icon: "envelope.fill",
                    keyboardType: .emailAddress
                )
                
                BusinessTextField(
                    placeholder: "Phone Number",
                    text: $phoneNumber,
                    icon: "phone.fill",
                    keyboardType: .phonePad
                )
                
                // Company Size Picker
                VStack(alignment: .leading, spacing: 8) {
                    Text("Company Size")
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(.gray)
                        .padding(.leading, 4)
                    
                    Menu {
                        ForEach(companySizes, id: \.self) { size in
                            Button(size) {
                                companySize = size
                            }
                        }
                    } label: {
                        HStack {
                            Image(systemName: "person.3.fill")
                                .font(.system(size: 18, weight: .medium))
                                .foregroundColor(.cyan)
                                .frame(width: 24)
                            
                            Text(companySize + " employees")
                                .font(.system(size: 16))
                                .foregroundColor(.white)
                            
                            Spacer()
                            
                            Image(systemName: "chevron.down")
                                .font(.system(size: 14, weight: .medium))
                                .foregroundColor(.gray)
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
                
                // Industry Picker
                VStack(alignment: .leading, spacing: 8) {
                    Text("Industry")
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(.gray)
                        .padding(.leading, 4)
                    
                    Menu {
                        ForEach(industries, id: \.self) { industryOption in
                            Button(industryOption) {
                                industry = industryOption
                            }
                        }
                    } label: {
                        HStack {
                            Image(systemName: "wrench.and.screwdriver.fill")
                                .font(.system(size: 18, weight: .medium))
                                .foregroundColor(.cyan)
                                .frame(width: 24)
                            
                            Text(industry.isEmpty ? "Select Industry" : industry)
                                .font(.system(size: 16))
                                .foregroundColor(industry.isEmpty ? .gray : .white)
                            
                            Spacer()
                            
                            Image(systemName: "chevron.down")
                                .font(.system(size: 14, weight: .medium))
                                .foregroundColor(.gray)
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
            }
            .padding(.horizontal, 24)
        }
    }
    
    private var personalInfoStep: some View {
        VStack(spacing: 24) {
            VStack(spacing: 8) {
                Text("Your Information")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundStyle(
                        LinearGradient(
                            colors: [.cyan, .white],
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                    )
                
                Text("Create your admin account")
                    .font(.system(size: 16))
                    .foregroundColor(.gray)
            }
            
            VStack(spacing: 16) {
                HStack(spacing: 12) {
                    BusinessTextField(
                        placeholder: "First Name",
                        text: $firstName,
                        icon: "person.fill"
                    )
                    
                    BusinessTextField(
                        placeholder: "Last Name",
                        text: $lastName,
                        icon: "person.fill"
                    )
                }
                
                BusinessTextField(
                    placeholder: "Job Title",
                    text: $jobTitle,
                    icon: "briefcase.fill"
                )
                
                BusinessTextField(
                    placeholder: "Password",
                    text: $password,
                    icon: "lock.fill",
                    isSecure: true
                )
                
                BusinessTextField(
                    placeholder: "Confirm Password",
                    text: $confirmPassword,
                    icon: "lock.fill",
                    isSecure: true
                )
                
                // Password Strength Indicator
                if !password.isEmpty {
                    PasswordStrengthView(password: password)
                }
            }
            .padding(.horizontal, 24)
        }
    }
    
    private var reviewStep: some View {
        VStack(spacing: 24) {
            VStack(spacing: 8) {
                Text("Review & Confirm")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundStyle(
                        LinearGradient(
                            colors: [.cyan, .white],
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                    )
                
                Text("Please review your information")
                    .font(.system(size: 16))
                    .foregroundColor(.gray)
            }
            
            VStack(spacing: 16) {
                ReviewRow(title: "Company", value: companyName)
                ReviewRow(title: "Email", value: businessEmail)
                ReviewRow(title: "Phone", value: phoneNumber)
                ReviewRow(title: "Size", value: companySize + " employees")
                ReviewRow(title: "Industry", value: industry)
                ReviewRow(title: "Admin", value: "\(firstName) \(lastName)")
                ReviewRow(title: "Title", value: jobTitle)
            }
            .padding(.horizontal, 24)
            
            VStack(spacing: 16) {
                // Terms Agreement
                Button {
                    agreedToTerms.toggle()
                } label: {
                    HStack(alignment: .top, spacing: 12) {
                        Image(systemName: agreedToTerms ? "checkmark.square.fill" : "square")
                            .font(.system(size: 20))
                            .foregroundColor(agreedToTerms ? .cyan : .gray)
                        
                        VStack(alignment: .leading, spacing: 4) {
                            Text("I agree to the ")
                                .font(.system(size: 14))
                                .foregroundColor(.gray)
                            +
                            Text("Terms of Service")
                                .font(.system(size: 14, weight: .medium))
                                .foregroundColor(.cyan)
                            +
                            Text(" and ")
                                .font(.system(size: 14))
                                .foregroundColor(.gray)
                            +
                            Text("Privacy Policy")
                                .font(.system(size: 14, weight: .medium))
                                .foregroundColor(.cyan)
                        }
                        
                        Spacer()
                    }
                }
                
                // Marketing Agreement
                Button {
                    agreedToMarketing.toggle()
                } label: {
                    HStack(alignment: .top, spacing: 12) {
                        Image(systemName: agreedToMarketing ? "checkmark.square.fill" : "square")
                            .font(.system(size: 20))
                            .foregroundColor(agreedToMarketing ? .cyan : .gray)
                        
                        Text("I'd like to receive product updates and marketing communications")
                            .font(.system(size: 14))
                            .foregroundColor(.gray)
                            .multilineTextAlignment(.leading)
                        
                        Spacer()
                    }
                }
            }
            .padding(.horizontal, 24)
        }
    }
    
    private var navigationButtons: some View {
        HStack(spacing: 16) {
            if currentStep > 0 {
                Button {
                    withAnimation(.easeInOut(duration: 0.3)) {
                        currentStep -= 1
                    }
                } label: {
                    Text("Back")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(.cyan)
                        .frame(maxWidth: .infinity)
                        .frame(height: 56)
                        .background(
                            RoundedRectangle(cornerRadius: 16)
                                .fill(Color.black.opacity(0.4))
                                .overlay(
                                    RoundedRectangle(cornerRadius: 16)
                                        .stroke(Color.cyan, lineWidth: 1)
                                )
                        )
                }
            }
            
            Button {
                if currentStep < 2 {
                    if canProceed {
                        withAnimation(.easeInOut(duration: 0.3)) {
                            currentStep += 1
                        }
                    }
                } else {
                    registerBusiness()
                }
            } label: {
                HStack(spacing: 12) {
                    if isLoading {
                        ProgressView()
                            .progressViewStyle(CircularProgressViewStyle(tint: .white))
                            .scaleEffect(0.8)
                    } else {
                        Text(currentStep < 2 ? "Continue" : "Create Account")
                            .font(.system(size: 18, weight: .bold))
                    }
                }
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .frame(height: 56)
                .background(
                    LinearGradient(
                        colors: canProceed ? [.cyan, .magenta] : [.gray.opacity(0.3)],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                )
                .cornerRadius(16)
                .shadow(color: canProceed ? .cyan.opacity(0.4) : .clear, radius: 15)
            }
            .disabled(!canProceed || isLoading)
        }
        .padding(.horizontal, 24)
    }
    
    // MARK: - Computed Properties
    
    private var canProceed: Bool {
        switch currentStep {
        case 0:
            return !companyName.isEmpty && !businessEmail.isEmpty && !phoneNumber.isEmpty && !industry.isEmpty && isValidEmail(businessEmail)
        case 1:
            return !firstName.isEmpty && !lastName.isEmpty && !jobTitle.isEmpty && !password.isEmpty && password == confirmPassword && isPasswordValid(password)
        case 2:
            return agreedToTerms
        default:
            return false
        }
    }
    
    // MARK: - Helper Functions
    
    private func isValidEmail(_ email: String) -> Bool {
        let emailRegex = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}"
        let emailPredicate = NSPredicate(format:"SELF MATCHES %@", emailRegex)
        return emailPredicate.evaluate(with: email)
    }
    
    private func isPasswordValid(_ password: String) -> Bool {
        return password.count >= 8
    }
    
    private func registerBusiness() {
        isLoading = true
        
        // Simulate registration process
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
            isLoading = false
            
            // Success - close the view
            dismiss()
        }
    }
}

// MARK: - Supporting Views

struct ProgressIndicator: View {
    let currentStep: Int
    let totalSteps: Int
    
    var body: some View {
        HStack(spacing: 8) {
            ForEach(0..<totalSteps, id: \.self) { step in
                RoundedRectangle(cornerRadius: 4)
                    .fill(step <= currentStep ? Color.cyan : Color.gray.opacity(0.3))
                    .frame(height: 4)
            }
        }
    }
}

struct ReviewRow: View {
    let title: String
    let value: String
    
    var body: some View {
        HStack {
            Text(title + ":")
                .font(.system(size: 16, weight: .medium))
                .foregroundColor(.gray)
                .frame(width: 80, alignment: .leading)
            
            Text(value)
                .font(.system(size: 16))
                .foregroundColor(.white)
            
            Spacer()
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 12)
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(Color.black.opacity(0.4))
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(Color.cyan.opacity(0.2), lineWidth: 1)
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
        if password.range(of: "[a-z]", options: .regularExpression) != nil { score += 1 }
        if password.range(of: "[0-9]", options: .regularExpression) != nil { score += 1 }
        if password.range(of: "[^A-Za-z0-9]", options: .regularExpression) != nil { score += 1 }
        return score
    }
    
    var strengthText: String {
        switch strength {
        case 0...2: return "Weak"
        case 3...4: return "Good"
        default: return "Strong"
        }
    }
    
    var strengthColor: Color {
        switch strength {
        case 0...2: return .red
        case 3...4: return .orange
        default: return .green
        }
    }
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text("Password Strength: ")
                    .font(.system(size: 12, weight: .medium))
                    .foregroundColor(.gray)
                
                Text(strengthText)
                    .font(.system(size: 12, weight: .bold))
                    .foregroundColor(strengthColor)
            }
            
            HStack(spacing: 4) {
                ForEach(0..<5, id: \.self) { index in
                    RoundedRectangle(cornerRadius: 2)
                        .fill(index < strength ? strengthColor : Color.gray.opacity(0.3))
                        .frame(height: 4)
                }
            }
        }
        .padding(.horizontal, 20)
    }
}

#Preview {
    BusinessRegisterView()
        .preferredColorScheme(.dark)
}
