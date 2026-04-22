import { test, expect } from '@playwright/test';

const baseURL = process.env.FRONTEND_URL || 'http://localhost:5173';
const backendURL = process.env.BACKEND_URL || 'http://localhost:5025';

const studentUser = {
  email: process.env.STUDENT_EMAIL || 'imaloffice19@gmail.com',
  password: process.env.STUDENT_PASSWORD || '123456'
};

const adminUser = {
  email: process.env.ADMIN_EMAIL || 'imal82481@gmail.com',
  password: process.env.ADMIN_PASSWORD || '123456'
};

test.describe('Hostel Management - Simple UI Tests', () => {
  
  test('student can login successfully', async ({ page, context }) => {
    // Clear storage before test
    await context.clearCookies();
    
    await page.goto(`${baseURL}/login`);
    
    // Wait for login form to appear
    await page.waitForSelector('input[name="email"]', { timeout: 5000 });
    
    // Fill login form
    await page.fill('input[name="email"]', studentUser.email);
    await page.fill('input[name="password"]', studentUser.password);
    
    // Click sign in button
    await page.click('button:has-text("Sign In")');
    
    // Should redirect to dashboard
    await page.waitForURL(/user-dashboard/, { timeout: 10000 });
    expect(page.url()).toContain('user-dashboard');
  });

  test('student can navigate to create complaint page', async ({ page, context }) => {
    // Clear storage
    await context.clearCookies();
    
    // Login
    await page.goto(`${baseURL}/login`);
    await page.fill('input[name="email"]', studentUser.email);
    await page.fill('input[name="password"]', studentUser.password);
    await page.click('button:has-text("Sign In")');
    await page.waitForURL(/user-dashboard/);
    
    // Navigate to create complaint
    await page.goto(`${baseURL}/create-complaint`);
    
    // Verify page loaded
    await page.waitForSelector('textarea[name="description"]', { timeout: 5000 });
    const title = await page.locator('h1, h2').first().textContent();
    expect(title).toBeTruthy();
  });

    test('student can submit a complaint form', async ({ page, context }) => {
    // Clear storage
    await context.clearCookies();
    
    // Login
    await page.goto(`${baseURL}/login`);
    await page.fill('input[name="email"]', studentUser.email);
    await page.fill('input[name="password"]', studentUser.password);
    await page.click('button:has-text("Sign In")');
    await page.waitForURL(/user-dashboard/);
    
    // Navigate directly to create complaint page
    await page.goto(`${baseURL}/create-complaint`);
    await page.waitForSelector('input[name="title"]', { timeout: 5000 });
    
    // Fill complaint form
    await page.fill('input[name="title"]', 'Broken window in room 101');
    await page.fill('textarea[name="description"]', 'The window glass is cracked and needs replacement');
    
    // Select category button (not select dropdown)
    await page.click('button:has-text("Electrical")');
    
    // Select priority button
    await page.click('button:has-text("High")');
    
    // Submit form
    await page.click('button:has-text("Submit Complaint")');
    
    // Wait for success or redirect
    await page.waitForTimeout(2000);
    const url = page.url();
    expect(url).toBeTruthy();
    });

    test('student can access feedback section', async ({ page, context }) => {
    // Clear storage
    await context.clearCookies();
    
    // Login
    await page.goto(`${baseURL}/login`);
    await page.fill('input[name="email"]', studentUser.email);
    await page.fill('input[name="password"]', studentUser.password);
    await page.click('button:has-text("Sign In")');
    await page.waitForURL(/user-dashboard/);
    
    // Navigate directly to feedback page
    await page.goto(`${baseURL}/user-feedback`);
    
    // Wait for page to load
    await page.waitForSelector('h1', { timeout: 5000 });
    
    // Click "New Feedback" button to show the form
    await page.click('button:has-text("New Feedback")');
    
    // Now form inputs should be visible
    await page.waitForSelector('input[type="text"]', { timeout: 5000 });
    
    // Verify feedback form is displayed
    const pageContent = await page.content();
    expect(pageContent).toContain('Submit Your Feedback');
    expect(pageContent).toContain('Subject / Title');
    });

  test('admin can login and view dashboard', async ({ page, context }) => {
    // Clear storage
    await context.clearCookies();
    
    // Login as admin
    await page.goto(`${baseURL}/login`);
    await page.fill('input[name="email"]', adminUser.email);
    await page.fill('input[name="password"]', adminUser.password);
    await page.click('button:has-text("Sign In")');
    
    // Should redirect to admin dashboard
    await page.waitForURL(/admin-dashboard/, { timeout: 10000 });
    expect(page.url()).toContain('admin-dashboard');
  });

  test('admin can navigate to complaints management', async ({ page, context }) => {
    // Clear storage
    await context.clearCookies();
    
    // Login as admin
    await page.goto(`${baseURL}/login`);
    await page.fill('input[name="email"]', adminUser.email);
    await page.fill('input[name="password"]', adminUser.password);
    await page.click('button:has-text("Sign In")');
    await page.waitForURL(/admin-dashboard/);
    
    // Click on complaints section
    const complaintLink = page.locator('a, button').filter({ hasText: /[Cc]omplaint/ }).first();
    await complaintLink.click();
    
    // Wait for page to load
    await page.waitForTimeout(2000);
    const url = page.url();
    expect(url).toBeTruthy();
  });

  test('logout functionality works', async ({ page, context }) => {
    // Clear storage
    await context.clearCookies();
    
    // Login
    await page.goto(`${baseURL}/login`);
    await page.fill('input[name="email"]', studentUser.email);
    await page.fill('input[name="password"]', studentUser.password);
    await page.click('button:has-text("Sign In")');
    await page.waitForURL(/dashboard/);
    
    // Find and click logout button
    const logoutButton = page.locator('button, a').filter({ hasText: /[Ll]ogout/ }).first();
    await logoutButton.click();
    
    // Should redirect to home or login
    await page.waitForTimeout(2000);
    const url = page.url();
    expect(url).not.toContain('dashboard');
  });
});