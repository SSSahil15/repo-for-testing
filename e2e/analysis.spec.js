import { test, expect } from '@playwright/test';

test.describe('Dashboard & Analysis Flow', () => {
  // We can't easily mock auth state without a mock server or specific setup in E2E
  // But we can test if the dashboard loads its shell and redirects to login if unauthenticated
  test('should redirect to login if unauthenticated', async ({ page }) => {
    await page.goto('/');
    
    // DevPulse redirects to login when no token is present
    await expect(page).toHaveURL(/.*\/login/);
  });
});
