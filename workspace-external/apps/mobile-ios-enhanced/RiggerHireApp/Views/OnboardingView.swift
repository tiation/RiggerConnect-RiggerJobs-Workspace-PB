import SwiftUI

struct OnboardingView: View {
    @EnvironmentObject var themeManager: ThemeManager
    @State private var currentPage = 0
    @State private var showLogin = false
    
    let onboardingPages = [
        OnboardingPage(
            icon: "hammer.fill",
            title: "Find Your Next Rigging Job",
            subtitle: "Connect with top construction and rigging companies across Western Australia",
            color: Color.cyan
        ),
        OnboardingPage(
            icon: "person.3.fill",
            title: "Build Your Professional Profile",
            subtitle: "Showcase your skills, certifications, and experience to stand out from the crowd",
            color: Color.magenta
        ),
        OnboardingPage(
            icon: "dollarsign.circle.fill",
            title: "Track Your Earnings",
            subtitle: "Monitor your income, manage payments, and analyze your career growth",
            color: Color.cyan
        ),
        OnboardingPage(
            icon: "chart.line.uptrend.xyaxis",
            title: "Advance Your Career",
            subtitle: "Access industry insights, skill development, and networking opportunities",
            color: Color.magenta
        )
    ]
    
    var body: some View {
        ZStack {
            themeManager.backgroundGradient.ignoresSafeArea()
            
            VStack(spacing: 0) {
                // Page Content
                TabView(selection: $currentPage) {
                    ForEach(0..<onboardingPages.count, id: \.self) { index in
                        OnboardingPageView(page: onboardingPages[index])
                            .tag(index)
                    }
                }
                .tabViewStyle(PageTabViewStyle(indexDisplayMode: .never))
                .animation(.easeInOut, value: currentPage)
                
                // Bottom Section
                VStack(spacing: 32) {
                    // Page Indicators
                    HStack(spacing: 12) {
                        ForEach(0..<onboardingPages.count, id: \.self) { index in
                            Circle()
                                .fill(currentPage == index ? themeManager.accentColor : themeManager.mutedTextColor)
                                .frame(width: 8, height: 8)
                                .scaleEffect(currentPage == index ? 1.2 : 1.0)
                                .animation(.spring(), value: currentPage)
                        }
                    }
                    .padding(.top, 20)
                    
                    // Action Buttons
                    VStack(spacing: 16) {
                        if currentPage < onboardingPages.count - 1 {
                            HStack {
                                Button("Skip") {
                                    showLogin = true
                                }
                                .foregroundColor(themeManager.mutedTextColor)
                                
                                Spacer()
                                
                                Button("Next") {
                                    withAnimation {
                                        currentPage += 1
                                    }
                                }
                                .foregroundColor(themeManager.accentColor)
                                .fontWeight(.semibold)
                            }
                            .padding(.horizontal, 40)
                        } else {
                            Button("Get Started") {
                                showLogin = true
                            }
                            .buttonStyle(PrimaryButtonStyle(themeManager: themeManager))
                            .padding(.horizontal, 40)
                        }
                    }
                    .padding(.bottom, 50)
                }
            }
        }
        .fullScreenCover(isPresented: $showLogin) {
            AuthenticationView()
        }
    }
}

struct OnboardingPageView: View {
    let page: OnboardingPage
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        VStack(spacing: 40) {
            Spacer()
            
            // Icon
            ZStack {
                Circle()
                    .fill(page.color.opacity(0.2))
                    .frame(width: 140, height: 140)
                
                Circle()
                    .stroke(
                        LinearGradient(
                            colors: [page.color, page.color.opacity(0.3)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        ),
                        lineWidth: 2
                    )
                    .frame(width: 140, height: 140)
                
                Image(systemName: page.icon)
                    .font(.system(size: 50, weight: .medium))
                    .foregroundStyle(
                        LinearGradient(
                            colors: [page.color, page.color.opacity(0.8)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
            }
            .shadow(color: page.color.opacity(0.3), radius: 20, x: 0, y: 10)
            
            // Content
            VStack(spacing: 24) {
                Text(page.title)
                    .font(.title)
                    .fontWeight(.bold)
                    .foregroundColor(themeManager.primaryTextColor)
                    .multilineTextAlignment(.center)
                
                Text(page.subtitle)
                    .font(.body)
                    .foregroundColor(themeManager.secondaryTextColor)
                    .multilineTextAlignment(.center)
                    .lineLimit(nil)
            }
            .padding(.horizontal, 40)
            
            Spacer()
        }
    }
}

struct OnboardingPage {
    let icon: String
    let title: String
    let subtitle: String
    let color: Color
}

struct OnboardingView_Previews: PreviewProvider {
    static var previews: some View {
        OnboardingView()
            .environmentObject(ThemeManager())
    }
}
