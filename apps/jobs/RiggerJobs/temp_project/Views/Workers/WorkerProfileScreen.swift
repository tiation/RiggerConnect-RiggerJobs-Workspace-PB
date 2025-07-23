import SwiftUI

struct WorkerProfileScreen: View {
    let worker: Worker
    @EnvironmentObject var workerManager: WorkersManager
    @Environment(\.dismiss) private var dismiss
    
    @State private var showingContactSheet = false
    @State private var showingNotesSheet = false
    @State private var notes = ""
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                // Header with profile photo and basic info
                VStack(spacing: 16) {
                    AsyncImage(url: URL(string: worker.profileImageURL ?? "")) { image in
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                    } placeholder: {
                        Image(systemName: "person.circle.fill")
                            .font(.system(size: 80))
                            .foregroundColor(.gray)
                    }
                    .frame(width: 120, height: 120)
                    .clipShape(Circle())
                    .overlay(
                        Circle()
                            .stroke(Color.cyan, lineWidth: 3)
                    )
                    .shadow(color: .cyan.opacity(0.3), radius: 10)
                    
                    VStack(spacing: 8) {
                        Text(worker.fullName)
                            .font(.title)
                            .fontWeight(.bold)
                            .foregroundColor(.white)
                        
                        Text(worker.title)
                            .font(.headline)
                            .foregroundColor(.cyan)
                        
                        HStack(spacing: 16) {
                            HStack {
                                Image(systemName: "location")
                                    .foregroundColor(.gray)
                                Text(worker.location)
                                    .foregroundColor(.gray)
                            }
                            
                            HStack {
                                Image(systemName: "star.fill")
                                    .foregroundColor(.yellow)
                                Text(String(format: "%.1f", worker.rating))
                                    .foregroundColor(.white)
                            }
                        }
                        .font(.subheadline)
                    }
                }
                .padding()
                .background(
                    RoundedRectangle(cornerRadius: 20)
                        .fill(Color.gray.opacity(0.1))
                        .overlay(
                            RoundedRectangle(cornerRadius: 20)
                                .stroke(Color.cyan.opacity(0.3), lineWidth: 1)
                        )
                )
                
                // Quick Stats
                HStack(spacing: 16) {
                    StatCard(title: "Experience", value: "\(worker.yearsOfExperience) years", icon: "briefcase.fill")
                    StatCard(title: "Jobs Completed", value: "\(worker.completedJobs)", icon: "checkmark.circle.fill")
                    StatCard(title: "Availability", value: worker.availability.displayName, icon: "clock.fill")
                }
                
                // Bio Section
                if !worker.bio.isEmpty {
                    VStack(alignment: .leading, spacing: 12) {
                        Text("About")
                            .font(.headline)
                            .foregroundColor(.white)
                        
                        Text(worker.bio)
                            .font(.body)
                            .foregroundColor(.gray)
                            .lineSpacing(4)
                    }
                    .padding()
                    .background(
                        RoundedRectangle(cornerRadius: 12)
                            .fill(Color.gray.opacity(0.1))
                    )
                }
                
