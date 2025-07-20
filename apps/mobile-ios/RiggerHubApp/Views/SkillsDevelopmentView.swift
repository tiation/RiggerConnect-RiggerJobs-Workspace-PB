import SwiftUI

struct SkillsDevelopmentView: View {
    @EnvironmentObject var themeManager: ThemeManager
    @State private var skills: [Skill] = []
    @State private var isLoading = false
    
    var body: some View {
        NavigationView {
            ZStack {
                themeManager.backgroundGradient.ignoresSafeArea()
                
                VStack(spacing: 0) {
                    // Heading
                    skillsHeading
                    
                    // Content
                    if isLoading {
                        loadingView
                    } else if skills.isEmpty {
                        emptyStateView
                    } else {
                        skillsList
                    }
                }
            }
            .navigationTitle("Skills Development")
            .navigationBarTitleDisplayMode(.large)
            .onAppear {
                loadSkills()
            }
            .refreshable {
                loadSkills()
            }
        }
    }
    
    private var skillsHeading: some View {
        VStack(spacing: 8) {
            Text("Enhance your skills and stay ahead in your career. Explore new opportunities for growth in the rigging industry.")
                .font(.body)
                .multilineTextAlignment(.center)
                .foregroundColor(themeManager.secondaryTextColor)
                .padding()
                .background(themeManager.surfaceColor.opacity(0.8))
                .cornerRadius(12)
                .padding(.horizontal)
        }
        .padding(.vertical, 12)
    }
    
    private var loadingView: some View {
        VStack(spacing: 16) {
            ProgressView()
                .tint(themeManager.accentColor)
            Text("Loading skills...")
                .foregroundColor(themeManager.secondaryTextColor)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
    
    private var emptyStateView: some View {
        VStack(spacing: 24) {
            Image(systemName: "lightbulb.fill")
                .font(.system(size: 60))
                .foregroundColor(themeManager.mutedTextColor)
            
            VStack(spacing: 8) {
                Text("No Skills Available")
                    .font(.title2)
                    .fontWeight(.semibold)
                    .foregroundColor(themeManager.primaryTextColor)
                
                Text("Discover courses and resources to develop your skills.")
                    .font(.body)
                    .multilineTextAlignment(.center)
                    .foregroundColor(themeManager.secondaryTextColor)
                    .padding(.horizontal, 40)
            }
            
            Button("Refresh") {
                loadSkills()
            }
            .buttonStyle(PrimaryButtonStyle(themeManager: themeManager))
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
    
    private var skillsList: some View {
        ScrollView {
            LazyVStack(spacing: 16) {
                ForEach(skills, id: \.id) { skill in
                    SkillCard(skill: skill)
                        .onTapGesture {
                            // Handle skill selection
                        }
                }
            }
            .padding(.vertical, 12)
        }
    }
    
    private func loadSkills() {
        isLoading = true
        
        // Simulate API call
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            skills = generateSampleSkills()
            isLoading = false
        }
    }
    
    private func generateSampleSkills() -> [Skill] {
        return [
            Skill(id: "1", name: "Advanced Rigging", description: "Increase your expertise in rigging with this advanced course...", level: "Advanced"),
            Skill(id: "2", name: "Crane Operations", description: "Learn effective crane operation techniques...", level: "Intermediate"),
            Skill(id: "3", name: "Safety Management", description: "Understand the importance of safety management in construction sites...", level: "Beginner")
        ]
    }
}

struct SkillsDevelopmentView_Previews: PreviewProvider {
    static var previews: some View {
        SkillsDevelopmentView()
            .environmentObject(ThemeManager())
    }
}

struct SkillCard: View {
    let skill: Skill
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            VStack(alignment: .leading, spacing: 4) {
                HStack {
                    Text(skill.name)
                        .font(.headline)
                        .fontWeight(.semibold)
                        .foregroundColor(themeManager.primaryTextColor)
                    
                    Spacer()
                    
                    Text(skill.level)
                        .font(.callout)
                        .fontWeight(.bold)
                        .foregroundColor(themeManager.primaryTextColor)
                        .padding(6)
                        .background(themeManager.accentColor.opacity(0.2))
                        .cornerRadius(8)
                }
                
                Text(skill.description)
                    .font(.body)
                    .foregroundColor(themeManager.secondaryTextColor)
                    .lineLimit(3)
                    .padding(.top, 4)
            }
        }
        .padding()
        .background(themeManager.surfaceColor)
        .cornerRadius(12)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(themeManager.mutedTextColor.opacity(0.1), lineWidth: 1)
        )
    }
}

struct Skill: Identifiable {
    let id: String
    let name: String
    let description: String
    let level: String
}
