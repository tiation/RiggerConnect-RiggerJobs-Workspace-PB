import SwiftUI
import Charts

struct EarningsDashboardView: View {
    @EnvironmentObject var themeManager: ThemeManager
    @EnvironmentObject var authManager: AuthenticationManager
    
    @State private var selectedTimeframe: TimeframePeriod = .thisMonth
    @State private var isLoading = false
    @State private var earningsData: EarningsData?
    @State private var showPaymentHistory = false
    @State private var showTaxDocument = false
    
    var body: some View {
        NavigationView {
            ZStack {
                themeManager.backgroundGradient.ignoresSafeArea()
                
                ScrollView {
                    VStack(spacing: 24) {
                        // Summary Cards
                        summaryCardsSection
                        
                        // Timeframe Selector
                        timeframeSelectorSection
                        
                        // Earnings Chart
                        earningsChartSection
                        
                        // Recent Payments
                        recentPaymentsSection
                        
                        // Quick Actions
                        quickActionsSection
                        
                        Spacer(minLength: 100)
                    }
                    .padding()
                }
            }
            .navigationTitle("Earnings")
            .navigationBarTitleDisplayMode(.large)
            .onAppear {
                loadEarningsData()
            }
            .refreshable {
                loadEarningsData()
            }
        }
        .sheet(isPresented: $showPaymentHistory) {
            PaymentHistoryView()
        }
        .sheet(isPresented: $showTaxDocument) {
            TaxDocumentView()
        }
    }
    
    private var summaryCardsSection: some View {
        VStack(spacing: 16) {
            // Main Earnings Card
            HStack(spacing: 16) {
                // Total Earnings
                EarningsCard(
                    title: "Total Earnings",
                    amount: earningsData?.totalEarnings ?? 0,
                    subtitle: selectedTimeframe.displayName,
                    color: themeManager.successColor,
                    icon: "dollarsign.circle.fill"
                )
                
                // Hours Worked
                StatsCard(
                    title: "Hours Worked",
                    value: "\(earningsData?.hoursWorked ?? 0)h",
                    subtitle: selectedTimeframe.displayName,
                    color: themeManager.accentColor,
                    icon: "clock.fill"
                )
            }
            
            HStack(spacing: 16) {
                // Average Rate
                StatsCard(
                    title: "Avg Rate",
                    value: "$\(Int(earningsData?.averageHourlyRate ?? 0))/hr",
                    subtitle: "Across all jobs",
                    color: Color.magenta,
                    icon: "chart.line.uptrend.xyaxis"
                )
                
                // Jobs Completed
                StatsCard(
                    title: "Jobs Done",
                    value: "\(earningsData?.jobsCompleted ?? 0)",
                    subtitle: selectedTimeframe.displayName,
                    color: Color.orange,
                    icon: "checkmark.circle.fill"
                )
            }
        }
    }
    
