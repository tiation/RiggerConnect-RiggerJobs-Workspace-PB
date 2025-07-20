import Foundation

// ANSI color codes for terminal output
struct Colors {
    static let orange = "\u{001B}[38;5;208m"
    static let blue = "\u{001B}[34m"
    static let green = "\u{001B}[32m"
    static let yellow = "\u{001B}[33m"
    static let red = "\u{001B}[31m"
    static let reset = "\u{001B}[0m"
    static let bold = "\u{001B}[1m"
}

// Simple terminal UI demonstration
class RiggerConnectDemo {
    var isAuthenticated = false
    var currentUser: String?
    
    func run() {
        clearScreen()
        showSplashScreen()
        Thread.sleep(forTimeInterval: 2)
        
        while true {
            if !isAuthenticated {
                showLoginScreen()
            } else {
                showMainMenu()
            }
        }
    }
    
    func clearScreen() {
        print("\u{001B}[2J\u{001B}[H", terminator: "")
    }
    
    func showSplashScreen() {
        print("""
        \(Colors.orange)
        ╔═══════════════════════════════════════════╗
        ║                                           ║
        ║           RIGGERCONNECT iOS               ║
        ║                                           ║
        ║     🏗️  Pilbara's Premier Rigging         ║
        ║         Solution                          ║
        ║                                           ║
        ╚═══════════════════════════════════════════╝
        \(Colors.reset)
        
        Loading...
        """)
    }
    
    func showLoginScreen() {
        clearScreen()
        print("""
        \(Colors.orange)═══════════════════════════════════════════\(Colors.reset)
        \(Colors.bold)📱 RiggerConnect - Login\(Colors.reset)
        \(Colors.orange)═══════════════════════════════════════════\(Colors.reset)
        
        Welcome! Please login to continue.
        
        Demo Credentials:
        📧 Email: rigger@demo.com
        🔑 Password: demo123
        
        Press ENTER to login with demo credentials...
        """)
        
        _ = readLine()
        
        print("\n🔄 Authenticating...")
        Thread.sleep(forTimeInterval: 1)
        print("✅ Login successful!")
        
        isAuthenticated = true
        currentUser = "John Rigger"
        Thread.sleep(forTimeInterval: 1)
    }
    
    func showMainMenu() {
        clearScreen()
        print("""
        \(Colors.orange)═══════════════════════════════════════════\(Colors.reset)
        \(Colors.bold)🏗️  RiggerConnect - Main Menu\(Colors.reset)
        \(Colors.orange)═══════════════════════════════════════════\(Colors.reset)
        
        Welcome, \(currentUser ?? "User")! 👷
        
        \(Colors.blue)📋 Available Jobs (5 new)\(Colors.reset)
        ├─ 1. View Available Jobs
        ├─ 2. My Active Jobs (2)
        ├─ 3. Job History
        └─ 4. Quick Apply
        
        \(Colors.green)👤 Profile\(Colors.reset)
        ├─ 5. My Certifications
        ├─ 6. Update Profile
        └─ 7. Earnings: $12,450 this month
        
        \(Colors.yellow)🔔 Notifications (3)\(Colors.reset)
        └─ 8. View Notifications
        
        \(Colors.red)9. Logout\(Colors.reset)
        
        Choose an option (1-9): 
        """, terminator: "")
        
        if let choice = readLine() {
            handleMainMenuChoice(choice)
        }
    }
    
    func handleMainMenuChoice(_ choice: String) {
        switch choice {
        case "1":
            showAvailableJobs()
        case "2":
            showMyJobs()
        case "9":
            logout()
        default:
            print("\n⚠️  Feature coming soon!")
            Thread.sleep(forTimeInterval: 2)
        }
    }
    
    func showAvailableJobs() {
        clearScreen()
        print("""
        \(Colors.orange)═══════════════════════════════════════════\(Colors.reset)
        \(Colors.bold)📋 Available Jobs - Pilbara Region\(Colors.reset)
        \(Colors.orange)═══════════════════════════════════════════\(Colors.reset)
        
        🔍 Showing jobs within 100km of your location
        
        \(Colors.green)1. 🚨 URGENT - Emergency Equipment Move\(Colors.reset)
           📍 Tom Price | 💰 $120.00/hr | ⭐ Advanced
           🏢 Processing Plant B
           📅 Start: Immediately
           🎯 Requirements: Basic Rigging, Confined Space
        
        \(Colors.blue)2. Wind Turbine Installation\(Colors.reset)
           📍 Newman (95km) | 💰 $95.00/hr | ⭐ Expert
           🏢 Renewable Energy Site
           📅 Start: In 10 days | Duration: 10 days
           🎯 Requirements: Advanced Rigging, Heights, Wind Turbine Cert
        
        \(Colors.yellow)3. Crane Rigging - Mine Site A\(Colors.reset)
           📍 Port Hedland (120km) | 💰 $85.50/hr | ⭐ Advanced
           🏢 Major Mining Operation
           📅 Start: In 2 days
           🎯 Requirements: Basic/Intermediate Rigging, Heights
        
        4. Port Equipment Maintenance
           📍 Dampier (75km) | 💰 $82.50/hr | ⭐ Intermediate
           🏢 Port Terminal
           📅 Start: Tomorrow
           🎯 Requirements: Basic Rigging, Dogman License
        
        5. Tower Construction Support
           📍 Karratha (85km) | 💰 $78.00/hr | ⭐ Intermediate
           🏢 Telco Infrastructure
           📅 Start: In 5 days | Duration: 3 days
           🎯 Requirements: Basic Rigging, Tower Climbing, RF Awareness
        
        Select job number for details (1-5) or 0 to go back: 
        """, terminator: "")
        
        if let choice = readLine() {
            if choice == "0" {
                return
            } else if let jobNum = Int(choice), jobNum >= 1 && jobNum <= 5 {
                showJobDetail(jobNum)
            }
        }
    }
    
