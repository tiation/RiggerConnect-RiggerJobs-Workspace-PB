import SwiftUI

struct JobApplicationView: View {
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var themeManager: ThemeManager
    @EnvironmentObject var authManager: AuthenticationManager
    
    let job: Job
    
    @State private var coverLetter = ""
    @State private var selectedRate = ""
    @State private var availableStartDate = Date()
    @State private var isSubmitting = false
    @State private var showSuccessAlert = false
    @State private var showErrorAlert = false
    @State private var errorMessage = ""
    @State private var attachedDocuments: [AttachedDocument] = []
    @State private var showDocumentPicker = false
    
    var body: some View {
        NavigationView {
            ZStack {
                themeManager.backgroundGradient.ignoresSafeArea()
                
                ScrollView {
                    VStack(spacing: 24) {
                        // Job Summary
                        jobSummarySection
                        
                        // Application Form
                        applicationFormSection
                        
                        // Documents Section
                        documentsSection
                        
                        // Submit Button
                        submitButtonSection
                        
                        Spacer(minLength: 100)
                    }
                    .padding()
                }
            }
            .navigationTitle("Apply for Job")
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
        .alert("Application Submitted", isPresented: $showSuccessAlert) {
            Button("OK") { dismiss() }
        } message: {
            Text("Your application has been submitted successfully. You'll be notified if the employer is interested.")
        }
        .alert("Error", isPresented: $showErrorAlert) {
            Button("OK") { }
        } message: {
            Text(errorMessage)
        }
    }
    
    private var jobSummarySection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Job Details")
                .font(.headline)
                .fontWeight(.semibold)
                .foregroundColor(themeManager.primaryTextColor)
            
            VStack(alignment: .leading, spacing: 12) {
                Text(job.title)
                    .font(.title2)
                    .fontWeight(.bold)
                    .foregroundColor(themeManager.primaryTextColor)
                
                HStack {
                    Image(systemName: "building.2")
                        .foregroundColor(themeManager.accentColor)
                    Text(job.companyName)
                        .foregroundColor(themeManager.secondaryTextColor)
                    
                    Spacer()
                    
                    Text("$\(Int(job.payRange.min))-\(Int(job.payRange.max))/hr")
                        .font(.headline)
                        .foregroundColor(themeManager.successColor)
                }
                
                HStack {
                    Image(systemName: "location")
                        .foregroundColor(themeManager.accentColor)
                    Text("\(job.location.suburb), \(job.location.state)")
                        .foregroundColor(themeManager.secondaryTextColor)
                    
                    Spacer()
                    
                    Text(job.jobType.rawValue)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(themeManager.accentColor.opacity(0.2))
                        .cornerRadius(6)
                        .foregroundColor(themeManager.accentColor)
                        .font(.caption)
                }
            }
        }
        .cardStyle(themeManager)
    }
    
    private var applicationFormSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Application Details")
                .font(.headline)
                .fontWeight(.semibold)
                .foregroundColor(themeManager.primaryTextColor)
            
            // Hourly Rate
            VStack(alignment: .leading, spacing: 8) {
                Text("Your Hourly Rate (AUD)")
                    .font(.subheadline)
                    .foregroundColor(themeManager.secondaryTextColor)
                
                CustomTextField(
                    title: "Rate",
                    text: $selectedRate,
                    icon: "dollarsign",
                    keyboardType: .numberPad
                )
            }
            
            // Available Start Date
            VStack(alignment: .leading, spacing: 8) {
                Text("Available Start Date")
                    .font(.subheadline)
                    .foregroundColor(themeManager.secondaryTextColor)
                
                DatePicker(
                    "Start Date",
                    selection: $availableStartDate,
                    in: Date()...,
                    displayedComponents: .date
                )
                .datePickerStyle(CompactDatePickerStyle())
                .padding()
                .background(themeManager.surfaceColor)
                .cornerRadius(8)
                .foregroundColor(themeManager.primaryTextColor)
            }
            
            // Cover Letter
            VStack(alignment: .leading, spacing: 8) {
                Text("Cover Letter")
                    .font(.subheadline)
                    .foregroundColor(themeManager.secondaryTextColor)
                
                ZStack(alignment: .topLeading) {
                    RoundedRectangle(cornerRadius: 8)
                        .fill(themeManager.surfaceColor)
                        .frame(minHeight: 120)
                    
                    if coverLetter.isEmpty {
                        Text("Tell the employer why you're the right fit for this job...")
                            .foregroundColor(themeManager.mutedTextColor)
                            .padding()
                    }
                    
                    TextEditor(text: $coverLetter)
                        .padding(8)
                        .background(Color.clear)
                        .foregroundColor(themeManager.primaryTextColor)
                        .scrollContentBackground(.hidden)
                }
                
                HStack {
                    Spacer()
                    Text("\(coverLetter.count)/500")
                        .font(.caption)
                        .foregroundColor(themeManager.mutedTextColor)
                }
            }
        }
        .cardStyle(themeManager)
    }
    
    private var documentsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Documents")
                    .font(.headline)
                    .fontWeight(.semibold)
                    .foregroundColor(themeManager.primaryTextColor)
                
                Spacer()
                
                Button("Add Document") {
                    showDocumentPicker = true
                }
                .foregroundColor(themeManager.accentColor)
                .fontWeight(.medium)
            }
            
            if attachedDocuments.isEmpty {
                VStack(spacing: 12) {
                    Image(systemName: "doc.badge.plus")
                        .font(.largeTitle)
                        .foregroundColor(themeManager.mutedTextColor)
                    
                    Text("No documents attached")
                        .foregroundColor(themeManager.mutedTextColor)
                        .font(.body)
                    
                    Text("Add your resume, certifications, or other relevant documents")
                        .foregroundColor(themeManager.mutedTextColor)
                        .font(.caption)
                        .multilineTextAlignment(.center)
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, 24)
            } else {
                LazyVStack(spacing: 8) {
                    ForEach(attachedDocuments, id: \.id) { document in
                        DocumentRowView(document: document) {
                            removeDocument(document)
                        }
                    }
                }
            }
        }
        .cardStyle(themeManager)
    }
    
    private var submitButtonSection: some View {
        VStack(spacing: 16) {
            Button("Submit Application") {
                submitApplication()
            }
            .buttonStyle(PrimaryButtonStyle(themeManager: themeManager))
            .disabled(isSubmitting || coverLetter.isEmpty || selectedRate.isEmpty)
            
            if isSubmitting {
                ProgressView("Submitting...")
                    .foregroundColor(themeManager.secondaryTextColor)
            }
        }
        .padding(.horizontal)
    }
    
    private func removeDocument(_ document: AttachedDocument) {
        attachedDocuments.removeAll { $0.id == document.id }
    }
    
    private func submitApplication() {
        guard let user = authManager.currentUser else {
            errorMessage = "Please log in to submit an application"
            showErrorAlert = true
            return
        }
        
        guard !coverLetter.isEmpty, !selectedRate.isEmpty else {
            errorMessage = "Please fill in all required fields"
            showErrorAlert = true
            return
        }
        
        guard let hourlyRate = Double(selectedRate), hourlyRate > 0 else {
            errorMessage = "Please enter a valid hourly rate"
            showErrorAlert = true
            return
        }
        
        isSubmitting = true
        
        let application = JobApplication(
            id: UUID().uuidString,
            jobId: job.id,
            workerId: user.id,
            status: .submitted,
            coverLetter: coverLetter,
            proposedRate: hourlyRate,
            availableStartDate: availableStartDate,
            attachedDocuments: attachedDocuments.map { $0.fileName },
            submittedAt: Date(),
            updatedAt: Date()
        )
        
        // Simulate API call
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
            isSubmitting = false
            showSuccessAlert = true
        }
    }
}