    private var timeframeSelectorSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("View Period")
                .font(.headline)
                .fontWeight(.semibold)
                .foregroundColor(themeManager.primaryTextColor)
                .padding(.horizontal)
            
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    ForEach(TimeframePeriod.allCases, id: \.self) { period in
                        TimeframeChip(
                            period: period,
                            isSelected: selectedTimeframe == period,
                            action: {
                                selectedTimeframe = period
                                loadEarningsData()
                            }
                        )
                    }
                }
                .padding(.horizontal)
            }
        }
    }
    
    private var earningsChartSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Earnings Trend")
                .font(.headline)
                .fontWeight(.semibold)
                .foregroundColor(themeManager.primaryTextColor)
            
            if let chartData = earningsData?.chartData {
                Chart(chartData) { item in
                    LineMark(
                        x: .value("Date", item.date),
                        y: .value("Earnings", item.amount)
                    )
                    .foregroundStyle(themeManager.accentColor)
                    .lineStyle(StrokeStyle(lineWidth: 3))
                    
                    AreaMark(
                        x: .value("Date", item.date),
                        y: .value("Earnings", item.amount)
                    )
                    .foregroundStyle(
                        LinearGradient(
                            colors: [themeManager.accentColor.opacity(0.3), .clear],
                            startPoint: .top,
                            endPoint: .bottom
                        )
                    )
                }
                .frame(height: 200)
                .chartYAxis {
                    AxisMarks(position: .leading) { value in
                        AxisValueLabel {
                            if let amount = value.as(Double.self) {
                                Text("$\(Int(amount))")
                                    .foregroundColor(themeManager.secondaryTextColor)
                                    .font(.caption)
                            }
                        }
                        AxisGridLine()
                            .foregroundStyle(themeManager.mutedTextColor.opacity(0.3))
                    }
                }
                .chartXAxis {
                    AxisMarks(position: .bottom) { value in
                        AxisValueLabel {
                            if let date = value.as(Date.self) {
                                Text(formatChartDate(date))
                                    .foregroundColor(themeManager.secondaryTextColor)
                                    .font(.caption)
                            }
                        }
                    }
                }
            } else {
                RoundedRectangle(cornerRadius: 12)
                    .fill(themeManager.surfaceColor)
                    .frame(height: 200)
                    .overlay(
                        VStack {
                            Image(systemName: "chart.line.uptrend.xyaxis")
                                .font(.largeTitle)
                                .foregroundColor(themeManager.mutedTextColor)
                            Text("No data available")
                                .foregroundColor(themeManager.mutedTextColor)
                        }
                    )
            }
        }
        .cardStyle(themeManager)
    }
    
    private var recentPaymentsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Recent Payments")
                    .font(.headline)
                    .fontWeight(.semibold)
                    .foregroundColor(themeManager.primaryTextColor)
                
                Spacer()
                
                Button("View All") {
                    showPaymentHistory = true
                }
                .foregroundColor(themeManager.accentColor)
                .fontWeight(.medium)
            }
            
            if let payments = earningsData?.recentPayments, !payments.isEmpty {
                LazyVStack(spacing: 12) {
                    ForEach(payments.prefix(5), id: \.id) { payment in
                        PaymentRowView(payment: payment)
                    }
                }
            } else {
                VStack(spacing: 12) {
                    Image(systemName: "creditcard")
                        .font(.largeTitle)
                        .foregroundColor(themeManager.mutedTextColor)
                    
                    Text("No recent payments")
                        .foregroundColor(themeManager.mutedTextColor)
                        .font(.body)
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, 24)
            }
        }
        .cardStyle(themeManager)
    }
    
    private var quickActionsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Quick Actions")
                .font(.headline)
                .fontWeight(.semibold)
                .foregroundColor(themeManager.primaryTextColor)
            
            LazyVGrid(columns: [
                GridItem(.flexible()),
                GridItem(.flexible())
            ], spacing: 12) {
                ActionButton(
                    title: "Payment History",
                    subtitle: "View all payments",
                    icon: "list.bullet",
                    color: themeManager.accentColor,
                    action: { showPaymentHistory = true }
                )
                
                ActionButton(
                    title: "Tax Documents",
                    subtitle: "Download statements",
                    icon: "doc.text",
                    color: Color.magenta,
                    action: { showTaxDocument = true }
                )
                
                ActionButton(
                    title: "Export Data",
                    subtitle: "CSV or PDF",
                    icon: "square.and.arrow.up",
                    color: Color.orange,
                    action: { exportEarningsData() }
                )
                
                ActionButton(
                    title: "Set Goals",
                    subtitle: "Financial targets",
                    icon: "target",
                    color: themeManager.successColor,
                    action: { /* Navigate to goals */ }
                )
            }
        }
        .cardStyle(themeManager)
    }
    
    private func loadEarningsData() {
        guard let user = authManager.currentUser else { return }
        
        isLoading = true
        
        // Simulate API call
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            earningsData = generateSampleEarningsData(for: selectedTimeframe)
            isLoading = false
        }
    }
    
    private func exportEarningsData() {
        // TODO: Implement data export functionality
        print("Exporting earnings data...")
    }
    
    private func formatChartDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        switch selectedTimeframe {
        case .thisWeek:
            formatter.dateFormat = "E"
        case .thisMonth:
            formatter.dateFormat = "MMM d"
        case .thisYear:
            formatter.dateFormat = "MMM"
        case .allTime:
            formatter.dateFormat = "yyyy"
        }
        return formatter.string(from: date)
    }
    
    private func generateSampleEarningsData(for timeframe: TimeframePeriod) -> EarningsData {
        let calendar = Calendar.current
        let now = Date()
        
        var chartData: [EarningsChartData] = []
        var totalEarnings: Double = 0
        let hoursWorked = Int.random(in: 80...200)
        
        // Generate sample chart data
        let daysBack = timeframe.daysBack
        for i in 0..<min(daysBack, 30) {
            let date = calendar.date(byAdding: .day, value: -i, to: now) ?? now
            let amount = Double.random(in: 100...800)
            chartData.append(EarningsChartData(date: date, amount: amount))
            totalEarnings += amount
        }
        
        chartData.sort { $0.date < $1.date }
        
        let recentPayments = generateSamplePayments()
        
        return EarningsData(
            totalEarnings: totalEarnings,
            hoursWorked: hoursWorked,
            averageHourlyRate: totalEarnings / Double(hoursWorked),
            jobsCompleted: Int.random(in: 5...25),
            chartData: chartData,
            recentPayments: recentPayments
        )
    }
    
    private func generateSamplePayments() -> [PaymentRecord] {
        return [
            PaymentRecord(
                id: "1",
                amount: 1250.0,
                jobTitle: "Crane Operation - City Tower",
                companyName: "Perth Construction Co.",
                date: Date().addingTimeInterval(-86400 * 2),
                status: .completed
            ),
            PaymentRecord(
                id: "2",
                amount: 875.50,
                jobTitle: "Rigging Work - Industrial Site",
                companyName: "Heavy Lift Solutions",
                date: Date().addingTimeInterval(-86400 * 7),
                status: .completed
            ),
            PaymentRecord(
                id: "3",
                amount: 420.0,
                jobTitle: "Equipment Setup",
                companyName: "Build Right Construction",
                date: Date().addingTimeInterval(-86400 * 14),
                status: .pending
            )
        ]
    }
}

