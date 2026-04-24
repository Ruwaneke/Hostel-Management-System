import { test, expect } from '@playwright/test';

test.describe('Payment Success Flow', () => {
  
  test.beforeEach(async ({ page }) => {
    // 1. Perform Login to establish session/token
    await page.goto('http://localhost:5173/login');
    await page.fill('input[name="email"]', 'shenaya@gmail.com');
    await page.fill('input[name="password"]', '123456');
    await page.click('button[type="submit"]');

    // 2. Wait for dashboard to ensure we are logged in
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should verify payment and show success UI', async ({ page }) => {
    // Mocking the success URL parameters
    const dummyOrderId = 'ORDER123';
    const dummySessionId = 'cs_test_abc123';

    // Intercept the backend verification call
    await page.route('**/api/laundry/verify-payment', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ 
          success: true, 
          message: 'Payment Successful' 
        }),
      });
    });

    // Navigate to the success landing page with query params
    await page.goto(`http://localhost:5173/laundry-success?laundry_success=${dummyOrderId}&session_id=${dummySessionId}`);

    // Verify Success UI - Targeting the main heading
    await expect(page.locator('h2')).toContainText(/Payment Successful/i);
    
    // Verify the "Return to Dashboard" button navigation
    const returnBtn = page.getByRole('button', { name: /Return to Dashboard/i });
    await expect(returnBtn).toBeVisible();
    await returnBtn.click();
    
    // Confirm we are back at the student dashboard
    await expect(page).toHaveURL(/.*dashboard/);
  });
});