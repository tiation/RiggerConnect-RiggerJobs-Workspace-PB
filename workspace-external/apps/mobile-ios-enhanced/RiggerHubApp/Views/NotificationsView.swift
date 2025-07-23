import SwiftUI

struct NotificationsView: View {
    @EnvironmentObject var themeManager: ThemeManager
    @EnvironmentObject var authManager: AuthenticationManager
    
    @State private var notifications: [AppNotification] = []
    @State private var isLoading = false
    @State private var selectedFilter: NotificationFilter = .all
    @State private var showSettings = false
    @State private var hasUnreadNotifications = true
    
    var filteredNotifications: [AppNotification] {
        let filtered = selectedFilter == .all ? notifications : notifications.filter { $0.type == selectedFilter.type }
        return filtered.sorted { $0.timestamp > $1.timestamp }
    }
    
    var unreadCount: Int {
        notifications.filter { !$0.isRead }.count
    }
    
    var body: some View {
        NavigationView {
            ZStack {
                themeManager.backgroundGradient.ignoresSafeArea()
                
                VStack(spacing: 0) {
                    // Filter Bar
                    filterBar
                    
                    // Content
                    if isLoading {
                        loadingView
                    } else if notifications.isEmpty {
                        emptyStateView
                    } else if filteredNotifications.isEmpty {
                        noResultsView
                    } else {
                        notificationsList
                    }
                }
            }
            .navigationTitle("Notifications")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItemGroup(placement: .navigationBarTrailing) {
                    if unreadCount > 0 {
                        Button("Mark All Read") {
                            markAllAsRead()
                        }
                        .font(.caption)
                        .foregroundColor(themeManager.accentColor)
                    }
                    
                    Button(action: { showSettings = true }) {
                        Image(systemName: "gear")
                            .foregroundColor(themeManager.accentColor)
                    }
                }
            }
            .onAppear {
                loadNotifications()
            }
            .refreshable {
                loadNotifications()
            }
        }
        .sheet(isPresented: $showSettings) {
            NotificationSettingsView()
        }
    }
    
    private var filterBar: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 12) {
                ForEach(NotificationFilter.allCases, id: \.self) { filter in
                    FilterChip(
                        title: filter.displayName,
                        count: filter == .all ? notifications.count : notifications.filter { $0.type == filter.type }.count,
                        isSelected: selectedFilter == filter,
                        action: { selectedFilter = filter }
                    )
                }
            }
            .padding(.horizontal)
        }
        .padding(.vertical, 12)
        .background(themeManager.backgroundColor.opacity(0.8))
    }
    
    private var loadingView: some View {
        VStack(spacing: 16) {
            ProgressView()
                .tint(themeManager.accentColor)
            Text("Loading notifications...")
                .foregroundColor(themeManager.secondaryTextColor)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
    
    private var emptyStateView: some View {
        VStack(spacing: 24) {
            Image(systemName: "bell.slash")
                .font(.system(size: 60))
                .foregroundColor(themeManager.mutedTextColor)
            
            VStack(spacing: 8) {
                Text("No Notifications")
                    .font(.title2)
                    .fontWeight(.semibold)
                    .foregroundColor(themeManager.primaryTextColor)
                
                Text("You're all caught up! Check back later for new updates.")
                    .font(.body)
                    .multilineTextAlignment(.center)
                    .foregroundColor(themeManager.secondaryTextColor)
                    .padding(.horizontal, 40)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
    
    private var noResultsView: some View {
        VStack(spacing: 20) {
            Image(systemName: "magnifyingglass")
                .font(.system(size: 60))
                .foregroundColor(themeManager.mutedTextColor)
            
            Text("No \(selectedFilter.displayName)")
                .font(.title2)
                .fontWeight(.semibold)
                .foregroundColor(themeManager.primaryTextColor)
            
            Text("Try selecting a different filter to see more notifications")
                .font(.body)
                .multilineTextAlignment(.center)
                .foregroundColor(themeManager.secondaryTextColor)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
    
    private var notificationsList: some View {
        ScrollView {
            LazyVStack(spacing: 0) {
                ForEach(filteredNotifications, id: \.id) { notification in
                    NotificationRow(notification: notification) { action in
                        handleNotificationAction(action, for: notification)
                    }
                    .onAppear {
                        if !notification.isRead {
                            markAsRead(notification)
                        }
                    }
                }
            }
            .padding(.vertical, 8)
        }
    }
    
    private func handleNotificationAction(_ action: NotificationAction, for notification: AppNotification) {
        switch action {
        case .tap:
            handleNotificationTap(notification)
        case .delete:
            deleteNotification(notification)
        case .markRead:
            markAsRead(notification)
        }
    }
    
    private func handleNotificationTap(_ notification: AppNotification) {
        switch notification.type {
        case .jobMatch:
            // Navigate to job details
            print("Navigate to job: \(notification.actionData ?? "")")
        case .applicationUpdate:
            // Navigate to application details
            print("Navigate to application: \(notification.actionData ?? "")")
        case .message:
            // Navigate to messages
            print("Navigate to messages")
        case .payment:
            // Navigate to earnings
            print("Navigate to earnings")
        case .system:
            // Handle system notification
            print("System notification tapped")
        }
    }
    
    private func markAsRead(_ notification: AppNotification) {
        if let index = notifications.firstIndex(where: { $0.id == notification.id }) {
            notifications[index].isRead = true
        }
    }
    
    private func markAllAsRead() {
        notifications = notifications.map { notification in
            var updated = notification
            updated.isRead = true
            return updated
        }
    }
    
    private func deleteNotification(_ notification: AppNotification) {
        notifications.removeAll { $0.id == notification.id }
    }
    
    private func loadNotifications() {
        guard let user = authManager.currentUser else { return }
        
        isLoading = true
        
        // Simulate API call
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            notifications = generateSampleNotifications()
            isLoading = false
        }
    }
    
    private func generateSampleNotifications() -> [AppNotification] {
        return [
            AppNotification(
                id: "1",
                type: .jobMatch,
                title: "New Job Match",
                message: "3 new crane operator jobs match your alert 'Crane Operator Jobs'",
                timestamp: Date().addingTimeInterval(-300),
                isRead: false,
                actionData: "job_alert_1"
            ),
            AppNotification(
                id: "2",
                type: .applicationUpdate,
                title: "Application Update",
                message: "Your application for 'Senior Rigger - Perth Construction Co.' has been shortlisted",
                timestamp: Date().addingTimeInterval(-3600),
                isRead: false,
                actionData: "application_123"
            ),
            AppNotification(
                id: "3",
                type: .payment,
                title: "Payment Received",
                message: "$1,250.00 has been deposited for 'Crane Operation - City Tower'",
                timestamp: Date().addingTimeInterval(-7200),
                isRead: true,
                actionData: "payment_456"
            ),
            AppNotification(
                id: "4",
                type: .message,
                title: "New Message",
                message: "Perth Construction Co. sent you a message about your application",
                timestamp: Date().addingTimeInterval(-14400),
                isRead: false,
                actionData: "message_789"
            ),
            AppNotification(
                id: "5",
                type: .system,
                title: "Profile Reminder",
                message: "Complete your profile to get better job matches (82% complete)",
                timestamp: Date().addingTimeInterval(-86400),
                isRead: true,
                actionData: nil
            ),
            AppNotification(
                id: "6",
                type: .jobMatch,
                title: "Job Alert Match",
                message: "2 new rigging jobs in Fremantle match your preferences",
                timestamp: Date().addingTimeInterval(-172800),
                isRead: true,
                actionData: "job_alert_2"
            ),
            AppNotification(
                id: "7",
                type: .applicationUpdate,
                title: "Application Status",
                message: "Unfortunately, your application for 'General Laborer' was not successful",
                timestamp: Date().addingTimeInterval(-259200),
                isRead: true,
                actionData: "application_321"
            )
        ]
    }
}

struct NotificationRow: View {
    let notification: AppNotification
    let onAction: (NotificationAction) -> Void
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        HStack(alignment: .top, spacing: 16) {
            // Icon
            ZStack {
                Circle()
                    .fill(notification.type.color.opacity(0.2))
                    .frame(width: 44, height: 44)
                
                Image(systemName: notification.type.iconName)
                    .foregroundColor(notification.type.color)
                    .font(.system(size: 18, weight: .medium))
            }
            
            // Content
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        Text(notification.title)
                            .font(.subheadline)
                            .fontWeight(.semibold)
                            .foregroundColor(themeManager.primaryTextColor)
                        
                        Text(notification.message)
                            .font(.body)
                            .foregroundColor(themeManager.secondaryTextColor)
                            .lineLimit(3)
                    }
                    
                    Spacer()
                    
                    VStack(alignment: .trailing, spacing: 8) {
                        Text(formatTimestamp(notification.timestamp))
                            .font(.caption)
                            .foregroundColor(themeManager.mutedTextColor)
                        
                        if !notification.isRead {
                            Circle()
                                .fill(themeManager.accentColor)
                                .frame(width: 8, height: 8)
                        }
                        
                        Button(action: { onAction(.delete) }) {
                            Image(systemName: "xmark")
                                .foregroundColor(themeManager.mutedTextColor)
                                .font(.caption)
                        }
                    }
                }
            }
        }
        .padding()
        .background(notification.isRead ? Color.clear : themeManager.surfaceColor.opacity(0.3))
        .contentShape(Rectangle())
        .onTapGesture {
            onAction(.tap)
        }
        .swipeActions(edge: .trailing, allowsFullSwipe: true) {
            Button("Delete") {
                onAction(.delete)
            }
            .tint(themeManager.errorColor)
            
            if !notification.isRead {
                Button("Mark Read") {
                    onAction(.markRead)
                }
                .tint(themeManager.accentColor)
            }
        }
    }
    
    private func formatTimestamp(_ timestamp: Date) -> String {
        let formatter = RelativeDateTimeFormatter()
        formatter.unitsStyle = .abbreviated
        return formatter.localizedString(for: timestamp, relativeTo: Date())
    }
}

struct FilterChip: View {
    let title: String
    let count: Int
    let isSelected: Bool
    let action: () -> Void
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        Button(action: action) {
            HStack(spacing: 6) {
                Text(title)
                    .font(.subheadline)
                    .fontWeight(.medium)
                
                if count > 0 {
                    Text("\(count)")
                        .font(.caption)
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(isSelected ? Color.black.opacity(0.2) : themeManager.accentColor.opacity(0.2))
                        .foregroundColor(isSelected ? Color.white : themeManager.accentColor)
                        .cornerRadius(8)
                }
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(isSelected ? themeManager.accentColor : themeManager.surfaceColor)
            .foregroundColor(isSelected ? .black : themeManager.primaryTextColor)
            .cornerRadius(20)
        }
    }
}

struct NotificationSettingsView: View {
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var themeManager: ThemeManager
    
    @State private var jobMatchNotifications = true
    @State private var applicationUpdates = true
    @State private var messageNotifications = true
    @State private var paymentNotifications = true
    @State private var systemNotifications = false
    @State private var pushNotifications = true
    @State private var emailNotifications = true
    
    var body: some View {
        NavigationView {
            ZStack {
                themeManager.backgroundGradient.ignoresSafeArea()
                
                ScrollView {
                    VStack(spacing: 24) {
                        // Notification Types
                        notificationTypesSection
                        
                        // Delivery Methods
                        deliveryMethodsSection
                        
                        // Quiet Hours
                        quietHoursSection
                        
                        Spacer(minLength: 100)
                    }
                    .padding()
                }
            }
            .navigationTitle("Notification Settings")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                    .foregroundColor(themeManager.accentColor)
                }
            }
        }
    }
    
    private var notificationTypesSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Notification Types")
                .font(.headline)
                .fontWeight(.semibold)
                .foregroundColor(themeManager.primaryTextColor)
            
            VStack(spacing: 16) {
                NotificationToggle(
                    title: "Job Matches",
                    subtitle: "New jobs matching your alerts",
                    icon: "briefcase.fill",
                    color: themeManager.accentColor,
                    isOn: $jobMatchNotifications
                )
                
                NotificationToggle(
                    title: "Application Updates",
                    subtitle: "Status changes on your applications",
                    icon: "doc.text.fill",
                    color: Color.orange,
                    isOn: $applicationUpdates
                )
                
                NotificationToggle(
                    title: "Messages",
                    subtitle: "New messages from employers",
                    icon: "message.fill",
                    color: Color.blue,
                    isOn: $messageNotifications
                )
                
                NotificationToggle(
                    title: "Payments",
                    subtitle: "Payment confirmations and updates",
                    icon: "dollarsign.circle.fill",
                    color: themeManager.successColor,
                    isOn: $paymentNotifications
                )
                
                NotificationToggle(
                    title: "System Updates",
                    subtitle: "App updates and maintenance notices",
                    icon: "gear.badge",
                    color: themeManager.mutedTextColor,
                    isOn: $systemNotifications
                )
            }
        }
        .cardStyle(themeManager)
    }
    
    private var deliveryMethodsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Delivery Methods")
                .font(.headline)
                .fontWeight(.semibold)
                .foregroundColor(themeManager.primaryTextColor)
            
            VStack(spacing: 16) {
                HStack {
                    HStack(spacing: 12) {
                        Image(systemName: "iphone")
                            .foregroundColor(themeManager.accentColor)
                            .frame(width: 24)
                        
                        VStack(alignment: .leading, spacing: 2) {
                            Text("Push Notifications")
                                .font(.subheadline)
                                .foregroundColor(themeManager.primaryTextColor)
                            
                            Text("Instant notifications on your device")
                                .font(.caption)
                                .foregroundColor(themeManager.secondaryTextColor)
                        }
                    }
                    
                    Spacer()
                    
                    Toggle("", isOn: $pushNotifications)
                        .toggleStyle(SwitchToggleStyle(tint: themeManager.accentColor))
                }
                
                HStack {
                    HStack(spacing: 12) {
                        Image(systemName: "envelope.fill")
                            .foregroundColor(Color.blue)
                            .frame(width: 24)
                        
                        VStack(alignment: .leading, spacing: 2) {
                            Text("Email Notifications")
                                .font(.subheadline)
                                .foregroundColor(themeManager.primaryTextColor)
                            
                            Text("Weekly summary via email")
                                .font(.caption)
                                .foregroundColor(themeManager.secondaryTextColor)
                        }
                    }
                    
                    Spacer()
                    
                    Toggle("", isOn: $emailNotifications)
                        .toggleStyle(SwitchToggleStyle(tint: themeManager.accentColor))
                }
            }
        }
        .cardStyle(themeManager)
    }
    
    private var quietHoursSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Quiet Hours")
                .font(.headline)
                .fontWeight(.semibold)
                .foregroundColor(themeManager.primaryTextColor)
            
            VStack(spacing: 12) {
                Text("Pause non-urgent notifications during these hours")
                    .font(.body)
                    .foregroundColor(themeManager.secondaryTextColor)
                
                HStack {
                    Text("From 10:00 PM to 7:00 AM")
                        .font(.subheadline)
                        .foregroundColor(themeManager.primaryTextColor)
                    
                    Spacer()
                    
                    Button("Change") {
                        // TODO: Show time picker
                    }
                    .font(.subheadline)
                    .foregroundColor(themeManager.accentColor)
                }
            }
        }
        .cardStyle(themeManager)
    }
}