struct EarningsCard: View {
    let title: String
    let amount: Double
    let subtitle: String
    let color: Color
    let icon: String
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: icon)
                    .foregroundColor(color)
                    .font(.title2)
                
                Spacer()
                
                Text(subtitle)
                    .font(.caption)
                    .foregroundColor(themeManager.secondaryTextColor)
            }
            
            VStack(alignment: .leading, spacing: 4) {
                Text("$\(String(format: "%.2f", amount))")
                    .font(.title)
                    .fontWeight(.bold)
                    .foregroundColor(themeManager.primaryTextColor)
                
                Text(title)
                    .font(.subheadline)
                    .foregroundColor(themeManager.secondaryTextColor)
            }
        }
        .padding()
        .background(themeManager.surfaceColor)
        .cornerRadius(12)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(color.opacity(0.3), lineWidth: 1)
        )
    }
}

struct StatsCard: View {
    let title: String
    let value: String
    let subtitle: String
    let color: Color
    let icon: String
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: icon)
                    .foregroundColor(color)
                    .font(.title2)
                
                Spacer()
            }
            
            VStack(alignment: .leading, spacing: 4) {
                Text(value)
                    .font(.title2)
                    .fontWeight(.bold)
                    .foregroundColor(themeManager.primaryTextColor)
                
                Text(title)
                    .font(.caption)
                    .foregroundColor(themeManager.secondaryTextColor)
                
                Text(subtitle)
                    .font(.caption2)
                    .foregroundColor(themeManager.mutedTextColor)
            }
        }
        .padding()
        .background(themeManager.surfaceColor)
        .cornerRadius(12)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(color.opacity(0.3), lineWidth: 1)
        )
    }
}

