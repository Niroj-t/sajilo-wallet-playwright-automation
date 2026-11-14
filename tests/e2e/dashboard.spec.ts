import { test, expect } from '../fixtures/fixtures';
import users from '../test-data/users.json';

test.describe('Dashboard', () => {
  test('AT-03 shows balance, wallet ID and recent transactions @smoke', async ({ dashboardPage }) => {
    await expect(dashboardPage.balance).toHaveText('Rs. 32,450.00');
    await expect(dashboardPage.walletId).toHaveText(users.ram.mobile);
    await expect(dashboardPage.recentTransactions).toHaveCount(3);
  });

  test('AT-04 hide and show balance @regression', async ({ dashboardPage }) => {
    await dashboardPage.hideBalance();
    await expect(dashboardPage.balance).toHaveText('Rs. XXXX.XX');

    await dashboardPage.showBalance();
    await expect(dashboardPage.balance).toHaveText('Rs. 32,450.00');
  });
});
