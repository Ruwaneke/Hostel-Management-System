# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/e2e/payment-story.spec.js >> Payment Flow Storyboard >> Capture Payment Lifecycle Screenshots
- Location: tests/e2e/payment-story.spec.js:5:3

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: page.fill: Test timeout of 60000ms exceeded.
Call log:
  - waiting for locator('input[name="email"]')

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - navigation [ref=e4]:
      - generic [ref=e6]:
        - link "🏠 HostelMS" [ref=e7] [cursor=pointer]:
          - /url: /
          - generic [ref=e8]: 🏠
          - generic [ref=e9]: HostelMS
        - generic [ref=e10]:
          - link "🏠 Home" [ref=e11] [cursor=pointer]:
            - /url: /
            - generic [ref=e12]: 🏠
            - text: Home
          - link "📧 Contact" [ref=e13] [cursor=pointer]:
            - /url: /contact
            - generic [ref=e14]: 📧
            - text: Contact
          - link "❓ FAQ" [ref=e15] [cursor=pointer]:
            - /url: /faq
            - generic [ref=e16]: ❓
            - text: FAQ
          - link "📊 Dashboard" [ref=e17] [cursor=pointer]:
            - /url: /user-dashboard
            - generic [ref=e18]: 📊
            - text: Dashboard
          - button "Logout" [ref=e19]
    - generic [ref=e21]:
      - generic [ref=e22]:
        - generic [ref=e23]: ✨ Modern Hostel Management
        - heading "Smart Hostel All in One Platform" [level=1] [ref=e24]:
          - text: Smart Hostel
          - text: All in One Platform
        - paragraph [ref=e25]: Streamline room allocation, payments, laundry, complaints, and meals — all from a beautifully crafted dashboard.
        - generic [ref=e26]:
          - link "Get Started Free" [ref=e27] [cursor=pointer]:
            - /url: /register
          - link "Sign In →" [ref=e28] [cursor=pointer]:
            - /url: /login
      - generic [ref=e29]:
        - generic [ref=e30]: 🏨
        - generic [ref=e31]: 🛏️ Room 204 — Available
        - generic [ref=e32]: ✅ Payment Confirmed
        - generic [ref=e33]: "🔧 Ticket #12 Resolved"
    - generic [ref=e35]:
      - generic [ref=e36]:
        - generic [ref=e37]: 500+
        - generic [ref=e38]: Students Managed
      - generic [ref=e39]:
        - generic [ref=e40]: "120"
        - generic [ref=e41]: Rooms Available
      - generic [ref=e42]:
        - generic [ref=e43]: 98%
        - generic [ref=e44]: Satisfaction Rate
      - generic [ref=e45]:
        - generic [ref=e46]: 24/7
        - generic [ref=e47]: Support Available
    - generic [ref=e48]:
      - generic [ref=e49]:
        - heading "Premium Living Spaces" [level=2] [ref=e50]
        - paragraph [ref=e51]: Browse our available hostel rooms. Filtered for comfort, security, and an excellent study environment.
      - generic [ref=e53]:
        - generic [ref=e54]:
          - img "Room 112" [ref=e55]
          - generic [ref=e57]: Available
          - generic [ref=e59]:
            - generic [ref=e60]: Block B
            - heading "112" [level=3] [ref=e61]
        - generic [ref=e62]:
          - generic [ref=e63]:
            - generic [ref=e64]:
              - paragraph [ref=e65]: Room Type
              - paragraph [ref=e66]: Single
            - generic [ref=e67]:
              - paragraph [ref=e68]: Monthly Rent
              - paragraph [ref=e69]: Rs. 6,000
          - generic [ref=e70]:
            - generic [ref=e71]:
              - generic [ref=e72]: 🚻
              - generic [ref=e73]: Male
            - generic [ref=e74]:
              - generic [ref=e75]: ❄️
              - generic [ref=e76]: AC
            - generic [ref=e77]:
              - generic [ref=e78]: 👥
              - generic [ref=e79]: 1 Max
          - button "Book Room →" [ref=e81]:
            - generic [ref=e82]: Book Room
            - generic [ref=e83]: →
    - generic [ref=e84]:
      - generic [ref=e85]:
        - heading "Everything You Need" [level=2] [ref=e86]
        - paragraph [ref=e87]: A complete solution built for both students and hostel administrators.
      - generic [ref=e88]:
        - generic [ref=e89]:
          - generic [ref=e90]: 🛏️
          - heading "Room Management" [level=3] [ref=e91]
          - paragraph [ref=e92]: Efficiently allocate and track available, occupied, and reserved rooms in real time.
        - generic [ref=e93]:
          - generic [ref=e94]: 💳
          - heading "Payments" [level=3] [ref=e95]
          - paragraph [ref=e96]: View fee invoices, pay hostel fees, and download receipts instantly.
        - generic [ref=e97]:
          - generic [ref=e98]: 👕
          - heading "Laundry" [level=3] [ref=e99]
          - paragraph [ref=e100]: Submit pickup requests, track wash/dry/fold status, get notified when ready.
        - generic [ref=e101]:
          - generic [ref=e102]: 🔧
          - heading "Complaints" [level=3] [ref=e103]
          - paragraph [ref=e104]: Raise maintenance issues. Admins track, assign, and resolve tickets efficiently.
        - generic [ref=e105]:
          - generic [ref=e106]: 🍽️
          - heading "Meals" [level=3] [ref=e107]
          - paragraph [ref=e108]: View daily meal schedules, dietary options, and food service status.
        - generic [ref=e109]:
          - generic [ref=e110]: 📊
          - heading "Admin Analytics" [level=3] [ref=e111]
          - paragraph [ref=e112]: Full dashboard with insights on occupancy, payments, and pending requests.
    - generic [ref=e114]:
      - generic [ref=e115]:
        - heading "How It Works" [level=2] [ref=e116]
        - paragraph [ref=e117]: Get up and running in 3 simple steps.
      - generic [ref=e118]:
        - generic [ref=e120]:
          - generic [ref=e121]: "01"
          - heading "Create an Account" [level=3] [ref=e122]
          - paragraph [ref=e123]: Register as a student or admin in under a minute.
        - generic [ref=e124]:
          - generic [ref=e125]: "02"
          - heading "Set Up Your Hostel" [level=3] [ref=e126]
          - paragraph [ref=e127]: Add rooms, assign students, configure meal plans.
        - generic [ref=e128]:
          - generic [ref=e129]: "03"
          - heading "Manage Everything" [level=3] [ref=e130]
          - paragraph [ref=e131]: Handle payments, laundry, complaints from one dashboard.
    - generic [ref=e132]:
      - heading "What Our Users Say" [level=2] [ref=e133]
      - generic [ref=e134]:
        - generic [ref=e135]:
          - generic [ref=e136]: "\""
          - paragraph [ref=e137]: HostelMS made paying my fees and tracking laundry so much easier. Love the premium interface, it feels incredibly modern.
          - generic [ref=e138]:
            - generic [ref=e139]: A
            - generic [ref=e140]:
              - generic [ref=e141]: Ahmed R.
              - generic [ref=e142]: Student
        - generic [ref=e143]:
          - generic [ref=e144]: "\""
          - paragraph [ref=e145]: Managing 120 rooms used to be a nightmare. Now everything is just one click away. Absolutely incredible tool.
          - generic [ref=e146]:
            - generic [ref=e147]: S
            - generic [ref=e148]:
              - generic [ref=e149]: Sara K.
              - generic [ref=e150]: Admin
    - generic [ref=e152]:
      - heading "Ready to Upgrade?" [level=2] [ref=e153]
      - paragraph [ref=e154]: Join hundreds of visionary students and admins revolutionizing campus living with HostelMS.
      - generic [ref=e155]:
        - link "Create Free Account" [ref=e156] [cursor=pointer]:
          - /url: /register
        - link "Contact Sales" [ref=e157] [cursor=pointer]:
          - /url: /contact
    - contentinfo [ref=e158]:
      - generic [ref=e159]:
        - generic [ref=e160]:
          - generic [ref=e161]: 🏠
          - generic [ref=e162]: HostelMS
        - generic [ref=e163]:
          - link "Contact" [ref=e164] [cursor=pointer]:
            - /url: /contact
          - link "FAQ" [ref=e165] [cursor=pointer]:
            - /url: /faq
          - link "Register" [ref=e166] [cursor=pointer]:
            - /url: /register
          - link "Login" [ref=e167] [cursor=pointer]:
            - /url: /login
        - paragraph [ref=e168]: © 2026 HostelMS. All rights reserved.
  - button [ref=e170]:
    - generic [ref=e172]:
      - img [ref=e173]
      - img [ref=e175]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Payment Flow Storyboard', () => {
  4  |   
  5  |   test('Capture Payment Lifecycle Screenshots', async ({ page }) => {
  6  |     test.setTimeout(60000);
  7  | 
  8  |     // --- STEP 1: LOGIN & TOKEN CAPTURE ---
  9  |     await page.goto('http://localhost:5173/login');
  10 |     await page.fill('input[name="email"]', 'shenaya@gmail.com');
  11 |     await page.fill('input[name="password"]', '123456');
  12 |     await page.click('button[type="submit"]');
  13 | 
  14 |     // Wait for dashboard to confirm login worked
  15 |     await expect(page).toHaveURL(/.*dashboard/);
  16 |     
  17 |     // Check if we are still on dashboard after 2 seconds (No kickback)
  18 |     await page.waitForTimeout(2000);
  19 |     
  20 |     if (page.url() === 'http://localhost:5173/') {
  21 |         console.log("Detected kickback to home. Re-navigating to laundry...");
  22 |     }
  23 | 
  24 |     // --- STEP 2: INPUT & VALIDATION ---
  25 |     // Force navigation to laundry
  26 |     await page.goto('http://localhost:5173/laundry');
  27 |     
  28 |     // Wait for the form. If it's not visible, we check why.
  29 |     const phoneInput = page.locator('input[name="phone"]');
  30 |     
  31 |     try {
  32 |         await expect(phoneInput).toBeVisible({ timeout: 10000 });
  33 |     } catch (e) {
  34 |         // Fallback: If redirected to login, login again and stay on this page
> 35 |         await page.fill('input[name="email"]', 'shenaya@gmail.com');
     |                    ^ Error: page.fill: Test timeout of 60000ms exceeded.
  36 |         await page.fill('input[name="password"]', '123456');
  37 |         await page.click('button[type="submit"]');
  38 |         await expect(phoneInput).toBeVisible({ timeout: 10000 });
  39 |     }
  40 |     
  41 |     await phoneInput.fill('0771234567');
  42 |     await page.getByText('Wash and Iron', { exact: true }).click();
  43 |     await page.fill('input[name="pieces"]', '5');
  44 |     
  45 |     // Small wait for the price calculation to finish for the screenshot
  46 |     await page.waitForTimeout(500); 
  47 |     
  48 |     // SCREENSHOT 1: Input & Validation
  49 |     await page.screenshot({ path: 'screenshots/1-input-validation.png' });
  50 | 
  51 |     // --- STEP 3: STRIPE GATEWAY ---
  52 |     const payButton = page.getByRole('button', { name: /Pay Securely/i });
  53 |     
  54 |     // We use Promise.all to catch the redirect immediately
  55 |     await Promise.all([
  56 |         page.waitForURL(/.*checkout.stripe.com/, { timeout: 30000 }),
  57 |         payButton.click(),
  58 |     ]);
  59 |     
  60 |     // Give Stripe UI time to load for a nice screenshot
  61 |     await page.waitForLoadState('networkidle');
  62 |     await page.waitForTimeout(3000);
  63 |     
  64 |     // SCREENSHOT 2: Stripe Gateway
  65 |     await page.screenshot({ path: 'screenshots/2-stripe-gateway.png' });
  66 | 
  67 |     // --- STEP 4: SUCCESS FEEDBACK ---
  68 |     await page.route('**/api/laundry/verify-payment**', async (route) => {
  69 |         await route.fulfill({
  70 |             status: 200,
  71 |             contentType: 'application/json',
  72 |             body: JSON.stringify({ success: true, message: 'Verified' }),
  73 |         });
  74 |     });
  75 | 
  76 |     await page.goto('http://localhost:5173/laundry-success?session_id=test_123&laundry_success=ORD123');
  77 |     await expect(page.locator('h2')).toContainText(/Payment Successful/i);
  78 |     
  79 |     // SCREENSHOT 3: Success Feedback
  80 |     await page.screenshot({ path: 'screenshots/3-success-feedback.png' });
  81 |     
  82 |     console.log("All screenshots captured in the /screenshots folder!");
  83 |   });
  84 | });
```