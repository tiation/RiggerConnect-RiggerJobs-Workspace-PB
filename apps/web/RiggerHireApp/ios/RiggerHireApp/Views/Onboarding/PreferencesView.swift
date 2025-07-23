import SwiftUI

struct PreferencesView: View {
    @State private var jobAlertsEnabled = true
    @State private var newsletterSubscribed = false
    @State private var notificationFrequency = NotificationFrequency.daily
    
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
                    Image(systemName: "gearshape.fill")
                        .font(.system(size: 60))
                        .foregroundStyle(
                            LinearGradient(
                                colors: [.cyan, .purple],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                    
                    Text("Set Your Preferences")
                        .font(.title)
                        .fontWeight(.bold)
                        .foregroundColor(.white)
                    
                    Text("Adjust how you want to receive job alerts and notifications")
                        .font(.body)
                        .foregroundColor(.gray)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 20)
                }
                
                // Preferences
                VStack(spacing: 20) {
                    // Job Alerts Toggle
                    PreferenceToggleView(title: "Job Alerts",
                                         description: "Receive notifications about new job listings",
                                         isOn: $jobAlertsEnabled)
                    
                    // Newsletter Subscription Toggle
                    PreferenceToggleView(title: "Newsletter Subscription",
                                         description: "Get the latest industry news and updates",
                                         isOn: $newsletterSubscribed)
                    
                    // Notification Frequency Picker
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Notification Frequency")
                            .font(.headline)
                            .foregroundColor(.white)
                        
                        Picker("Notification Frequency", selection: $notificationFrequency) {
                            ForEach(NotificationFrequency.allCases, id: \.self) { frequency in
                                Text(frequency.rawValue.capitalized)
                            }
                        }
                        .pickerStyle(SegmentedPickerStyle())
                        .background(Color.white.opacity(0.05))
                        .cornerRadius(8)
                        .padding(.horizontal, 20)
                        .padding(.vertical, 8)
                        .shadow(color: .cyan.opacity(0.3), radius: 10, x: 0, y: 5)
                    }
                    .padding(.horizontal, 20)
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

struct PreferenceToggleView: View {
    let title: String
    let description: String
    @Binding var isOn: Bool
    
    var body: some View {
        Toggle(isOn: $isOn) {
            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.headline)
                    .foregroundColor(.white)
                
                Text(description)
                    .font(.caption)
                    .foregroundColor(.gray)
            }
        }
        .toggleStyle(SwitchToggleStyle(tint: .cyan))
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

enum NotificationFrequency: String, CaseIterable {
    case instant = "instant"
    case hourly = "hourly"
    case daily = "daily"
    case weekly = "weekly"
}

#Preview {
    PreferencesView()
}