                // Skills Section
                if !worker.skills.isEmpty {
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Skills")
                            .font(.headline)
                            .foregroundColor(.white)
                        
                        LazyVGrid(columns: [GridItem(.adaptive(minimum: 100))], spacing: 8) {
                            ForEach(worker.skills, id: \.self) { skill in
                                Text(skill)
                                    .font(.caption)
                                    .foregroundColor(.white)
                                    .padding(.horizontal, 12)
                                    .padding(.vertical, 6)
                                    .background(
                                        RoundedRectangle(cornerRadius: 16)
                                            .fill(Color.blue.opacity(0.3))
                                            .overlay(
                                                RoundedRectangle(cornerRadius: 16)
                                                    .stroke(Color.blue, lineWidth: 1)
                                            )
                                    )
                            }
                        }
                    }
                    .padding()
                    .background(
                        RoundedRectangle(cornerRadius: 12)
                            .fill(Color.gray.opacity(0.1))
                    )
                }
                
                // Experience Section
                if !worker.workHistory.isEmpty {
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Work Experience")
                            .font(.headline)
                            .foregroundColor(.white)
                        
                        ForEach(worker.workHistory, id: \.id) { experience in
                            ExperienceCard(experience: experience)
                        }
                    }
                    .padding()
                    .background(
                        RoundedRectangle(cornerRadius: 12)
                            .fill(Color.gray.opacity(0.1))
                    )
                }
                
                // Certifications Section
                if !worker.certifications.isEmpty {
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Certifications")
                            .font(.headline)
                            .foregroundColor(.white)
                        
                        ForEach(worker.certifications, id: \.self) { certification in
                            HStack {
                                Image(systemName: "rosette")
                                    .foregroundColor(.yellow)
                                Text(certification)
                                    .foregroundColor(.white)
                                Spacer()
                            }
                            .padding()
                            .background(
                                RoundedRectangle(cornerRadius: 8)
                                    .fill(Color.yellow.opacity(0.1))
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 8)
                                            .stroke(Color.yellow.opacity(0.3), lineWidth: 1)
                                    )
                            )
                        }
                    }
                    .padding()
                    .background(
                        RoundedRectangle(cornerRadius: 12)
                            .fill(Color.gray.opacity(0.1))
                    )
                }
                
                // Action Buttons
                VStack(spacing: 12) {
                    Button(action: { showingContactSheet = true }) {
                        HStack {
                            Image(systemName: "message.fill")
                            Text("Contact Worker")
                        }
                        .font(.headline)
                        .foregroundColor(.black)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(
                            LinearGradient(
                                colors: [.cyan, .blue],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .cornerRadius(12)
                        .shadow(color: .cyan.opacity(0.3), radius: 8)
                    }
                    
                    HStack(spacing: 12) {
                        Button(action: { showingNotesSheet = true }) {
                            HStack {
                                Image(systemName: "note.text")
                                Text("Add Notes")
                            }
                            .font(.subheadline)
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color.gray.opacity(0.3))
                            .cornerRadius(8)
                        }
                        
                        Button(action: {
                            // Add to favorites action
                        }) {
                            HStack {
                                Image(systemName: "heart")
                                Text("Favorite")
                            }
                            .font(.subheadline)
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color.red.opacity(0.6))
                            .cornerRadius(8)
                        }
                    }
                }
                .padding(.top)
            }
            .padding()
        }
        .background(Color.black)
        .navigationBarTitleDisplayMode(.inline)
        .sheet(isPresented: $showingContactSheet) {
            ContactWorkerSheet(worker: worker)
        }
        .sheet(isPresented: $showingNotesSheet) {
            NotesSheet(notes: $notes)
        }
    }
}

struct StatCard: View {
    let title: String
    let value: String
    let icon: String
    
    var body: some View {
        VStack(spacing: 8) {
            Image(systemName: icon)
                .font(.title2)
                .foregroundColor(.cyan)
            
            Text(value)
                .font(.headline)
                .fontWeight(.bold)
                .foregroundColor(.white)
            
            Text(title)
                .font(.caption)
                .foregroundColor(.gray)
        }
        .frame(maxWidth: .infinity)
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(Color.gray.opacity(0.1))
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(Color.cyan.opacity(0.3), lineWidth: 1)
                )
        )
    }
}

struct ExperienceCard: View {
    let experience: WorkExperience
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text(experience.position)
                        .font(.headline)
                        .foregroundColor(.white)
                    
                    Text(experience.company)
                        .font(.subheadline)
                        .foregroundColor(.cyan)
                }
                
                Spacer()
                
                VStack(alignment: .trailing, spacing: 2) {
                    Text("\(experience.startYear) - \(experience.endYear ?? "Present")")
                        .font(.caption)
                        .foregroundColor(.gray)
                    
                    Text("\(experienceDuration) years")
                        .font(.caption)
                        .foregroundColor(.gray)
                }
            }
            
            if !experience.description.isEmpty {
                Text(experience.description)
                    .font(.callout)
                    .foregroundColor(.gray)
                    .lineSpacing(2)
            }
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 8)
                .fill(Color.gray.opacity(0.05))
                .overlay(
                    RoundedRectangle(cornerRadius: 8)
                        .stroke(Color.gray.opacity(0.2), lineWidth: 1)
                )
        )
    }
    
    private var experienceDuration: Int {
        let endYear = experience.endYear ?? Calendar.current.component(.year, from: Date())
        return endYear - experience.startYear
    }
}

