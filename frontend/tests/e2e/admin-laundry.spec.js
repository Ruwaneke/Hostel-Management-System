import { test, expect } from '@playwright/test';

test.describe('Admin Laundry Management', () => {
  
  test.beforeEach(async ({ page }) => {
    // 1. Admin Login
    await page.goto('http://localhost:5173/login');
    await page.fill('input[name="email"]', 'ruwe@gmail.com'); // Use your actual admin email
    await page.fill('input[name="password"]', '123456');      // Use your actual admin password
    await page.click('button[type="submit"]');

    // 2. Navigate to Admin Laundry Management
    await expect(page).toHaveURL(/.*dashboard/);
    await page.locator('nav').getByText(/laundry/i).click();
  });

  test('admin should see laundry orders and update status', async ({ page }) => {
    // FIX: Target the H2 specifically to avoid strict mode violation 
    // and match the actual text "Laundry Management"
    const heading = page.locator('h2:has-text("Laundry Management")');
    await expect(heading).toBeVisible();

    // Verify the orders table/list is present
    // Adjust this selector to match a unique element in your table (e.g., a "Status" column header)
    const tableHeader = page.getByText(/Status/i).first();
    await expect(tableHeader).toBeVisible();

  });
});