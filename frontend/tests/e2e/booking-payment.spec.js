import { test, expect } from '@playwright/test';

const baseURL = process.env.FRONTEND_URL || 'http://localhost:5173';

const studentUser = {
  email: process.env.STUDENT_EMAIL || 'imaloffice19@gmail.com',
  password: process.env.STUDENT_PASSWORD || '123456'
};

test.describe('Booking & Payment - UI Tests', () => {

  test('student can access the financial center and view payment history', async ({ page, context }) => {
    await context.clearCookies();

    // 1. MOCK THE API: Tell the dashboard we successfully have a room booked!
    await page.route('**/api/bookings/status/*', async route => {
      const json = {
        hasBooking: true,
        booking: {
          _id: 'mock-booking-123',
          roomId: 'mock-room-123',
          roomNumber: '101',
          status: 'Confirmed',
          paymentStatus: 'Paid',
          paidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        invoices: [
          { _id: 'inv-1', description: 'First Month Rent', amount: 15000, status: 'Paid', paidAt: new Date().toISOString() }
        ]
      };
      await route.fulfill({ json });
    });

    await page.route('**/api/rooms/*', async route => {
      const json = {
        _id: 'mock-room-123',
        roomNumber: '101',
        monthlyRent: 15000,
        keyMoney: 50000,
        roomType: 'Single'
      };
      await route.fulfill({ json });
    });

    // 2. LOGIN
    await page.goto(`${baseURL}/login`);
    await page.fill('input[name="email"]', studentUser.email);
    await page.fill('input[name="password"]', studentUser.password);
    await page.click('button:has-text("Sign In")');
    await page.waitForURL(/user-dashboard/, { timeout: 10000 });

    // 3. NAVIGATE TO PAYMENTS
    // Click the Payments button on the dashboard
    await page.click('button:has-text("Payments"), button:has-text("Payment History")');

    // 4. VERIFY IT LOADED
    await page.waitForSelector('text=Financial Center', { timeout: 5000 });
    const content = await page.content();
    
    
    // Check for our mocked data to prove the UI rendered it
    expect(content).toContain('Financial Center');
    expect(content).toContain('Payment History'); // <--- FIXED
    expect(content).toContain('Rs. 15,000');
  });

  test('student can click pay next month rent and trigger checkout', async ({ page, context }) => {
    await context.clearCookies();

    // Setup the same mocked room data
    await page.route('**/api/bookings/status/*', async route => {
      await route.fulfill({ json: { hasBooking: true, booking: { _id: 'mock-booking-123', roomId: 'mock-room-123', paidUntil: new Date().toISOString() }, invoices: [] } });
    });
    await page.route('**/api/rooms/*', async route => {
      await route.fulfill({ json: { roomNumber: '101', monthlyRent: 15000, keyMoney: 50000 } });
    });

    // MOCK THE STRIPE CHECKOUT API: We don't want to actually redirect to Stripe during a test
    let apiCalled = false;
    await page.route('**/api/bookings/monthly-checkout', async route => {
      apiCalled = true;
      await route.fulfill({ json: { url: `${baseURL}/user-dashboard` } });
    });

    // Login
    await page.goto(`${baseURL}/login`);
    await page.fill('input[name="email"]', studentUser.email);
    await page.fill('input[name="password"]', studentUser.password);
    await page.click('button:has-text("Sign In")');
    await page.waitForURL(/user-dashboard/, { timeout: 10000 });

    // Go to Payments Tab
    await page.click('button:has-text("Payments"), button:has-text("Payment History")');
    await page.waitForSelector('text=Financial Center');

    // Click the Payment button
    await page.click('button:has-text("Pay Next Month Rent")');

    // Wait a brief moment for the Axios API call to fire
    await page.waitForTimeout(1000);

    // Verify the checkout API was successfully triggered by the button click
    expect(apiCalled).toBeTruthy();
  });

});