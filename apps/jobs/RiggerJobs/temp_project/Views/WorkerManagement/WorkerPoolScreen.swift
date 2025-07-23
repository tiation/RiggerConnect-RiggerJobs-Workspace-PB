import SwiftUI

struct WorkerPoolScreen: View {
    @EnvironmentObject var workerManager: WorkerManagementManager
    
    var body: some View {
        NavigationView {
            VStack {
                Text("Worker Pool")
                    .font(.title)
                    .foregroundColor(.white)
                
                Text("Worker management coming soon...")
                    .foregroundColor(.gray)
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(Color.black.ignoresSafeArea())
            .navigationTitle("Workers")
        }
    }
}

#Preview {
    WorkerPoolScreen()
        .environmentObject(WorkerManagementManager())
        .preferredColorScheme(.dark)
}
