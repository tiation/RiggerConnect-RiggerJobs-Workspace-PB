import SwiftUI

struct CommunityEngagementView: View {
    @EnvironmentObject var themeManager: ThemeManager
    @State private var posts: [CommunityPost] = []
    @State private var isLoading = false
    @State private var showComposePost = false
    
    var body: some View {
        NavigationView {
            ZStack {
                themeManager.backgroundGradient.ignoresSafeArea()
                
                VStack(spacing: 0) {
                    // Heading
                    communityHeading
                    
                    // Content
                    if isLoading {
                        loadingView
                    } else if posts.isEmpty {
                        emptyStateView
                    } else {
                        postsList
                    }
                }
            }
            .navigationTitle("Community Engagement")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: { showComposePost = true }) {
                        Image(systemName: "square.and.pencil")
                            .foregroundColor(themeManager.accentColor)
                    }
                }
            }
            .onAppear {
                loadPosts()
            }
            .refreshable {
                loadPosts()
            }
        }
        .sheet(isPresented: $showComposePost) {
            ComposePostView { newPost in
                posts.insert(newPost, at: 0)
            }
        }
    }
    
    private var communityHeading: some View {
        VStack(spacing: 8) {
            Text("Join the conversation! Connect with others in the rigging and construction industry. Share your experiences, insights, and build networks.")
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
            Text("Loading posts...")
                .foregroundColor(themeManager.secondaryTextColor)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
    
    private var emptyStateView: some View {
        VStack(spacing: 24) {
            Image(systemName: "person.3.fill")
                .font(.system(size: 60))
                .foregroundColor(themeManager.mutedTextColor)
            
            VStack(spacing: 8) {
                Text("No Posts Yet")
                    .font(.title2)
                    .fontWeight(.semibold)
                    .foregroundColor(themeManager.primaryTextColor)
                
                Text("Be the first to post and kickstart the conversation!")
                    .font(.body)
                    .multilineTextAlignment(.center)
                    .foregroundColor(themeManager.secondaryTextColor)
                    .padding(.horizontal, 40)
            }
            
            Button("Compose Post") {
                showComposePost = true
            }
            .buttonStyle(PrimaryButtonStyle(themeManager: themeManager))
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
    
    private var postsList: some View {
        ScrollView {
            LazyVStack(spacing: 16) {
                ForEach(posts, id: \.id) { post in
                    CommunityPostCard(post: post)
                        .onTapGesture {
                            // Handle post interaction
                        }
                }
            }
            .padding(.vertical, 12)
        }
    }
    
    private func loadPosts() {
        isLoading = true
        
        // Simulate API call
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            posts = generateSamplePosts()
            isLoading = false
        }
    }
    
    private func generateSamplePosts() -> [CommunityPost] {
        return [
            CommunityPost(
                id: "1",
                title: "Best Practices for Rigging Safety",
                content: "Safety is paramount in rigging. Let's share best practices to keep each other safe...",
                author: "John Doe",
                date: Date().addingTimeInterval(-7200),
                comments: 12,
                likes: 48
            ),
            CommunityPost(
                id: "2",
                title: "Tips for Efficient Crane Operation",
                content: "Efficiency can save time and money. What are your top tips for efficient crane operation?",
                author: "Jane Smith",
                date: Date().addingTimeInterval(-14400),
                comments: 8,
                likes: 35
            )
        ]
    }
}

struct CommunityEngagementView_Previews: PreviewProvider {
    static var previews: some View {
        CommunityEngagementView()
            .environmentObject(ThemeManager())
    }
}

struct CommunityPostCard: View {
    let post: CommunityPost
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            VStack(alignment: .leading, spacing: 4) {
                HStack {
                    Text(post.title)
                        .font(.headline)
                        .fontWeight(.semibold)
                        .foregroundColor(themeManager.primaryTextColor)
                    
                    Spacer()
                    
                    Text(formatDate(post.date))
                        .font(.caption)
                        .foregroundColor(themeManager.secondaryTextColor)
                }
                
                Text("By \(post.author)")
                    .font(.caption)
                    .foregroundColor(themeManager.mutedTextColor)
            }
            
            Text(post.content)
                .font(.body)
                .foregroundColor(themeManager.primaryTextColor)
                .lineLimit(3)
                .padding(.top, 4)

            HStack(spacing: 16) {
                HStack(spacing: 4) {
                    Image(systemName: "heart.fill")
                        .foregroundColor(themeManager.accentColor)
                    
                    Text("\(post.likes)")
                        .font(.caption)
                        .foregroundColor(themeManager.secondaryTextColor)
                }
                
                HStack(spacing: 4) {
                    Image(systemName: "bubble.right.fill")
                        .foregroundColor(themeManager.accentColor)
                    
                    Text("\(post.comments)")
                        .font(.caption)
                        .foregroundColor(themeManager.secondaryTextColor)
                }
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
    
    private func formatDate(_ date: Date) -> String {
        let formatter = RelativeDateTimeFormatter()
        formatter.unitsStyle = .abbreviated
        return formatter.localizedString(for: date, relativeTo: Date())
    }
}

struct CommunityPost: Identifiable {
    let id: String
    let title: String
    let content: String
    let author: String
    let date: Date
    let comments: Int
    let likes: Int
}

struct ComposePostView: View {
    let onSave: (CommunityPost) -> Void
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var themeManager: ThemeManager
    
    @State private var title = ""
    @State private var content = ""
    
    var body: some View {
        NavigationView {
            ZStack {
                themeManager.backgroundGradient.ignoresSafeArea()
                
                VStack(spacing: 24) {
                    VStack(alignment: .leading, spacing: 16) {
                        CustomTextField(
                            title: "Post Title",
                            text: $title,
                            icon: "pencil"
                        )
                        
                        ZStack(alignment: .topLeading) {
                            RoundedRectangle(cornerRadius: 8)
                                .fill(themeManager.surfaceColor)
                                .frame(minHeight: 200)
                            
                            if content.isEmpty {
                                Text("Share your thoughts, ideas, or questions here...")
                                    .foregroundColor(themeManager.mutedTextColor)
                                    .padding(8)
                            }
                            
                            TextEditor(text: $content)
                                .padding(8)
                                .background(Color.clear)
                                .foregroundColor(themeManager.primaryTextColor)
                                .scrollContentBackground(.hidden)
                        }
                    }
                    .cardStyle(themeManager)
                    
                    Button("Post") {
                        savePost()
                    }
                    .buttonStyle(PrimaryButtonStyle(themeManager: themeManager))
                    .disabled(title.isEmpty || content.isEmpty)

                    Spacer()
                }
                .padding()
            }
            .navigationTitle("Compose Post")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        dismiss()
                    }
                    .foregroundColor(themeManager.accentColor)
                }
            }
        }
    }
    
    private func savePost() {
        let newPost = CommunityPost(
            id: UUID().uuidString,
            title: title,
            content: content,
            author: "Current User",
            date: Date(),
            comments: 0,
            likes: 0
        )
        
        onSave(newPost)
        dismiss()
    }
}
