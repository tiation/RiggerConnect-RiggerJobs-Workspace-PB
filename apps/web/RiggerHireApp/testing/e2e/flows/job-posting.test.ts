import { test, expect } from '@playwright/test';

test.describe('Job Posting Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://app.riggerhireapp.com');
    // Login as an employer
    await page.fill('[data-testid="email-input"]', 'test@employer.com');
    await page.fill('[data-testid="password-input"]', 'testpass123');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('**/dashboard');
  });

  test('employer can create and publish a job posting', async ({ page }) => {
    // Navigate to job creation
    await page.click('[data-testid="create-job-button"]');
    
    // Fill job details
    await page.fill('[data-testid="job-title"]', 'Experienced Crane Operator');
    await page.fill('[data-testid="job-description"]', 'Looking for certified crane operator for major construction project');
    await page.selectOption('[data-testid="job-type"]', 'full-time');
    await page.fill('[data-testid="job-location"]', 'Perth, WA');
    
    // Add requirements
    await page.click('[data-testid="add-requirement-button"]');
    await page.fill('[data-testid="requirement-input"]', 'Crane Operation License');
    await page.click('[data-testid="add-requirement-button"]');
    await page.fill('[data-testid="requirement-input"]', '5+ years experience');
    
    // Set salary range
    await page.fill('[data-testid="salary-min"]', '85000');
    await page.fill('[data-testid="salary-max"]', '95000');
    
    // Submit the form
    await page.click('[data-testid="publish-job-button"]');
    
    // Verify success
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Job posted successfully');
    
    // Verify job appears in listings
    await page.click('[data-testid="view-jobs-button"]');
    await expect(page.locator('text=Experienced Crane Operator')).toBeVisible();
  });

  test('employer can edit a published job', async ({ page }) => {
    // Navigate to job listings
    await page.click('[data-testid="view-jobs-button"]');
    
    // Find and edit the job
    await page.click('[data-testid="edit-job-button"]');
    await page.fill('[data-testid="job-title"]', 'Senior Crane Operator');
    await page.click('[data-testid="save-changes-button"]');
    
    // Verify changes
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    await expect(page.locator('text=Senior Crane Operator')).toBeVisible();
  });

  test('employer can view job applications', async ({ page }) => {
    // Navigate to job listings
    await page.click('[data-testid="view-jobs-button"]');
    
    // View applications for a job
    await page.click('[data-testid="view-applications-button"]');
    
    // Verify applications page
    await expect(page).toHaveURL(/.*\/applications/);
    await expect(page.locator('[data-testid="applications-list"]')).toBeVisible();
  });
});
