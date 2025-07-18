import UIKit

class RiggerJobsViewController: UIViewController {
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
    }
    
    private func setupUI() {
        view.backgroundColor = UIColor(red: 0.04, green: 0.04, blue: 0.04, alpha: 1.0) // Dark theme
        
        // Title
        let titleLabel = UILabel()
        titleLabel.text = "RiggerJobs"
        titleLabel.font = UIFont.boldSystemFont(ofSize: 32)
        titleLabel.textColor = UIColor(red: 0.0, green: 1.0, blue: 1.0, alpha: 1.0) // Cyan
        titleLabel.textAlignment = .center
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(titleLabel)
        
        // Subtitle
        let subtitleLabel = UILabel()
        subtitleLabel.text = "Worker Portal"
        subtitleLabel.font = UIFont.systemFont(ofSize: 18)
        subtitleLabel.textColor = UIColor.white
        subtitleLabel.textAlignment = .center
        subtitleLabel.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(subtitleLabel)
        
        // Tagline
        let taglineLabel = UILabel()
        taglineLabel.text = "Find Your Next Rigging Assignment"
        taglineLabel.font = UIFont.systemFont(ofSize: 14)
        taglineLabel.textColor = UIColor.white.withAlphaComponent(0.7)
        taglineLabel.textAlignment = .center
        taglineLabel.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(taglineLabel)
        
        // Stats Stack View
        let statsStackView = UIStackView()
        statsStackView.axis = .horizontal
        statsStackView.distribution = .fillEqually
        statsStackView.spacing = 12
        statsStackView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(statsStackView)
        
        // Stats Cards
        let availableJobsCard = createStatCard(number: "247", label: "Available Jobs")
        let avgSalaryCard = createStatCard(number: "$85k", label: "Avg. Salary")
        let safetyRateCard = createStatCard(number: "98%", label: "Safety Rate")
        
        statsStackView.addArrangedSubview(availableJobsCard)
        statsStackView.addArrangedSubview(avgSalaryCard)
        statsStackView.addArrangedSubview(safetyRateCard)
        
        // Feature Cards
        let scrollView = UIScrollView()
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(scrollView)
        
        let contentView = UIView()
        contentView.translatesAutoresizingMaskIntoConstraints = false
        scrollView.addSubview(contentView)
        
        // Feature Cards Stack
        let featuresStackView = UIStackView()
        featuresStackView.axis = .vertical
        featuresStackView.spacing = 16
        featuresStackView.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(featuresStackView)
        
        // Add feature cards
        let jobSearchCard = createFeatureCard(icon: "🔍", title: "Job Search", description: "Browse mining and construction rigging opportunities across WA")
        let profileCard = createFeatureCard(icon: "👨‍🔧", title: "Worker Profile", description: "Manage certifications, skills, and availability")
        let updatesCard = createFeatureCard(icon: "📱", title: "Real-time Updates", description: "Get instant notifications for job matches and updates")
        let earningsCard = createFeatureCard(icon: "💰", title: "Earnings Tracker", description: "Monitor income, job history, and performance metrics")
        let safetyCard = createFeatureCard(icon: "🛡️", title: "Safety Compliance", description: "Track safety certifications and compliance requirements")
        let locationCard = createFeatureCard(icon: "📍", title: "Location Services", description: "Find jobs near you with integrated mapping")
        
        featuresStackView.addArrangedSubview(jobSearchCard)
        featuresStackView.addArrangedSubview(profileCard)
        featuresStackView.addArrangedSubview(updatesCard)
        featuresStackView.addArrangedSubview(earningsCard)
        featuresStackView.addArrangedSubview(safetyCard)
        featuresStackView.addArrangedSubview(locationCard)
        
        // Primary Button
        let primaryButton = UIButton(type: .system)
        primaryButton.setTitle("Start Job Search", for: .normal)
        primaryButton.backgroundColor = UIColor(red: 0.0, green: 1.0, blue: 1.0, alpha: 1.0)
        primaryButton.setTitleColor(UIColor.black, for: .normal)
        primaryButton.titleLabel?.font = UIFont.boldSystemFont(ofSize: 18)
        primaryButton.layer.cornerRadius = 12
        primaryButton.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(primaryButton)
        
        primaryButton.addTarget(self, action: #selector(startJobSearchTapped), for: .touchUpInside)
        
        // Footer
        let footerLabel = UILabel()
        footerLabel.text = "Connecting riggers with WA mining & construction industry\nPowered by Tiation • Enterprise-grade platform"
        footerLabel.font = UIFont.systemFont(ofSize: 12)
        footerLabel.textColor = UIColor.white.withAlphaComponent(0.6)
        footerLabel.textAlignment = .center
        footerLabel.numberOfLines = 0
        footerLabel.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(footerLabel)
        
        // Constraints
        NSLayoutConstraint.activate([
            // Title
            titleLabel.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 30),
            titleLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            
            // Subtitle
            subtitleLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 8),
            subtitleLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            
            // Tagline
            taglineLabel.topAnchor.constraint(equalTo: subtitleLabel.bottomAnchor, constant: 8),
            taglineLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            
            // Stats
            statsStackView.topAnchor.constraint(equalTo: taglineLabel.bottomAnchor, constant: 30),
            statsStackView.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 16),
            statsStackView.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -16),
            statsStackView.heightAnchor.constraint(equalToConstant: 80),
            
            // Scroll View
            scrollView.topAnchor.constraint(equalTo: statsStackView.bottomAnchor, constant: 20),
            scrollView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            scrollView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            scrollView.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor),
            
            // Content View
            contentView.topAnchor.constraint(equalTo: scrollView.topAnchor),
            contentView.leadingAnchor.constraint(equalTo: scrollView.leadingAnchor),
            contentView.trailingAnchor.constraint(equalTo: scrollView.trailingAnchor),
            contentView.bottomAnchor.constraint(equalTo: scrollView.bottomAnchor),
            contentView.widthAnchor.constraint(equalTo: scrollView.widthAnchor),
            
            // Features Stack
            featuresStackView.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 20),
            featuresStackView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            featuresStackView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            
            // Primary Button
            primaryButton.topAnchor.constraint(equalTo: featuresStackView.bottomAnchor, constant: 30),
            primaryButton.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            primaryButton.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            primaryButton.heightAnchor.constraint(equalToConstant: 50),
            
            // Footer
            footerLabel.topAnchor.constraint(equalTo: primaryButton.bottomAnchor, constant: 30),
            footerLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            footerLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            footerLabel.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -20)
        ])
    }
    
    private func createStatCard(number: String, label: String) -> UIView {
        let card = UIView()
        card.backgroundColor = UIColor(red: 0.1, green: 0.1, blue: 0.1, alpha: 1.0)
        card.layer.cornerRadius = 12
        card.layer.borderWidth = 1
        card.layer.borderColor = UIColor(red: 0.0, green: 1.0, blue: 1.0, alpha: 1.0).cgColor
        
        let numberLabel = UILabel()
        numberLabel.text = number
        numberLabel.font = UIFont.boldSystemFont(ofSize: 20)
        numberLabel.textColor = UIColor(red: 0.0, green: 1.0, blue: 1.0, alpha: 1.0)
        numberLabel.textAlignment = .center
        numberLabel.translatesAutoresizingMaskIntoConstraints = false
        card.addSubview(numberLabel)
        
        let labelLabel = UILabel()
        labelLabel.text = label
        labelLabel.font = UIFont.systemFont(ofSize: 10)
        labelLabel.textColor = UIColor.white.withAlphaComponent(0.8)
        labelLabel.textAlignment = .center
        labelLabel.translatesAutoresizingMaskIntoConstraints = false
        card.addSubview(labelLabel)
        
        NSLayoutConstraint.activate([
            numberLabel.centerXAnchor.constraint(equalTo: card.centerXAnchor),
            numberLabel.centerYAnchor.constraint(equalTo: card.centerYAnchor, constant: -8),
            
            labelLabel.centerXAnchor.constraint(equalTo: card.centerXAnchor),
            labelLabel.topAnchor.constraint(equalTo: numberLabel.bottomAnchor, constant: 4)
        ])
        
        return card
    }
    
    private func createFeatureCard(icon: String, title: String, description: String) -> UIView {
        let card = UIView()
        card.backgroundColor = UIColor(red: 0.1, green: 0.1, blue: 0.1, alpha: 1.0)
        card.layer.cornerRadius = 16
        card.layer.borderWidth = 1
        card.layer.borderColor = UIColor(red: 0.0, green: 1.0, blue: 1.0, alpha: 1.0).cgColor
        card.translatesAutoresizingMaskIntoConstraints = false
        
        let iconLabel = UILabel()
        iconLabel.text = icon
        iconLabel.font = UIFont.systemFont(ofSize: 32)
        iconLabel.translatesAutoresizingMaskIntoConstraints = false
        card.addSubview(iconLabel)
        
        let titleLabel = UILabel()
        titleLabel.text = title
        titleLabel.font = UIFont.boldSystemFont(ofSize: 18)
        titleLabel.textColor = UIColor.white
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        card.addSubview(titleLabel)
        
        let descriptionLabel = UILabel()
        descriptionLabel.text = description
        descriptionLabel.font = UIFont.systemFont(ofSize: 14)
        descriptionLabel.textColor = UIColor.white.withAlphaComponent(0.8)
        descriptionLabel.numberOfLines = 0
        descriptionLabel.translatesAutoresizingMaskIntoConstraints = false
        card.addSubview(descriptionLabel)
        
        NSLayoutConstraint.activate([
            card.heightAnchor.constraint(greaterThanOrEqualToConstant: 120),
            
            iconLabel.topAnchor.constraint(equalTo: card.topAnchor, constant: 20),
            iconLabel.leadingAnchor.constraint(equalTo: card.leadingAnchor, constant: 20),
            
            titleLabel.topAnchor.constraint(equalTo: iconLabel.bottomAnchor, constant: 12),
            titleLabel.leadingAnchor.constraint(equalTo: card.leadingAnchor, constant: 20),
            titleLabel.trailingAnchor.constraint(equalTo: card.trailingAnchor, constant: -20),
            
            descriptionLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 8),
            descriptionLabel.leadingAnchor.constraint(equalTo: card.leadingAnchor, constant: 20),
            descriptionLabel.trailingAnchor.constraint(equalTo: card.trailingAnchor, constant: -20),
            descriptionLabel.bottomAnchor.constraint(equalTo: card.bottomAnchor, constant: -20)
        ])
        
        return card
    }
    
    @objc private func startJobSearchTapped() {
        let alert = UIAlertController(title: "RiggerJobs", message: "Ready to start your job search in the WA mining and construction industry!", preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "Let's Go!", style: .default, handler: nil))
        present(alert, animated: true)
    }
}

// Scene Delegate for iOS 13+
class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?
    
    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        guard let windowScene = (scene as? UIWindowScene) else { return }
        
        window = UIWindow(windowScene: windowScene)
        let viewController = RiggerJobsViewController()
        window?.rootViewController = viewController
        window?.makeKeyAndVisible()
    }
}

// App Delegate
class AppDelegate: UIResponder, UIApplicationDelegate {
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        return true
    }
    
    func application(_ application: UIApplication, configurationForConnecting connectingSceneSession: UISceneSession, options: UIScene.ConnectionOptions) -> UISceneConfiguration {
        return UISceneConfiguration(name: "Default Configuration", sessionRole: connectingSceneSession.role)
    }
}

// Main entry point
UIApplicationMain(
    CommandLine.argc,
    CommandLine.unsafeArgv,
    NSStringFromClass(UIApplication.self),
    NSStringFromClass(AppDelegate.self)
)
