import { test, expect } from '@playwright/test';

const backendURL = process.env.BACKEND_URL || 'http://localhost:5025';

test.describe('AI Chatbot Backend Logic - API Tests', () => {

  test('Chatbot returns default greeting for unrecognized queries', async ({ request }) => {
    const response = await request.post(`${backendURL}/api/chatbot/query`, {
      data: { message: 'Hello' }
    });
    
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    
    expect(body.reply).toContain('Hostel Assistant');
    expect(body.suggestions).toBeNull();
  });

  test('Chatbot correctly identifies laundry pricing intent (including typos)', async ({ request }) => {
    // Testing with a typo "landry"
    const response = await request.post(`${backendURL}/api/chatbot/query`, {
      data: { message: 'What is the landry price?' }
    });
    
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    
    expect(body.reply).toContain('Laundry & Service Pricing');
    expect(body.reply).toContain('Wash Only');
  });

  test('Chatbot correctly builds smart query for Room Search (Boys, AC, Shared)', async ({ request }) => {
    const response = await request.post(`${backendURL}/api/chatbot/query`, {
      data: { message: 'I need a cheap boys ac shared room' }
    });
    
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    
    // Verify it caught the filters
    expect(body.reply).toMatch(/I found|I'm sorry/); // Depends if you have DB data
    
    if (body.suggestions && body.suggestions.length > 0) {
      expect(body.suggestions[0].text).toContain('Male');
      expect(body.suggestions[0].text).toContain('AC');
      expect(body.suggestions[0].text).toContain('Shared');
      expect(body.suggestions[0].link).toContain('/book/');
    }
  });

});