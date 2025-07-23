import SwiftUI

struct CompanyProfileScreen: View {
    @EnvironmentObject var authManager: AuthenticationManager
    @Environment(\.dismiss) private var dismiss
    
    @State private var companyName = "Acme Technologies"
    @State private var companyDescription = "Leading provider of innovative technology solutions"
    @State private var website = "https://acmetech.com"
    @State private var industry = "Technology"
    @State private var companySize = "50-200 employees"
    @State private var location = "San Francisco, CA"
    @State private var foundedYear = "2015"
    @State private var contactEmail = "hr@acmetech.com"
    @State private var contactPhone = "+1 (555) 123-4567"
    
    @State private var isEditing = false
    @State private var showingImagePicker = false
    @State private var selectedImage: UIImage?
    
    private let industries = [
        "Technology", "Healthcare", "Finance", "Education", "Manufacturing",
        "Retail", "Construction", "Transportation", "Energy", "Media",
        "Real Estate", "Hospitality", "Agriculture", "Government", "Non-profit"
    ]
    
    private let companySizes = [
        "1-10 employees", "11-50 employees", "51-200 employees",
        "201-500 employees", "501-1000 employees", "1000+ employees"
    ]
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 24) {
                    // Company Logo Section
                    VStack(spacing: 16) {
                        Button(action: { showingImagePicker = true }) {
                            ZStack {
                                if let selectedImage = selectedImage {
                                    Image(uiImage: selectedImage)
                                        .resizable()
                                        .aspectRatio(contentMode: .fill)
                                        .frame(width: 120, height: 120)
                                        .clipShape(RoundedRectangle(cornerRadius: 16))
                                } else {
                                    RoundedRectangle(cornerRadius: 16)
                                        .fill(Color.gray.opacity(0.3))
                                        .frame(width: 120, height: 120)
                                        .overlay(
                                            VStack {
                                                Image(systemName: "building.2")
                                                    .font(.system(size: 40))
                                                    .foregroundColor(.gray)
                                                Text("Add Logo")
                                                    .font(.caption)
                                                    .foregroundColor(.gray)
                                            }
                                        )
                                }
                                
                                if isEditing {
                                    RoundedRectangle(cornerRadius: 16)
                                        .fill(Color.black.opacity(0.5))
                                        .frame(width: 120, height: 120)
                                        .overlay(
                                            Image(systemName: "camera")
                                                .font(.title2)
                                                .foregroundColor(.white)
                                        )
                                }
                            }
                        }
                        .disabled(!isEditing)
                        
                        Text(companyName)
                            .font(.title)
                            .fontWeight(.bold)
                            .foregroundColor(.white)
                    }
                    
                    // Company Information Form
                    VStack(spacing: 20) {
                        // Basic Information
                        GroupBox {
                            VStack(spacing: 16) {
                                ProfileField(
                                    title: "Company Name",
                                    text: $companyName,
                                    isEditing: isEditing
                                )
                                
                                ProfileField(
                                    title: "Description",
                                    text: $companyDescription,
                                    isEditing: isEditing,
                                    isMultiline: true
                                )
                                
                                ProfileField(
                                    title: "Website",
                                    text: $website,
                                    isEditing: isEditing,
                                    keyboardType: .URL
                                )
                            }
                        } label: {
                            Text("Basic Information")
                                .font(.headline)
                                .foregroundColor(.white)
                        }
                        .backgroundStyle(Color.gray.opacity(0.1))
                        
                        // Company Details
                        GroupBox {
                            VStack(spacing: 16) {
                                VStack(alignment: .leading, spacing: 8) {
                                    Text("Industry")
                                        .font(.subheadline)
                                        .foregroundColor(.white)
                                    
                                    if isEditing {
                                        Picker("Industry", selection: $industry) {
                                            ForEach(industries, id: \.self) { industry in
                                                Text(industry).tag(industry)
                                            }
                                        }
                                        .pickerStyle(MenuPickerStyle())
                                        .foregroundColor(.cyan)
                                    } else {
                                        Text(industry)
                                            .foregroundColor(.gray)
                                            .frame(maxWidth: .infinity, alignment: .leading)
                                    }
                                }
                                
                                VStack(alignment: .leading, spacing: 8) {
                                    Text("Company Size")
                                        .font(.subheadline)
                                        .foregroundColor(.white)
                                    
                                    if isEditing {
                                        Picker("Company Size", selection: $companySize) {
                                            ForEach(companySizes, id: \.self) { size in
                                                Text(size).tag(size)
                                            }
                                        }
                                        .pickerStyle(MenuPickerStyle())
                                        .foregroundColor(.cyan)
                                    } else {
                                        Text(companySize)
                                            .foregroundColor(.gray)
                                            .frame(maxWidth: .infinity, alignment: .leading)
                                    }
                                }
                                
                                ProfileField(
                                    title: "Location",
                                    text: $location,
                                    isEditing: isEditing
                                )
                                
                                ProfileField(
                                    title: "Founded Year",
                                    text: $foundedYear,
                                    isEditing: isEditing,
                                    keyboardType: .numberPad
                                )
                            }
                        } label: {
                            Text("Company Details")
                                .font(.headline)
                                .foregroundColor(.white)
                        }
                        .backgroundStyle(Color.gray.opacity(0.1))
                        
                        // Contact Information
                        GroupBox {
                            VStack(spacing: 16) {
                                ProfileField(
                                    title: "Contact Email",
                                    text: $contactEmail,
                                    isEditing: isEditing,
                                    keyboardType: .emailAddress
                                )
                                
                                ProfileField(
                                    title: "Contact Phone",
                                    text: $contactPhone,
                                    isEditing: isEditing,
                                    keyboardType: .phonePad
                                )
                            }
                        } label: {
                            Text("Contact Information")
                                .font(.headline)
                                .foregroundColor(.white)
                        }
                        .backgroundStyle(Color.gray.opacity(0.1))
                        
                        // Action Buttons
                        if isEditing {
                            HStack(spacing: 12) {
                                Button("Cancel") {
                                    withAnimation {
                                        isEditing = false
                                        // Reset changes
                                        loadCompanyData()
                                    }
                                }
                                .foregroundColor(.gray)
                                .frame(maxWidth: .infinity)
                                .padding()
                                .background(Color.gray.opacity(0.3))
                                .cornerRadius(8)
                                
                                Button("Save Changes") {
                                    saveCompanyProfile()
                                    withAnimation {
                                        isEditing = false
                                    }
                                }
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
                                .cornerRadius(8)
                            }
                        }
                    }
                    .padding(.horizontal)
                }
                .padding(.vertical)
            }
            .background(Color.black)
            .navigationTitle("Company Profile")
            .navigationBarTitleDisplayMode(.inline)
            .navigationBarItems(
                leading: Button("Back") {
                    dismiss()
                }
                .foregroundColor(.cyan),
                trailing: Button(isEditing ? "Cancel" : "Edit") {
                    withAnimation {
                        if isEditing {
                            // Reset changes
                            loadCompanyData()
                        }
                        isEditing.toggle()
                    }
                }
                .foregroundColor(.cyan)
            )
        }
        .sheet(isPresented: $showingImagePicker) {
            ImagePicker(selectedImage: $selectedImage)
        }
        .onAppear {
            loadCompanyData()
        }
    }
    
    private func loadCompanyData() {
        // Load company data from your data source
        // This would typically come from your AuthenticationManager or API
    }
    
    private func saveCompanyProfile() {
        // Save company profile changes
        // This would typically save to your backend via AuthenticationManager or API
        print("Saving company profile...")
    }
}

