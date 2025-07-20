import SwiftUI

struct CustomTextField: View {
    let title: String
    @Binding var text: String
    var icon: String? = nil
    var keyboardType: UIKeyboardType = .default
    var isSecure: Bool = false
    
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            if !title.isEmpty {
                Text(title)
                    .font(.caption)
                    .foregroundColor(themeManager.secondaryTextColor)
            }
            
            HStack(spacing: 12) {
                if let iconName = icon {
                    Image(systemName: iconName)
                        .foregroundColor(themeManager.mutedTextColor)
                        .frame(width: 20)
                }
                
                if isSecure {
                    SecureField("", text: $text)
                        .textFieldStyle(PlainTextFieldStyle())
                        .keyboardType(keyboardType)
                } else {
                    TextField("", text: $text)
                        .textFieldStyle(PlainTextFieldStyle())
                        .keyboardType(keyboardType)
                }
            }
            .padding()
            .background(themeManager.surfaceColor)
            .cornerRadius(12)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(themeManager.accentColor.opacity(0.3), lineWidth: 1)
            )
        }
    }
}

#Preview {
    CustomTextField(
        title: "Email",
        text: .constant(""),
        icon: "envelope"
    )
    .padding()
    .environmentObject(ThemeManager())
}
