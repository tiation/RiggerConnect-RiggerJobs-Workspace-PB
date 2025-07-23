import SwiftUI

struct BusinessAnalyticsScreen: View {
    var body: some View {
        NavigationView {
            VStack {
                Text("Business Analytics")
                    .font(.title)
                    .foregroundColor(.white)
                
                Text("Analytics dashboard coming soon...")
                    .foregroundColor(.gray)
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(Color.black.ignoresSafeArea())
            .navigationTitle("Analytics")
        }
    }
}

#Preview {
    BusinessAnalyticsScreen()
        .preferredColorScheme(.dark)
}