struct TimeframeChip: View {
    let period: TimeframePeriod
    let isSelected: Bool
    let action: () -> Void
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        Button(action: action) {
            Text(period.displayName)
                .font(.subheadline)
                .fontWeight(.medium)
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
                .background(isSelected ? themeManager.accentColor : themeManager.surfaceColor)
                .foregroundColor(isSelected ? .black : themeManager.primaryTextColor)
                .cornerRadius(20)
        }
    }
}

struct PaymentRowView: View {
    let payment: PaymentRecord
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text(payment.jobTitle)
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .foregroundColor(themeManager.primaryTextColor)
                
                Text(payment.companyName)
                    .font(.caption)
                    .foregroundColor(themeManager.secondaryTextColor)
                
                Text(formatPaymentDate(payment.date))
                    .font(.caption)
                    .foregroundColor(themeManager.mutedTextColor)
            }
            
            Spacer()
            
            VStack(alignment: .trailing, spacing: 4) {
                Text("$\(String(format: "%.2f", payment.amount))")
                    .font(.subheadline)
                    .fontWeight(.semibold)
                    .foregroundColor(themeManager.successColor)
                
                PaymentStatusBadge(status: payment.status)
            }
        }
        .padding(.vertical, 8)
    }
    
    private func formatPaymentDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateStyle = .short
        return formatter.string(from: date)
    }
}

struct PaymentStatusBadge: View {
    let status: PaymentStatus
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        Text(status.rawValue)
            .font(.caption2)
            .fontWeight(.medium)
            .padding(.horizontal, 6)
            .padding(.vertical, 2)
            .background(statusColor.opacity(0.2))
            .foregroundColor(statusColor)
            .cornerRadius(4)
    }
    
    private var statusColor: Color {
        switch status {
        case .completed:
            return themeManager.successColor
        case .pending:
            return Color.orange
        case .processing:
            return themeManager.accentColor
        case .failed:
            return themeManager.errorColor
        }
    }
}

struct ActionButton: View {
    let title: String
    let subtitle: String
    let icon: String
    let color: Color
    let action: () -> Void
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        Button(action: action) {
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    Image(systemName: icon)
                        .foregroundColor(color)
                        .font(.title3)
                    
                    Spacer()
                }
                
                VStack(alignment: .leading, spacing: 2) {
                    Text(title)
                        .font(.subheadline)
                        .fontWeight(.medium)
                        .foregroundColor(themeManager.primaryTextColor)
                    
                    Text(subtitle)
                        .font(.caption)
                        .foregroundColor(themeManager.secondaryTextColor)
                }
            }
            .padding()
            .background(themeManager.surfaceColor)
            .cornerRadius(10)
            .overlay(
                RoundedRectangle(cornerRadius: 10)
                    .stroke(color.opacity(0.3), lineWidth: 1)
            )
        }
    }
}

// MARK: - Data Models

struct EarningsData {
    let totalEarnings: Double
    let hoursWorked: Int
    let averageHourlyRate: Double
    let jobsCompleted: Int
    let chartData: [EarningsChartData]
    let recentPayments: [PaymentRecord]
}

struct EarningsChartData {
    let date: Date
    let amount: Double
}

struct PaymentRecord {
    let id: String
    let amount: Double
    let jobTitle: String
    let companyName: String
    let date: Date
    let status: PaymentStatus
}

enum PaymentStatus: String, CaseIterable {
    case completed = "Paid"
    case pending = "Pending"
    case processing = "Processing"
    case failed = "Failed"
}

enum TimeframePeriod: CaseIterable {
    case thisWeek
    case thisMonth
    case thisYear
    case allTime
    
    var displayName: String {
        switch self {
        case .thisWeek: return "This Week"
        case .thisMonth: return "This Month"
        case .thisYear: return "This Year"
        case .allTime: return "All Time"
        }
    }
    
    var daysBack: Int {
        switch self {
        case .thisWeek: return 7
        case .thisMonth: return 30
        case .thisYear: return 365
        case .allTime: return 1000
        }
    }
}

struct EarningsDashboardView_Previews: PreviewProvider {
    static var previews: some View {
        EarningsDashboardView()
            .environmentObject(ThemeManager())
            .environmentObject(AuthenticationManager())
    }
}