struct ProfileField: View {
    let title: String
    @Binding var text: String
    let isEditing: Bool
    var isMultiline: Bool = false
    var keyboardType: UIKeyboardType = .default
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title)
                .font(.subheadline)
                .foregroundColor(.white)
            
            if isEditing {
                if isMultiline {
                    TextEditor(text: $text)
                        .frame(minHeight: 80)
                        .padding(8)
                        .background(Color.gray.opacity(0.2))
                        .cornerRadius(8)
                        .overlay(
                            RoundedRectangle(cornerRadius: 8)
                                .stroke(Color.cyan.opacity(0.5), lineWidth: 1)
                        )
                } else {
                    TextField(title, text: $text)
                        .textFieldStyle(NeonTextFieldStyle())
                        .keyboardType(keyboardType)
                }
            } else {
                Text(text.isEmpty ? "Not provided" : text)
                    .foregroundColor(text.isEmpty ? .gray.opacity(0.6) : .gray)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.vertical, 4)
            }
        }
    }
}

struct ImagePicker: UIViewControllerRepresentable {
    @Binding var selectedImage: UIImage?
    @Environment(\.dismiss) private var dismiss
    
    func makeUIViewController(context: Context) -> UIImagePickerController {
        let picker = UIImagePickerController()
        picker.delegate = context.coordinator
        picker.sourceType = .photoLibrary
        return picker
    }
    
    func updateUIViewController(_ uiViewController: UIImagePickerController, context: Context) {}
    
    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }
    
    class Coordinator: NSObject, UIImagePickerControllerDelegate, UINavigationControllerDelegate {
        let parent: ImagePicker
        
        init(_ parent: ImagePicker) {
            self.parent = parent
        }
        
        func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey: Any]) {
            if let image = info[.originalImage] as? UIImage {
                parent.selectedImage = image
            }
            parent.dismiss()
        }
        
        func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
            parent.dismiss()
        }
    }
}

#Preview {
    CompanyProfileScreen()
        .environmentObject(AuthenticationManager())
        .preferredColorScheme(.dark)
}
