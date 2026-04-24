import { test, expect } from '@playwright/test';

test.describe('Laundry and Payment Module', () => {
  
  test.beforeEach(async ({ page }) => {
    // 1. Navigate to login
    await page.goto('http://localhost:5173/login');
    
    // 2. Authenticate with provided credentials
    await page.fill('input[type="email"], input[name="email"]', 'shenaya@gmail.com');
    await page.fill('input[type="password"], input[name="password"]', '123456');
    await page.click('button[type="submit"]');

    // 3. Confirm login success by checking the URL or a dashboard element
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('student should be able to book laundry and initiate payment', async ({ page }) => {
    // 4. Navigate to Laundry Module via Sidebar/Nav
    // We use a more resilient locator in case "Laundry" appears multiple times
    const laundryLink = page.locator('nav').getByText(/laundry/i);
    await laundryLink.waitFor({ state: 'visible', timeout: 10000 });
    await laundryLink.click();

    // 5. Verify the Header
    await expect(page.locator('h1, h2')).toContainText(/Laundry/i);

    // 6. Fill out the Laundry Booking Form
    await page.fill('input[name="phone"]', '0771234567');

    // Select Service Type (using the text from your component buttons)
    await page.click('button:has-text("Wash and Iron")');

    // Set pieces to 3
    const piecesInput = page.locator('input[name="pieces"]');
    await piecesInput.clear();
    await piecesInput.fill('3');

    // 7. Check the Payment Button status
    const payButton = page.getByRole('button', { name: /Pay Securely/i });
    
    // Check if the user has a room assigned (based on your read-only input)
    const roomInput = page.locator('input[readOnly]').nth(1); 
    const roomNumber = await roomInput.inputValue();

    if (roomNumber === "Not Assigned") {
      console.log("Room not assigned for shenaya@gmail.com. Button should be disabled.");
      await expect(payButton).toBeDisabled();
    } else {
      // 8. Trigger Payment Redirect
      await payButton.click();

      // 9. Verify Stripe Redirection
      // We wait for the URL to change to the Stripe checkout domain
      await page.waitForURL(/.*stripe.com/, { timeout: 20000 });
      console.log('Redirected to Stripe successfully.');
    }
  });

  test('should view order history tab', async ({ page }) => {
    // Navigate to Laundry
    await page.locator('nav').getByText(/laundry/i).click();

    // Click "My Orders" tab based on your TABS array ['New Request', 'My Orders']
    await page.getByRole('button', { name: 'My Orders' }).click();

    // Verify if the history section is visible
    await expect(page.locator('text=My Laundry Orders')).toBeVisible();
  });
});