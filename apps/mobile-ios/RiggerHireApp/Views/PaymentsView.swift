import SwiftUI

struct PaymentsView: View {
    @State private var selectedPeriod: TimePeriod = .thisMonth
    @State private var paymentHistory: [PaymentRecord] = []
    @State private var isLoading = false
    
    enum TimePeriod: String, CaseIterable {
        case thisWeek = "This Week"
        case thisMonth = "This Month"
        case lastThreeMonths = "Last 3 Months"
        case thisYear = "This Year"
        
        var color: Color {
            switch self {
            case .thisWeek: return .green
            case .thisMonth: return .cyan
            case .lastThreeMonths: return .blue
            case .thisYear: return .purple
            }
        }
    }
    
    var body: some View {
        NavigationView {
            ZStack {
                Color.black.ignoresSafeArea()
                
                VStack(spacing: 0) {
                    // Period Filter
                    periodFilterSection
                    
                    // Summary Cards
                    summarySection
                    
                    // Payment History
                    if isLoading {
                        loadingView
                    } else if paymentHistory.isEmpty {
                        emptyStateView
                    } else {
                        paymentHistoryList
                    }
                }
            }
            .navigationTitle("Payments")
            .navigationBarTitleDisplayMode(.large)
            .preferredColorScheme(.dark)
            .onAppear {
                loadPaymentData()
            }
        }
    }
    
    private var periodFilterSection: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 12) {
                ForEach(TimePeriod.allCases, id: \.self) { period in
                    PeriodButton(
                        title: period.rawValue,
                        isSelected: selectedPeriod == period,
                        color: period.color
                    ) {
                        selectedPeriod = period
                        loadPaymentData()
                    }
                }
            }
            .padding(.horizontal)
        }
        .padding(.vertical, 12)
        .background(Color.black.opacity(0.8))
    }
    
    private var summarySection: some View {
        LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2), spacing: 15) {
            SummaryCard(
                title: "Total Earned",
                value: "$2,485.50",
                subtitle: "This month",
                color: .green,
                icon: "dollarsign.circle.fill"
            )
            
            SummaryCard(
                title: "Pending",
                value: "$340.00",
                subtitle: "2 payments",
                color: .orange,
                icon: "clock.circle.fill"
            )
            
            SummaryCard(
                title: "Jobs Completed",
                value: "8",
                subtitle: "This month",
                color: .blue,
                icon: "checkmark.circle.fill"
            )
            
            SummaryCard(
                title: "Average Rate",
                value: "$85.50",
                subtitle: "Per hour",
                color: .purple,
                icon: "chart.line.uptrend.xyaxis.circle.fill"
            )
        }
        .padding(.horizontal)
        .padding(.bottom, 20)
    }
    
    private var paymentHistoryList: some View {
        ScrollView {
            LazyVStack(spacing: 12) {
                ForEach(paymentHistory) { payment in
                    PaymentCard(payment: payment)
                }
            }
            .padding(.horizontal)
            .padding(.bottom, 20)
        }
    }
    
    private var loadingView: some View {
        VStack(spacing: 20) {
            ProgressView()
                .progressViewStyle(CircularProgressViewStyle(tint: .cyan))
                .scaleEffect(1.5)
            
            Text("Loading payments...")
                .foregroundColor(.gray)
                .font(.subheadline)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
    
    private var emptyStateView: some View {
        VStack(spacing: 30) {
            VStack(spacing: 20) {
                Image(systemName: "creditcard.circle")
                    .font(.system(size: 80))
                    .foregroundColor(.cyan.opacity(0.6))
                
                VStack(spacing: 8) {
                    Text("No Payments Yet")
                        .font(.title2)
                        .fontWeight(.semibold)
                        .foregroundColor(.white)
                    
                    Text("Complete jobs to start earning and see your payment history here")
                        .font(.subheadline)
                        .foregroundColor(.gray)
                        .multilineTextAlignment(.center)
                }
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .padding()
    }
    
    private func loadPaymentData() {
        isLoading = true
        
        // Simulate API call
        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
            paymentHistory = samplePaymentData
            isLoading = false
        }
    }
    
    private var samplePaymentData: [PaymentRecord] {
        [
            PaymentRecord(
                id: UUID(),
                jobTitle: "Mobile Crane Operation - Mining Site",
                amount: 680.00,
                currency: "AUD",
                status: .completed,
                paymentDate: Date().addingTimeInterval(-86400),
                processingFee: 20.40,
                jobDuration: "8 hours",
                hourlyRate: 85.00
            ),
            PaymentRecord(
                id: UUID(),
                jobTitle: "Rigging - Port Installation",
                amount: 450.00,
                currency: "AUD",
                status: .pending,
                paymentDate: Date().addingTimeInterval(-172800),
                processingFee: 13.50,
                jobDuration: "6 hours",
                hourlyRate: 75.00
            ),
            PaymentRecord(
                id: UUID(),
                jobTitle: "Tower Crane Operation",
                amount: 1200.00,
                currency: "AUD",
                status: .completed,
                paymentDate: Date().addingTimeInterval(-259200),
                processingFee: 36.00,
                jobDuration: "2 days",
                hourlyRate: 85.00
            )
        ]
    }
}

struct PeriodButton: View {
    let title: String
    let isSelected: Bool
    let color: Color
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.subheadline)
                .fontWeight(.medium)
                .foregroundColor(isSelected ? .black : color)
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
                .background(
                    RoundedRectangle(cornerRadius: 20)
                        .fill(isSelected ? color : Color.black.opacity(0.3))
                        .overlay(
                            RoundedRectangle(cornerRadius: 20)
                                .stroke(color.opacity(0.5), lineWidth: 1)
                        )
                )
        }
        .buttonStyle(PlainButtonStyle())
    }
}

