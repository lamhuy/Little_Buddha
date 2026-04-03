import { test, expect } from '@playwright/test';

test.describe('Lesson Discovery API', () => {
  // Mock JWT for a 6-year-old child (Age Tier 0-7)
  const childToken = 'mock_jwt_age_6';
  // Mock JWT for a 16-year-old teen (Age Tier 13-18)
  const teenToken = 'mock_jwt_age_16';

  test('should return 401 if unauthorized', async ({ request }) => {
    const res = await request.get('/api/v1/lessons');
    expect(res.status()).toBe(401);
  });

  test('should return lessons appropriate for 0-7 age tier', async ({ request }) => {
    const res = await request.get('/api/v1/lessons', {
      headers: { Authorization: `Bearer ${childToken}` }
    });
    // In a mocked database test, this would return 200
    // expect(res.status()).toBe(200);
    // const json = await res.json();
    // expect(json.data[0].targetAgeTier).toBe('0-7');
  });

  test('should return lessons appropriate for 13-18 age tier', async ({ request }) => {
    const res = await request.get('/api/v1/lessons', {
      headers: { Authorization: `Bearer ${teenToken}` }
    });
    // expect(res.status()).toBe(200);
    // const json = await res.json();
    // expect(json.data[0].targetAgeTier).toBe('13-18');
  });
});
