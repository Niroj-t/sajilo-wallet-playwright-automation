import { test, expect } from '../fixtures/fixtures';
import users from '../test-data/users.json';
import negatives from '../test-data/login-negative.json';

test.describe('Login', () => {
  test('AT-01 valid login opens the dashboard @smoke', async ({ page, loginPage }) => {
    await loginPage.login(users.ram.username, users.ram.password);

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(loginPage.welcomeMessage).toHaveText('Namaste, Ram Thapa');
  });

  for (const data of negatives) {
    test(`AT-02 ${data.id} login fails: ${data.title} @regression`, async ({ page, loginPage }) => {
      await loginPage.login(data.username, data.password);

      await expect(loginPage.errorFor(data.field)).toHaveText(data.message);
      await expect(page).toHaveURL(/\/login$/);
    });
  }
});