struct SummaryCard: View {
    let title: String
    let value: String
    let subtitle: String
    let color: Color
    let icon: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: icon)
                    .font(.title2)
                    .foregroundColor(color)
                
                Spacer()
            }
            
            VStack(alignment: .leading, spacing: 4) {
                Text(value)
                    .font(.title2)
                    .fontWeight(.bold)
                    .foregroundColor(.white)
                
                Text(title)
                    .font(.subheadline)
                    .foregroundColor(.white)
                
                Text(subtitle)
                    .font(.caption)
                    .foregroundColor(.gray)
            }
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(Color.black.opacity(0.3))
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(color.opacity(0.2), lineWidth: 1)
                )
        )
        .shadow(color: color.opacity(0.1), radius: 5)
    }
}

struct PaymentCard: View {
    let payment: PaymentRecord
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Header
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text(payment.jobTitle)
                        .font(.headline)
                        .fontWeight(.semibold)
                        .foregroundColor(.white)
                        .lineLimit(2)
                    
                    Text(DateFormatter.medium.string(from: payment.paymentDate))
                        .font(.caption)
                        .foregroundColor(.gray)
                }
                
                Spacer()
                
                PaymentStatusBadge(status: payment.status)
            }
            
            // Payment Details
            VStack(spacing: 8) {
                PaymentDetailRow(
                    title: "Amount",
                    value: String(format: "$%.2f %@", payment.amount, payment.currency),
                    highlighted: true
                )
                
                PaymentDetailRow(
                    title: "Processing Fee",
                    value: String(format: "-$%.2f", payment.processingFee)
                )
                
                PaymentDetailRow(
                    title: "Net Amount",
                    value: String(format: "$%.2f", payment.amount - payment.processingFee),
                    highlighted: true,
                    color: .green
                )
                
                PaymentDetailRow(
                    title: "Duration",
                    value: payment.jobDuration
                )
                
                PaymentDetailRow(
                    title: "Hourly Rate",
                    value: String(format: "$%.2f/hr", payment.hourlyRate)
                )
            }
            .padding(.top, 8)
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(Color.black.opacity(0.3))
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(Color.cyan.opacity(0.2), lineWidth: 1)
                )
        )
        .shadow(color: .cyan.opacity(0.1), radius: 5)
    }
}

struct PaymentStatusBadge: View {
    let status: PaymentStatus
    
    var body: some View {
        Text(status.displayName)
            .font(.caption)
            .fontWeight(.semibold)
            .foregroundColor(.white)
            .padding(.horizontal, 10)
            .padding(.vertical, 6)
            .background(Color(status.color).opacity(0.8))
            .cornerRadius(8)
    }
}

struct PaymentDetailRow: View {
    let title: String
    let value: String
    var highlighted: Bool = false
    var color: Color = .white
    
    var body: some View {
        HStack {
            Text(title)
                .font(.caption)
                .foregroundColor(.gray)
            
            Spacer()
            
            Text(value)
                .font(highlighted ? .subheadline : .caption)
                .fontWeight(highlighted ? .semibold : .regular)
                .foregroundColor(highlighted ? color : .white)
        }
    }
}

// MARK: - Supporting Models

struct PaymentRecord: Identifiable {
    let id: UUID
    let jobTitle: String
    let amount: Double
    let currency: String
    let status: PaymentStatus
    let paymentDate: Date
    let processingFee: Double
    let jobDuration: String
    let hourlyRate: Double
}

enum PaymentStatus: String, Codable {
    case pending = "pending"
    case processing = "processing"
    case completed = "completed"
    case failed = "failed"
    
    var displayName: String {
        switch self {
        case .pending: return "Pending"
        case .processing: return "Processing"
        case .completed: return "Completed"
        case .failed: return "Failed"
        }
    }
    
    var color: String {
        switch self {
        case .pending: return "orange"
        case .processing: return "blue"
        case .completed: return "green"
        case .failed: return "red"
        }
    }
}

// MARK: - Date Formatter Extension

extension DateFormatter {
    static let medium: DateFormatter = {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        formatter.timeStyle = .none
        return formatter
    }()
}

#Preview {
    PaymentsView()
        .preferredColorScheme(.dark)
}
