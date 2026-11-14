import { test, expect } from '@playwright/test';
import users from '../test-data/users.json';
import negatives from '../test-data/login-negative.json';

test.describe('Login', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post('/api/test/reset');
    await page.goto('/login');
  });

  test('AT-01 valid login opens the dashboard @smoke', async ({ page }) => {
    await page.getByLabel('Username').fill(users.ram.username);
    await page.getByLabel('Password').fill(users.ram.password);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByTestId('welcome-message')).toHaveText('Namaste, Ram Thapa');
  });

  for (const data of negatives) {
    test(`AT-02 ${data.id} login fails: ${data.title} @regression`, async ({ page }) => {
      await page.getByLabel('Username').fill(data.username);
      await page.getByLabel('Password').fill(data.password);
      await page.getByRole('button', { name: 'Login' }).click();

      await expect(page.getByTestId(data.field)).toHaveText(data.message);
      await expect(page).toHaveURL(/\/login$/);
    });
  }
});
