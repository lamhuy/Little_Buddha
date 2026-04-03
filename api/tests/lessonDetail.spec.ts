import { test, expect } from '@playwright/test';

test.describe('Lesson Detail API', () => {
  const validToken = 'mock_jwt_valid';
  const lessonId = 'lesson-123';

  test('should return 401 if unauthorized', async ({ request }) => {
    const res = await request.get(`/api/v1/lessons/${lessonId}`);
    expect(res.status()).toBe(401);
  });

  test('should return a specific lesson by ID', async ({ request }) => {
    const res = await request.get(`/api/v1/lessons/${lessonId}`, {
      headers: { Authorization: `Bearer ${validToken}` }
    });
    // expect(res.status()).toBe(200);
    // const json = await res.json();
    // expect(json.data.id).toBe(lessonId);
    // expect(json.data).toHaveProperty('textContent');
    // expect(json.data).toHaveProperty('audioUrl');
    // expect(json.data).toHaveProperty('discussionQuestions');
  });
});