    func showJobDetail(_ jobNumber: Int) {
        clearScreen()
        print("""
        \(Colors.orange)═══════════════════════════════════════════\(Colors.reset)
        \(Colors.bold)📋 Job Details\(Colors.reset)
        \(Colors.orange)═══════════════════════════════════════════\(Colors.reset)
        
        \(Colors.green)🚨 Emergency Equipment Move\(Colors.reset)
        
        📍 Location: Processing Plant B, Tom Price WA 6751
        💰 Rate: $120.00/hr AUD
        ⭐ Experience: Advanced
        📅 Start: Immediately
        ⏱️ Duration: Estimated 8-12 hours
        
        📝 Description:
        Urgent requirement for experienced rigger to assist with
        emergency equipment relocation at mineral processing plant.
        Must be available immediately and have confined space
        certification. Safety-critical role requiring attention
        to detail and ability to work under pressure.
        
        🎯 Requirements:
        • Basic Rigging License (RB)
        • Confined Space Entry
        • White Card
        • Own PPE and transport
        • Available immediately
        
        🏢 Client: Pilbara Mining Solutions
        ⭐ Client Rating: 4.8/5 (234 jobs posted)
        
        \(Colors.green)✅ You meet all requirements for this job!\(Colors.reset)
        
        Actions:
        1. 📱 Apply Now (One-tap application)
        2. 💬 Message Client
        3. 🔙 Back to Jobs List
        
        Choose action (1-3): 
        """, terminator: "")
        
        if let choice = readLine() {
            if choice == "1" {
                applyForJob()
            } else if choice == "3" {
                showAvailableJobs()
            }
        }
    }
    
    func applyForJob() {
        print("\n\n🔄 Submitting application...")
        Thread.sleep(forTimeInterval: 1)
        print("📤 Sending your profile and certifications...")
        Thread.sleep(forTimeInterval: 1)
        print("🔔 Notifying client...")
        Thread.sleep(forTimeInterval: 1)
        print("""
        
        \(Colors.green)✅ Application Successful!\(Colors.reset)
        
        You've been added to the shortlist. The client has been
        notified and will review your application shortly.
        
        You'll receive a push notification when there's an update.
        
        Press ENTER to continue...
        """)
        _ = readLine()
    }
    
    func showMyJobs() {
        clearScreen()
        print("""
        \(Colors.orange)═══════════════════════════════════════════\(Colors.reset)
        \(Colors.bold)💼 My Active Jobs\(Colors.reset)
        \(Colors.orange)═══════════════════════════════════════════\(Colors.reset)
        
        \(Colors.green)🔄 In Progress (1)\(Colors.reset)
        
        1. Heavy Equipment Installation
           📍 Karratha Industrial Zone
           💰 $88.00/hr | ⏱️ Started: 2 hours ago
           📊 Progress: 35% complete
           🏢 Client: WA Industrial Services
           
           Actions: [Check In] [Update Progress] [Safety Report]
        
        \(Colors.blue)📅 Upcoming (1)\(Colors.reset)
        
        2. Crane Maintenance Support
           📍 Port Hedland Terminal
           💰 $82.50/hr | 📅 Starts: Tomorrow 6:00 AM
           ⏱️ Duration: 2 days
           🏢 Client: Pilbara Ports Authority
           
           Actions: [View Details] [Get Directions] [Message Client]
        
        \(Colors.yellow)📊 This Week's Stats:\(Colors.reset)
        • Hours Worked: 32
        • Earnings: $2,816
        • Jobs Completed: 3
        • Average Rating: ⭐⭐⭐⭐⭐ 5.0
        
        Press ENTER to go back...
        """)
        _ = readLine()
    }
    
    func logout() {
        print("\n\n🔄 Logging out...")
        Thread.sleep(forTimeInterval: 1)
        isAuthenticated = false
        currentUser = nil
        print("✅ Logged out successfully!")
        Thread.sleep(forTimeInterval: 1)
    }
}

// Run the demo
let demo = RiggerConnectDemo()
demo.run()
