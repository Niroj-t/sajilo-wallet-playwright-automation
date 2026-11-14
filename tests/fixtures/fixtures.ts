import { test as base, expect, Page } from '@playwright/test';
import users from '../test-data/users.json';

type MyFixtures = { loggedInPage: Page };

export const test = base.extend<MyFixtures>({
  loggedInPage: async ({ page, request }, use) => {
    // 1. Put the app data back to its starting state, so every test starts the same
    await request.post('/api/test/reset');

    // 2. Open /login and log in as Ram
    await page.goto('/login');
    await page.getByLabel('Username').fill(users.ram.username);
    await page.getByLabel('Password').fill(users.ram.password);
    await page.getByRole('button', { name: 'Login' }).click();

    // 3. Make sure we really reached the Dashboard
    await expect(page).toHaveURL(/\/dashboard$/);

    await use(page); // the test runs here, already logged in
  },
});

export { expect };
