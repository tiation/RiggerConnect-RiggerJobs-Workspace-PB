import SwiftUI

struct JobsListScreen: View {
    @EnvironmentObject var jobManager: JobPostingManager
    
    var body: some View {
        NavigationView {
            VStack {
                Text("Jobs List")
                    .font(.title)
                    .foregroundColor(.white)
                
                Text("Job management coming soon...")
                    .foregroundColor(.gray)
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(Color.black.ignoresSafeArea())
            .navigationTitle("Jobs")
        }
    }
}

#Preview {
    JobsListScreen()
        .environmentObject(JobPostingManager())
        .preferredColorScheme(.dark)
}
