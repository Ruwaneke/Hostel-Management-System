import { test, expect } from '@playwright/test';

const baseURL = process.env.FRONTEND_URL || 'http://localhost:5173';

const studentUser = {
  email: process.env.STUDENT_EMAIL || 'imaloffice19@gmail.com',
  password: process.env.STUDENT_PASSWORD || '123456'
};

const adminUser = {
  email: process.env.ADMIN_EMAIL || 'imal82481@gmail.com',
  password: process.env.ADMIN_PASSWORD || '123456'
};

test.describe('Room Allocation Management - UI Tests', () => {
  
  test('admin can navigate to dashboard to manage rooms', async ({ page, context }) => {
    await context.clearCookies();
    
    // Login as admin
    await page.goto(`${baseURL}/login`);
    await page.fill('input[name="email"]', adminUser.email);
    await page.fill('input[name="password"]', adminUser.password);
    await page.click('button:has-text("Sign In")');
    
    // Wait for Admin Dashboard to load properly
    await page.waitForURL(/admin-dashboard/, { timeout: 10000 });
    
    // Verify the URL is correct
    expect(page.url()).toContain('admin-dashboard');
  });

  test('student can view available rooms on dashboard', async ({ page, context }) => {
    await context.clearCookies();
    
    // Login as student
    await page.goto(`${baseURL}/login`);
    await page.fill('input[name="email"]', studentUser.email);
    await page.fill('input[name="password"]', studentUser.password);
    await page.click('button:has-text("Sign In")');
    
    // Wait for Dashboard
    await page.waitForURL(/user-dashboard/, { timeout: 10000 });
    
    // Wait for the Welcome message to appear
    await page.waitForSelector('text=Welcome back', { timeout: 5000 });
    
    // Verify the dashboard loaded its specific student content
    const content = await page.content();
    expect(content).toMatch(/Welcome back|You haven't booked a room yet|My Room Profile/);
  });

});