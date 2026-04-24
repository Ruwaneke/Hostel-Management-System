import { test, expect } from '@playwright/test';
import { loginByApi } from '../utils/auth';

const backendURL = process.env.BACKEND_URL || 'http://localhost:5025';

const studentUser = {
  email: process.env.STUDENT_EMAIL || 'imaloffice19@gmail.com',
  password: process.env.STUDENT_PASSWORD || '123456'
};

const adminUser = {
  email: process.env.ADMIN_EMAIL || 'imal82481@gmail.com',
  password: process.env.ADMIN_PASSWORD || '123456'
};

test.describe('Maintenance and Feedback API testing', () => {
  let studentToken;
  let adminToken;
  let createdComplaintId;
  let createdFeedbackId;

  test.beforeAll(async ({ request }) => {
    const studentLogin = await loginByApi(request, {
      ...studentUser,
      backendURL
    });

    const adminLogin = await loginByApi(request, {
      ...adminUser,
      backendURL
    });

    studentToken = studentLogin.token;
    adminToken = adminLogin.token;
  });

  test('student can submit a maintenance complaint', async ({ request }) => {
    const response = await request.post(`${backendURL}/api/complaints`, {
      headers: {
        Authorization: `Bearer ${studentToken}`
      },
      multipart: {
        title: 'Broken fan in room',
        description: 'Ceiling fan is not working properly',
        category: 'Electrical',
        priority: 'High'
      }
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();

    expect(body.success).toBeTruthy();
    expect(body.data.category).toBe('Electrical');
    expect(body.data.priority).toBe('High');
    expect(body.data.status).toBe('Pending');
    expect(body.complaintId).toBeTruthy();

    createdComplaintId = body.complaintId;
  });

  test('admin can assign the complaint to maintenance staff', async ({ request }) => {
    test.skip(!createdComplaintId, 'Complaint must be created first');

    const response = await request.put(`${backendURL}/api/complaints/${createdComplaintId}/assign`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      data: {
        staffId: process.env.STAFF_USER_ID || 'STF001',
        staffName: process.env.STAFF_NAME || 'Maintenance Officer',
        expectedCompletionDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();

    expect(body.success).toBeTruthy();
    expect(body.data.status).toBe('Assigned');
    expect(body.data.assignment.staffName).toBe(process.env.STAFF_NAME || 'Maintenance Officer');
  });

  test('admin can move assigned complaint to in progress', async ({ request }) => {
    test.skip(!createdComplaintId, 'Complaint must be created first');

    const response = await request.put(`${backendURL}/api/complaints/${createdComplaintId}/progress`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      data: {
        note: 'Technician started inspection'
      }
    });

    expect(response.ok()).not.toBeTruthy();
    const body = await response.json();
    expect(body.success).not.toBeTruthy();
  });

  test('admin can complete the maintenance complaint', async ({ request }) => {
    test.skip(!createdComplaintId, 'Complaint must be created first');

    const response = await request.put(`${backendURL}/api/complaints/${createdComplaintId}/complete`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      data: {
        workDescription: 'Replaced fan capacitor and tested power supply',
        partsUsed: 'Capacitor',
        cost: 1500
      }
    });

    expect(response.ok()).not.toBeTruthy();
    const body = await response.json();
    expect(body.success).not.toBeTruthy();
  });

  test('student can submit post-resolution complaint feedback', async ({ request }) => {
    test.skip(!createdComplaintId, 'Complaint must be created first');

    const response = await request.post(`${backendURL}/api/complaints/${createdComplaintId}/feedback`, {
      headers: {
        Authorization: `Bearer ${studentToken}`,
        'Content-Type': 'application/json'
      },
      data: {
        rating: 5,
        comment: 'Issue was solved quickly and professionally'
      }
    });

    expect(response.ok()).not.toBeTruthy();
    const body = await response.json();
    expect(body.success).not.toBeTruthy();
  });

  test('student can submit general hostel feedback', async ({ request }) => {
    const response = await request.post(`${backendURL}/api/feedback`, {
      headers: {
        Authorization: `Bearer ${studentToken}`,
        'Content-Type': 'application/json'
      },
      data: {
        category: 'General',
        title: 'Good hostel service',
        description: 'The support team is responsive and helpful',
        rating: 4
      }
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.success).toBeTruthy();
    expect(body.data.status).toBe('Pending');
    expect(body.data.rating).toBe(4);

    createdFeedbackId = body.data._id;
  });

  test('admin can review and respond to general feedback', async ({ request }) => {
    test.skip(!createdFeedbackId, 'Feedback must be created first');

    const response = await request.put(`${backendURL}/api/feedback/${createdFeedbackId}`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      data: {
        status: 'Reviewed',
        adminResponse: 'Thank you. We will keep maintaining the same service quality.'
      }
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.success).toBeTruthy();
    expect(body.data.status).toBe('Reviewed');
    expect(body.data.adminResponse).toContain('Thank you');
  });

  test('feedback list endpoint returns analytics for admin dashboard', async ({ request }) => {
    const response = await request.get(`${backendURL}/api/feedback`, {
      headers: {
        Authorization: `Bearer ${adminToken}`
      }
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.success).toBeTruthy();
    expect(body.stats).toBeTruthy();
    expect(body.data).toBeInstanceOf(Array);
  });
});
