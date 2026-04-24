import { test, expect } from '@playwright/test';

test.describe('Laundry Booking Form', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    await page.fill('input[name="email"]', 'shenaya@gmail.com');
    await page.fill('input[name="password"]', '123456');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*dashboard/);
    await page.locator('nav').getByText(/laundry/i).click();
  });

  test('should validate service selection and piece count constraints', async ({ page }) => {
    await page.click('button:has-text("Wash and Iron")');
    
    const piecesInput = page.locator('input[name="pieces"]');
    await piecesInput.fill('6');
    
    // FIX: Target the specific large total display to avoid strict mode error
    // We look for the span that has the 'text-4xl' class (the big total)
    const totalAmount = page.locator('span.text-4xl:has-text("Rs.")');
    await expect(totalAmount).toBeVisible();
    await expect(totalAmount).toContainText(/Rs\./);

    await page.click('text=One Day Service');
    await piecesInput.fill('5');
    
    // The component should auto-cap the value to 2
    await expect(piecesInput).toHaveValue('2');
  });

  test('should allow form submission when data is valid', async ({ page }) => {
    await page.fill('input[name="phone"]', '0771234567');
    await page.click('button:has-text("Iron Only")');
    await page.fill('input[name="pieces"]', '3');
    await page.fill('textarea[name="specialInstructions"]', 'Please handle with care.');

    const payButton = page.getByRole('button', { name: /Pay Securely/i });

    const roomInput = page.locator('input[readOnly]').nth(1);
    const roomNumber = await roomInput.inputValue();

    if (roomNumber !== "Not Assigned") {
      await expect(payButton).toBeEnabled();
      await payButton.click();
      
      // Confirm checkout initiation (Stripe redirect)
      await page.waitForURL(/.*stripe.com/, { timeout: 15000 });
    } else {
      await expect(payButton).toBeDisabled();
      console.log("Booking cannot be submitted: No room assigned.");
    }
  });
});