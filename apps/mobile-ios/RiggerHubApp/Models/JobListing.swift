import Foundation

struct JobListing: Codable, Identifiable {
    let id: UUID
    var title: String
    var companyName: String
    var companyLogoURL: String?
    var description: String
    var requirements: [String]
    var responsibilities: [String]
    
    // Job Details
    var jobType: JobType
    var experienceLevel: ExperienceLevel
    var industry: Industry
    var location: JobLocation
    var isRemote: Bool
    var isUrgent: Bool
    
    // Compensation
    var salaryRange: SalaryRange
    var benefits: [String]
    var paymentTerms: PaymentTerms
    
    // Skills and Requirements
    var requiredSkills: [String]
    var preferredSkills: [String]
    var requiredCertifications: [String]
    var equipmentProvided: [String]
    
    // Timeline
    var startDate: Date
    var endDate: Date?
    var duration: String?
    var shiftDetails: ShiftDetails
    
    // Application Info
    var applicationDeadline: Date?
    var maxApplications: Int?
    var currentApplications: Int
    var applicationStatus: ApplicationStatus
    
    // Metadata
    var postedDate: Date
    var updatedDate: Date
    var isActive: Bool
    var companyId: UUID
    var contactEmail: String
    var contactPhone: String?
    
    init() {
        self.id = UUID()
        self.title = ""
        self.companyName = ""
        self.companyLogoURL = nil
        self.description = ""
        self.requirements = []
        self.responsibilities = []
        self.jobType = .fullTime
        self.experienceLevel = .intermediate
        self.industry = .construction
        self.location = JobLocation()
        self.isRemote = false
        self.isUrgent = false
        self.salaryRange = SalaryRange()
        self.benefits = []
        self.paymentTerms = .weekly
        self.requiredSkills = []
        self.preferredSkills = []
        self.requiredCertifications = []
        self.equipmentProvided = []
        self.startDate = Date()
        self.endDate = nil
        self.duration = nil
        self.shiftDetails = ShiftDetails()
        self.applicationDeadline = nil
        self.maxApplications = nil
        self.currentApplications = 0
        self.applicationStatus = .open
        self.postedDate = Date()
        self.updatedDate = Date()
        self.isActive = true
        self.companyId = UUID()
        self.contactEmail = ""
        self.contactPhone = nil
    }
    
    var formattedSalary: String {
        return salaryRange.displayString
    }
    
    var timePosted: String {
        let formatter = RelativeDateTimeFormatter()
        return formatter.localizedString(for: postedDate, relativeTo: Date())
    }
    
    var isExpired: Bool {
        guard let deadline = applicationDeadline else { return false }
        return Date() > deadline
    }
}

struct JobLocation: Codable {
    var address: String = ""
    var city: String = ""
    var state: String = ""
    var postalCode: String = ""
    var country: String = "Australia"
    var latitude: Double? = nil
    var longitude: Double? = nil
    var maxTravelDistance: Double? = nil
    
    var displayLocation: String {
        if city.isEmpty && state.isEmpty {
            return "Location TBD"
        } else if city.isEmpty {
            return state
        } else if state.isEmpty {
            return city
        } else {
            return "\(city), \(state)"
        }
    }
}

struct SalaryRange: Codable {
    var minAmount: Double = 0.0
    var maxAmount: Double = 0.0
    var currency: String = "AUD"
    var rateType: RateType = .hourly
    var isNegotiable: Bool = false
    
    var displayString: String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.currencyCode = currency
        formatter.maximumFractionDigits = 0
        
        let minFormatted = formatter.string(from: NSNumber(value: minAmount)) ?? "\(currency)\(Int(minAmount))"
        let maxFormatted = formatter.string(from: NSNumber(value: maxAmount)) ?? "\(currency)\(Int(maxAmount))"
        
        let negotiableText = isNegotiable ? " (Negotiable)" : ""
        
        if minAmount == maxAmount {
            return "\(minFormatted)/\(rateType.rawValue)\(negotiableText)"
        } else {
            return "\(minFormatted) - \(maxFormatted)/\(rateType.rawValue)\(negotiableText)"
        }
    }
}

struct ShiftDetails: Codable {
    var shiftType: ShiftType = .day
    var startTime: String = "07:00"
    var endTime: String = "17:00"
    var workDays: [WeekDay] = [.monday, .tuesday, .wednesday, .thursday, .friday]
    var totalHours: Double = 40.0
    var isFlexible: Bool = false
    var overtimeAvailable: Bool = false
    var breakDetails: String = ""
}

struct JobApplication: Codable, Identifiable {
    let id: UUID = UUID()
    var jobId: UUID
    var workerId: UUID
    var coverLetter: String
    var proposedRate: Double?
    var availability: String
    var applicationDate: Date
    var status: JobApplicationStatus
    var lastUpdated: Date
    var employerNotes: String?
    var workerNotes: String?
    
    init(jobId: UUID, workerId: UUID) {
        self.jobId = jobId
        self.workerId = workerId
        self.coverLetter = ""
        self.proposedRate = nil
        self.availability = ""
        self.applicationDate = Date()
        self.status = .pending
        self.lastUpdated = Date()
        self.employerNotes = nil
        self.workerNotes = nil
    }
}

// MARK: - Enums

enum JobType: String, CaseIterable, Codable {
    case fullTime = "Full Time"
    case partTime = "Part Time"
    case contract = "Contract"
    case temporary = "Temporary"
    case casual = "Casual"
    case emergency = "Emergency"
}

enum ExperienceLevel: String, CaseIterable, Codable {
    case entry = "Entry Level"
    case junior = "Junior"
    case intermediate = "Intermediate"
    case senior = "Senior"
    case expert = "Expert"
}

enum Industry: String, CaseIterable, Codable {
    case mining = "Mining"
    case construction = "Construction"
    case industrial = "Industrial"
    case marine = "Marine & Offshore"
    case entertainment = "Entertainment"
    case emergency = "Emergency Services"
    case transport = "Transport & Logistics"
}

enum RateType: String, CaseIterable, Codable {
    case hourly = "hour"
    case daily = "day"
    case weekly = "week"
    case monthly = "month"
    case project = "project"
}

enum PaymentTerms: String, CaseIterable, Codable {
    case weekly = "Weekly"
    case fortnightly = "Fortnightly"
    case monthly = "Monthly"
    case completion = "On Completion"
    case milestone = "Milestone Based"
}

enum ApplicationStatus: String, CaseIterable, Codable {
    case open = "Open"
    case closed = "Closed"
    case paused = "Paused"
    case filled = "Filled"
}

enum JobApplicationStatus: String, CaseIterable, Codable {
    case pending = "Pending"
    case reviewed = "Reviewed"
    case shortlisted = "Shortlisted"
    case interview = "Interview Scheduled"
    case offered = "Offered"
    case accepted = "Accepted"
    case rejected = "Rejected"
    case withdrawn = "Withdrawn"
}
