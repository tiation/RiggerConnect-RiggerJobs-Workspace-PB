import SwiftUI

struct ContentView: View {
    @EnvironmentObject var authManager: AuthManager
    
    var body: some View {
        VStack {
            if authManager.isAuthenticated {
                HomeView()
            } else {
                AuthenticationView()
            }
        }
    }
}

// MARK: - Authentication View
struct AuthenticationView: View {
    @State private var email = ""
    @State private var password = ""
    @EnvironmentObject var authManager: AuthManager
    
    var body: some View {
        VStack(spacing: 20) {
            Text("Welcome to RiggerHire")
                .font(.largeTitle)
                .foregroundColor(ThemeManager.textPrimary)
                .padding(.top, 40)
                
            TextField("Email", text: $email)
                .padding()
                .background(ThemeManager.backgroundSecondary)
                .cornerRadius(10)
                .foregroundColor(ThemeManager.textPrimary)

            SecureField("Password", text: $password)
                .padding()
                .background(ThemeManager.backgroundSecondary)
                .cornerRadius(10)
                .foregroundColor(ThemeManager.textPrimary)

            Button(action: {
                print("Signing in...")
                // Call authentication service...
            }) {
                Text("Sign In")
                    .fontWeight(.bold)
                    .foregroundColor(ThemeManager.textPrimary)
                    .padding()
                    .frame(maxWidth: .infinity)
                    .background(ThemeManager.neonGradient)
                    .cornerRadius(10)
            }
            .padding(.horizontal, 40)

            Spacer()
        }
        .padding()
        .background(ThemeManager.backgroundGradient)
        .ignoresSafeArea(.all)
    }
}