struct NotificationToggle: View {
    let title: String
    let subtitle: String
    let icon: String
    let color: Color
    @Binding var isOn: Bool
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        HStack {
            HStack(spacing: 12) {
                Image(systemName: icon)
                    .foregroundColor(color)
                    .frame(width: 24)
                
                VStack(alignment: .leading, spacing: 2) {
                    Text(title)
                        .font(.subheadline)
                        .foregroundColor(themeManager.primaryTextColor)
                    
                    Text(subtitle)
                        .font(.caption)
                        .foregroundColor(themeManager.secondaryTextColor)
                }
            }
            
            Spacer()
            
            Toggle("", isOn: $isOn)
                .toggleStyle(SwitchToggleStyle(tint: themeManager.accentColor))
        }
    }
}

// MARK: - Data Models

struct AppNotification: Identifiable {
    let id: String
    let type: NotificationType
    let title: String
    let message: String
    let timestamp: Date
    var isRead: Bool
    let actionData: String?
}

enum NotificationType: CaseIterable {
    case jobMatch, applicationUpdate, message, payment, system
    
    var iconName: String {
        switch self {
        case .jobMatch: return "briefcase.fill"
        case .applicationUpdate: return "doc.text.fill"
        case .message: return "message.fill"
        case .payment: return "dollarsign.circle.fill"
        case .system: return "gear.badge"
        }
    }
    
    var color: Color {
        switch self {
        case .jobMatch: return Color.cyan
        case .applicationUpdate: return Color.orange
        case .message: return Color.blue
        case .payment: return Color.green
        case .system: return Color.gray
        }
    }
}

enum NotificationFilter: CaseIterable {
    case all, jobMatch, applicationUpdate, message, payment, system
    
    var displayName: String {
        switch self {
        case .all: return "All"
        case .jobMatch: return "Jobs"
        case .applicationUpdate: return "Applications"
        case .message: return "Messages"
        case .payment: return "Payments"
        case .system: return "System"
        }
    }
    
    var type: NotificationType? {
        switch self {
        case .all: return nil
        case .jobMatch: return .jobMatch
        case .applicationUpdate: return .applicationUpdate
        case .message: return .message
        case .payment: return .payment
        case .system: return .system
        }
    }
}

enum NotificationAction {
    case tap, delete, markRead
}

struct NotificationsView_Previews: PreviewProvider {
    static var previews: some View {
        NotificationsView()
            .environmentObject(ThemeManager())
            .environmentObject(AuthenticationManager())
    }
}