struct DocumentRowView: View {
    let document: AttachedDocument
    let onRemove: () -> Void
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        HStack {
            Image(systemName: documentIcon)
                .foregroundColor(themeManager.accentColor)
                .frame(width: 20)
            
            VStack(alignment: .leading, spacing: 2) {
                Text(document.fileName)
                    .font(.subheadline)
                    .foregroundColor(themeManager.primaryTextColor)
                
                Text(document.fileSize)
                    .font(.caption)
                    .foregroundColor(themeManager.secondaryTextColor)
            }
            
            Spacer()
            
            Button(action: onRemove) {
                Image(systemName: "xmark.circle.fill")
                    .foregroundColor(themeManager.errorColor)
            }
        }
        .padding()
        .background(themeManager.surfaceColor)
        .cornerRadius(8)
    }
    
    private var documentIcon: String {
        let fileExtension = document.fileName.lowercased().split(separator: ".").last ?? ""
        
        switch fileExtension {
        case "pdf":
            return "doc.richtext"
        case "doc", "docx":
            return "doc.text"
        case "jpg", "jpeg", "png":
            return "photo"
        default:
            return "doc"
        }
    }
}

struct AttachedDocument {
    let id = UUID()
    let fileName: String
    let fileSize: String
    let fileType: String
}

struct JobApplication {
    let id: String
    let jobId: String
    let workerId: String
    let status: ApplicationStatus
    let coverLetter: String
    let proposedRate: Double
    let availableStartDate: Date
    let attachedDocuments: [String]
    let submittedAt: Date
    let updatedAt: Date
}

enum ApplicationStatus: String, CaseIterable {
    case submitted = "Submitted"
    case reviewing = "Under Review"
    case shortlisted = "Shortlisted"
    case interviewed = "Interviewed"
    case accepted = "Accepted"
    case rejected = "Rejected"
    case withdrawn = "Withdrawn"
}

struct JobApplicationView_Previews: PreviewProvider {
    static var previews: some View {
        JobApplicationView(job: Job())
            .environmentObject(ThemeManager())
            .environmentObject(AuthenticationManager())
    }
}
