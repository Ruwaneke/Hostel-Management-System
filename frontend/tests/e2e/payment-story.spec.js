import { test, expect } from '@playwright/test';

test.describe('Payment Flow Storyboard', () => {
  
  test('Capture Payment Lifecycle Screenshots', async ({ page }) => {
    test.setTimeout(60000);

    // --- STEP 1: LOGIN & TOKEN CAPTURE ---
    await page.goto('http://localhost:5173/login');
    await page.fill('input[name="email"]', 'shenaya@gmail.com');
    await page.fill('input[name="password"]', '123456');
    await page.click('button[type="submit"]');

    // Wait for dashboard to confirm login worked
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Check if we are still on dashboard after 2 seconds (No kickback)
    await page.waitForTimeout(2000);
    
    if (page.url() === 'http://localhost:5173/') {
        console.log("Detected kickback to home. Re-navigating to laundry...");
    }

    // --- STEP 2: INPUT & VALIDATION ---
    // Force navigation to laundry
    await page.goto('http://localhost:5173/laundry');
    
    // Wait for the form. If it's not visible, we check why.
    const phoneInput = page.locator('input[name="phone"]');
    
    try {
        await expect(phoneInput).toBeVisible({ timeout: 10000 });
    } catch (e) {
        // Fallback: If redirected to login, login again and stay on this page
        await page.fill('input[name="email"]', 'shenaya@gmail.com');
        await page.fill('input[name="password"]', '123456');
        await page.click('button[type="submit"]');
        await expect(phoneInput).toBeVisible({ timeout: 10000 });
    }
    
    await phoneInput.fill('0771234567');
    await page.getByText('Wash and Iron', { exact: true }).click();
    await page.fill('input[name="pieces"]', '5');
    
    // Small wait for the price calculation to finish for the screenshot
    await page.waitForTimeout(500); 
    
    // SCREENSHOT 1: Input & Validation
    await page.screenshot({ path: 'screenshots/1-input-validation.png' });

    // --- STEP 3: STRIPE GATEWAY ---
    const payButton = page.getByRole('button', { name: /Pay Securely/i });
    
    // We use Promise.all to catch the redirect immediately
    await Promise.all([
        page.waitForURL(/.*checkout.stripe.com/, { timeout: 30000 }),
        payButton.click(),
    ]);
    
    // Give Stripe UI time to load for a nice screenshot
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // SCREENSHOT 2: Stripe Gateway
    await page.screenshot({ path: 'screenshots/2-stripe-gateway.png' });

    // --- STEP 4: SUCCESS FEEDBACK ---
    await page.route('**/api/laundry/verify-payment**', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ success: true, message: 'Verified' }),
        });
    });

    await page.goto('http://localhost:5173/laundry-success?session_id=test_123&laundry_success=ORD123');
    await expect(page.locator('h2')).toContainText(/Payment Successful/i);
    
    // SCREENSHOT 3: Success Feedback
    await page.screenshot({ path: 'screenshots/3-success-feedback.png' });
    
    console.log("All screenshots captured in the /screenshots folder!");
  });
});