struct ContactWorkerSheet: View {
    let worker: Worker
    @Environment(\.dismiss) private var dismiss
    @State private var message = ""
    
    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                VStack(spacing: 8) {
                    AsyncImage(url: URL(string: worker.profileImageURL ?? "")) { image in
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                    } placeholder: {
                        Image(systemName: "person.circle.fill")
                            .font(.system(size: 40))
                            .foregroundColor(.gray)
                    }
                    .frame(width: 60, height: 60)
                    .clipShape(Circle())
                    
                    Text("Contact \(worker.firstName)")
                        .font(.headline)
                        .foregroundColor(.white)
                }
                
                VStack(alignment: .leading, spacing: 8) {
                    Text("Message")
                        .font(.headline)
                        .foregroundColor(.white)
                    
                    TextEditor(text: $message)
                        .frame(minHeight: 120)
                        .padding(8)
                        .background(Color.gray.opacity(0.2))
                        .cornerRadius(8)
                        .overlay(
                            RoundedRectangle(cornerRadius: 8)
                                .stroke(Color.cyan.opacity(0.5), lineWidth: 1)
                        )
                }
                
                Spacer()
            }
            .padding()
            .background(Color.black)
            .navigationTitle("Contact Worker")
            .navigationBarTitleDisplayMode(.inline)
            .navigationBarItems(
                leading: Button("Cancel") {
                    dismiss()
                }
                .foregroundColor(.cyan),
                trailing: Button("Send") {
                    // Send message logic
                    dismiss()
                }
                .foregroundColor(.cyan)
                .disabled(message.isEmpty)
            )
        }
    }
}

struct NotesSheet: View {
    @Binding var notes: String
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            VStack(alignment: .leading, spacing: 8) {
                Text("Notes")
                    .font(.headline)
                    .foregroundColor(.white)
                
                TextEditor(text: $notes)
                    .padding(8)
                    .background(Color.gray.opacity(0.2))
                    .cornerRadius(8)
                    .overlay(
                        RoundedRectangle(cornerRadius: 8)
                            .stroke(Color.cyan.opacity(0.5), lineWidth: 1)
                    )
                
                Spacer()
            }
            .padding()
            .background(Color.black)
            .navigationTitle("Worker Notes")
            .navigationBarTitleDisplayMode(.inline)
            .navigationBarItems(
                leading: Button("Cancel") {
                    dismiss()
                }
                .foregroundColor(.cyan),
                trailing: Button("Save") {
                    // Save notes logic
                    dismiss()
                }
                .foregroundColor(.cyan)
            )
        }
    }
}

#Preview {
    NavigationView {
        WorkerProfileScreen(worker: Worker(
            id: "1",
            firstName: "John",
            lastName: "Smith",
            email: "john.smith@email.com",
            title: "Senior iOS Developer",
            bio: "Experienced iOS developer with 8+ years of experience building scalable mobile applications. Passionate about SwiftUI and modern development practices.",
            location: "San Francisco, CA",
            skills: ["Swift", "SwiftUI", "UIKit", "Core Data", "REST APIs", "Git"],
            yearsOfExperience: 8,
            rating: 4.8,
            completedJobs: 47,
            availability: .available,
            workHistory: [
                WorkExperience(
                    id: "1",
                    company: "Apple Inc.",
                    position: "Senior iOS Engineer",
                    startYear: 2020,
                    endYear: nil,
                    description: "Lead iOS development for core system apps"
                ),
                WorkExperience(
                    id: "2",
                    company: "Uber",
                    position: "iOS Developer",
                    startYear: 2018,
                    endYear: 2020,
                    description: "Developed rider-facing features for the Uber app"
                )
            ],
            certifications: ["Apple Certified Developer", "AWS Certified Solutions Architect"],
            profileImageURL: nil
        ))
    }
    .environmentObject(WorkersManager())
    .preferredColorScheme(.dark)
}
