import SwiftUI

struct SkillsView: View {
    @State private var selectedSkills: Set<String> = []
    @State private var experienceLevel: ExperienceLevel = .beginner
    
    let skills = [
        "Basic Rigging", "Advanced Rigging", "Crane Operation", "Dogman",
        "Tower Crane", "Mobile Crane", "Overhead Crane", "Safety Management",
        "Load Calculation", "Lifting Plans", "High Risk Work", "Scaffolding",
        "Working at Heights", "Confined Spaces", "First Aid", "Traffic Control"
    ]
    
    var body: some View {
        ZStack {
            // Dark background with neon gradient
            LinearGradient(
                colors: [Color.black, Color(red: 0.1, green: 0.1, blue: 0.2)],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()
            
            ScrollView {
                VStack(spacing: 30) {
                    // Header
                    VStack(spacing: 10) {
                        Image(systemName: "wrench.and.screwdriver")
                            .font(.system(size: 60))
                            .foregroundStyle(
                                LinearGradient(
                                    colors: [.cyan, .purple],
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                )
                            )
                        
                        Text("Select Your Skills")
                            .font(.title)
                            .fontWeight(.bold)
                            .foregroundColor(.white)
                        
                        Text("Choose your skills and experience level to get better job matches")
                            .font(.body)
                            .foregroundColor(.gray)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 20)
                    }
                    
                    // Experience Level
                    VStack(alignment: .leading, spacing: 15) {
                        Text("Experience Level")
                            .font(.headline)
                            .foregroundColor(.white)
                            .padding(.horizontal, 20)
                        
                        HStack(spacing: 10) {
                            ForEach(ExperienceLevel.allCases, id: \.self) { level in
                                Button(action: {
                                    experienceLevel = level
                                }) {
                                    Text(level.rawValue)
                                        .font(.caption)
                                        .fontWeight(.medium)
                                        .foregroundColor(experienceLevel == level ? .black : .cyan)
                                        .padding(.horizontal, 16)
                                        .padding(.vertical, 8)
                                        .background(
                                            experienceLevel == level ?
                                            LinearGradient(
                                                colors: [.cyan, .purple],
                                                startPoint: .leading,
                                                endPoint: .trailing
                                            ) :
                                            LinearGradient(
                                                colors: [Color.clear, Color.clear],
                                                startPoint: .leading,
                                                endPoint: .trailing
                                            )
                                        )
                                        .overlay(
                                            RoundedRectangle(cornerRadius: 20)
                                                .stroke(Color.cyan.opacity(0.5), lineWidth: 1)
                                        )
                                        .cornerRadius(20)
                                }
                            }
                        }
                        .padding(.horizontal, 20)
                    }
                    
                    // Skills Selection
                    VStack(alignment: .leading, spacing: 15) {
                        Text("Skills (Select all that apply)")
                            .font(.headline)
                            .foregroundColor(.white)
                            .padding(.horizontal, 20)
                        
                        LazyVGrid(columns: [
                            GridItem(.flexible()),
                            GridItem(.flexible())
                        ], spacing: 12) {
                            ForEach(skills, id: \.self) { skill in
                                SkillChip(
                                    title: skill,
                                    isSelected: selectedSkills.contains(skill)
                                ) {
                                    if selectedSkills.contains(skill) {
                                        selectedSkills.remove(skill)
                                    } else {
                                        selectedSkills.insert(skill)
                                    }
                                }
                            }
                        }
                        .padding(.horizontal, 20)
                    }
                    
                    // Continue button
                    Button(action: {
                        // Handle continue action
                    }) {
                        Text("Continue (\(selectedSkills.count) selected)")
                            .font(.headline)
                            .foregroundColor(.black)
                            .frame(maxWidth: .infinity)
                            .frame(height: 50)
                            .background(
                                selectedSkills.isEmpty ?
                                Color.gray.opacity(0.5) :
                                LinearGradient(
                                    colors: [.cyan, .purple],
                                    startPoint: .leading,
                                    endPoint: .trailing
                                )
                            )
                            .cornerRadius(25)
                            .shadow(color: .cyan.opacity(0.3), radius: 10, x: 0, y: 5)
                    }
                    .disabled(selectedSkills.isEmpty)
                    .padding(.horizontal, 20)
                    .padding(.bottom, 20)
                }
            }
        }
    }
}

struct SkillChip: View {
    let title: String
    let isSelected: Bool
    let onTap: () -> Void
    
    var body: some View {
        Button(action: onTap) {
            Text(title)
                .font(.caption)
                .fontWeight(.medium)
                .foregroundColor(isSelected ? .black : .cyan)
                .padding(.horizontal, 12)
                .padding(.vertical, 8)
                .background(
                    isSelected ?
                    LinearGradient(
                        colors: [.cyan, .purple],
                        startPoint: .leading,
                        endPoint: .trailing
                    ) :
                    Color.white.opacity(0.05)
                )
                .overlay(
                    RoundedRectangle(cornerRadius: 16)
                        .stroke(Color.cyan.opacity(0.3), lineWidth: 1)
                )
                .cornerRadius(16)
        }
    }
}

enum ExperienceLevel: String, CaseIterable {
    case beginner = "Beginner"
    case intermediate = "Intermediate"
    case experienced = "Experienced"
    case expert = "Expert"
}

#Preview {
    SkillsView()
}
