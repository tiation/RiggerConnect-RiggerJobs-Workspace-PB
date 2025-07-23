import SwiftUI

struct PermissionsView: View {
    @State private var locationPermissionGranted = false
    @State private var notificationPermissionGranted = false
    @State private var cameraPermissionGranted = false
    
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
                    Image(systemName: "shield.checkered")
                        .font(.system(size: 60))
                        .foregroundStyle(
                            LinearGradient(
                                colors: [.cyan, .purple],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                    
                    Text("Grant Permissions")
                        .font(.title)
                        .fontWeight(.bold)
                        .foregroundColor(.white)
                    
                    Text("To provide the best experience, RiggerHire needs access to these features")
                        .font(.body)
                        .foregroundColor(.gray)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 20)
                }
                
                // Permission items
                VStack(spacing: 20) {
                    PermissionRow(
                        icon: "location.fill",
                        title: "Location Access",
                        description: "Find nearby jobs and improve recommendations",
                        isGranted: $locationPermissionGranted
                    )
                    
                    PermissionRow(
                        icon: "bell.fill",
                        title: "Push Notifications",
                        description: "Get notified about new jobs and application updates",
                        isGranted: $notificationPermissionGranted
                    )
                    
                    PermissionRow(
                        icon: "camera.fill",
                        title: "Camera Access",
                        description: "Upload profile photos and document images",
                        isGranted: $cameraPermissionGranted
                    )
                }
                
                Spacer()
                
                // Continue button
                Button(action: {
                    // Handle continue action
                }) {
                    Text("Continue")
                        .font(.headline)
                        .foregroundColor(.black)
                        .frame(maxWidth: .infinity)
                        .frame(height: 50)
                        .background(
                            LinearGradient(
                                colors: [.cyan, .purple],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .cornerRadius(25)
                        .shadow(color: .cyan.opacity(0.3), radius: 10, x: 0, y: 5)
                }
                .padding(.horizontal, 20)
            }
            .padding(.vertical, 40)
        }
    }
}

struct PermissionRow: View {
    let icon: String
    let title: String
    let description: String
    @Binding var isGranted: Bool
    
    var body: some View {
        HStack(spacing: 15) {
            // Icon
            Image(systemName: icon)
                .font(.system(size: 24))
                .foregroundColor(.cyan)
                .frame(width: 40, height: 40)
                .background(Color.cyan.opacity(0.1))
                .cornerRadius(8)
            
            // Text content
            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.headline)
                    .foregroundColor(.white)
                
                Text(description)
                    .font(.caption)
                    .foregroundColor(.gray)
                    .lineLimit(2)
            }
            
            Spacer()
            
            // Toggle
            Toggle("", isOn: $isGranted)
                .tint(.cyan)
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 12)
        .background(Color.white.opacity(0.05))
        .cornerRadius(12)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color.cyan.opacity(0.3), lineWidth: 1)
        )
        .padding(.horizontal, 20)
    }
}

#Preview {
    PermissionsView()
}
