import SwiftUI

struct SettingsOverviewScreen: View {
    @EnvironmentObject var authManager: AuthenticationManager
    
    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                Text("Settings")
                    .font(.title)
                    .foregroundColor(.white)
                
                // Logout Button
                Button("Logout") {
                    authManager.logout()
                }
                .font(.headline)
                .foregroundColor(.black)
                .frame(maxWidth: .infinity)
                .padding()
                .background(
                    LinearGradient(
                        colors: [.red, .orange],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                )
                .cornerRadius(12)
                .padding(.horizontal, 40)
                
                Text("Settings panel coming soon...")
                    .foregroundColor(.gray)
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(Color.black.ignoresSafeArea())
            .navigationTitle("Settings")
        }
    }
}

#Preview {
    SettingsOverviewScreen()
        .environmentObject(AuthenticationManager())
        .preferredColorScheme(.dark)
}
