import SwiftUI

// View Extensions
extension View {
    func placeholderStyle() -> some View {
        self
            .background(Color.gray.opacity(0.5))
            .cornerRadius(10)
            .padding()
    }
}
