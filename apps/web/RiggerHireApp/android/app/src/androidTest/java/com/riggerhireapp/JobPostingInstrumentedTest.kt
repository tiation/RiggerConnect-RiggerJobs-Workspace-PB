package com.riggerhireapp

import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import androidx.test.core.app.ActivityScenario
import androidx.test.espresso.Espresso.*
import androidx.test.espresso.action.ViewActions.*
import androidx.test.espresso.matcher.ViewMatchers.*
import androidx.test.espresso.assertion.ViewAssertions.*
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class JobPostingInstrumentedTest {
    
    @Before
    fun setup() {
        // Launch main activity
        ActivityScenario.launch(MainActivity::class.java)
        
        // Login as employer
        loginAsEmployer()
    }
    
    private fun loginAsEmployer() {
        // Enter credentials
        onView(withId(R.id.emailInput))
            .perform(typeText("test@employer.com"))
        
        onView(withId(R.id.passwordInput))
            .perform(typeText("testpass123"))
        
        // Click login
        onView(withId(R.id.loginButton))
            .perform(click())
        
        // Verify dashboard is shown
        onView(withId(R.id.dashboardContainer))
            .check(matches(isDisplayed()))
    }
    
    @Test
    fun testCreateJobPosting() {
        // Click create job button
        onView(withId(R.id.createJobButton))
            .perform(click())
        
        // Fill job details
        onView(withId(R.id.jobTitleInput))
            .perform(typeText("Senior Crane Operator"))
        
        onView(withId(R.id.jobDescriptionInput))
            .perform(typeText("Looking for experienced crane operator for major construction project"))
        
        onView(withId(R.id.locationInput))
            .perform(typeText("Perth, WA"))
        
        // Add requirement
        onView(withId(R.id.addRequirementButton))
            .perform(click())
        
        onView(withId(R.id.requirementInput))
            .perform(typeText("Crane Operation License"))
        
        onView(withId(R.id.saveRequirementButton))
            .perform(click())
        
        // Set salary
        onView(withId(R.id.minSalaryInput))
            .perform(typeText("85000"))
        
        onView(withId(R.id.maxSalaryInput))
            .perform(typeText("95000"))
        
        // Submit job
        onView(withId(R.id.publishJobButton))
            .perform(click())
        
        // Verify success message
        onView(withText("Job Posted Successfully"))
            .check(matches(isDisplayed()))
    }
    
    @Test
    fun testEditJobPosting() {
        // Navigate to jobs list
        onView(withId(R.id.myJobsButton))
            .perform(click())
        
        // Click first job
        onView(withId(R.id.jobsList))
            .perform(actionOnItemAtPosition<JobViewHolder>(0, click()))
        
        // Click edit button
        onView(withId(R.id.editJobButton))
            .perform(click())
        
        // Update job title
        onView(withId(R.id.jobTitleInput))
            .perform(clearText(), typeText("Updated Crane Operator Position"))
        
        // Save changes
        onView(withId(R.id.saveChangesButton))
            .perform(click())
        
        // Verify success message
        onView(withText("Job Updated Successfully"))
            .check(matches(isDisplayed()))
    }
    
    @Test
    fun testViewApplications() {
        // Navigate to jobs list
        onView(withId(R.id.myJobsButton))
            .perform(click())
        
        // Click first job
        onView(withId(R.id.jobsList))
            .perform(actionOnItemAtPosition<JobViewHolder>(0, click()))
        
        // Click view applications button
        onView(withId(R.id.viewApplicationsButton))
            .perform(click())
        
        // Verify applications list is shown
        onView(withId(R.id.applicationsList))
            .check(matches(isDisplayed()))
    }
}
