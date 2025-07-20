import XCTest

class JobPostingUITests: XCTestCase {
    let app = XCUIApplication()
    
    override func setUp() {
        super.setUp()
        continueAfterFailure = false
        app.launch()
        
        // Login as employer
        loginAsEmployer()
    }
    
    func loginAsEmployer() {
        let emailTextField = app.textFields["EmailTextField"]
        let passwordTextField = app.secureTextFields["PasswordTextField"]
        let loginButton = app.buttons["LoginButton"]
        
        emailTextField.tap()
        emailTextField.typeText("test@employer.com")
        
        passwordTextField.tap()
        passwordTextField.typeText("testpass123")
        
        loginButton.tap()
        
        // Wait for dashboard to appear
        XCTAssertTrue(app.navigationBars["Dashboard"].waitForExistence(timeout: 5))
    }
    
    func testCreateJobPosting() {
        // Navigate to job creation
        app.buttons["CreateJobButton"].tap()
        
        // Fill job details
        let titleField = app.textFields["JobTitleField"]
        titleField.tap()
        titleField.typeText("Senior Crane Operator")
        
        let descriptionField = app.textViews["JobDescriptionField"]
        descriptionField.tap()
        descriptionField.typeText("Looking for experienced crane operator for major construction project")
        
        let locationField = app.textFields["LocationField"]
        locationField.tap()
        locationField.typeText("Perth, WA")
        
        // Add requirements
        app.buttons["AddRequirementButton"].tap()
        let requirementField = app.textFields["RequirementField"]
        requirementField.typeText("Crane Operation License")
        app.buttons["SaveRequirementButton"].tap()
        
        // Set salary
        let minSalaryField = app.textFields["MinSalaryField"]
        let maxSalaryField = app.textFields["MaxSalaryField"]
        
        minSalaryField.tap()
        minSalaryField.typeText("85000")
        
        maxSalaryField.tap()
        maxSalaryField.typeText("95000")
        
        // Submit job posting
        app.buttons["PublishJobButton"].tap()
        
        // Verify success
        XCTAssertTrue(app.staticTexts["Job Posted Successfully"].waitForExistence(timeout: 5))
    }
    
    func testEditJobPosting() {
        // Navigate to jobs list
        app.buttons["MyJobsButton"].tap()
        
        // Select first job
        app.tables.cells.element(boundBy: 0).tap()
        
        // Tap edit button
        app.buttons["EditJobButton"].tap()
        
        // Modify job title
        let titleField = app.textFields["JobTitleField"]
        titleField.tap()
        titleField.clearAndEnterText("Updated Crane Operator Position")
        
        // Save changes
        app.buttons["SaveChangesButton"].tap()
        
        // Verify update
        XCTAssertTrue(app.staticTexts["Job Updated Successfully"].waitForExistence(timeout: 5))
    }
    
    func testViewApplications() {
        // Navigate to jobs list
        app.buttons["MyJobsButton"].tap()
        
        // Select first job
        app.tables.cells.element(boundBy: 0).tap()
        
        // View applications
        app.buttons["ViewApplicationsButton"].tap()
        
        // Verify applications list appears
        XCTAssertTrue(app.tables["ApplicationsList"].exists)
    }
}

extension XCUIElement {
    func clearAndEnterText(_ text: String) {
        guard let stringValue = self.value as? String else {
            XCTFail("Tried to clear and enter text into a non string value")
            return
        }
        
        self.tap()
        let deleteString = String(repeating: XCUIKeyboardKey.delete.rawValue, count: stringValue.count)
        self.typeText(deleteString)
        self.typeText(text)
    }
}
