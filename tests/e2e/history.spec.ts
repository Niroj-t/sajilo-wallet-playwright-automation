import { test, expect } from '../fixtures/fixtures';

test.describe('Transaction History', () => {
  test.beforeEach(async ({ loggedInPage: page }) => {
    await page.getByRole('link', { name: 'View All Transactions' }).click();
  });

  test('AT-08 newest first, then Credit filter @regression', async ({ loggedInPage: page }) => {
    // All transactions: 6 rows, newest first
    await expect(page.getByTestId('txn-row')).toHaveCount(6);
    await expect(page.getByTestId('txn-row').first().getByTestId('txn-id')).toHaveText('TXN1006');

    // Credit filter: 2 rows, all Credit
    await page.getByLabel('Type', { exact: true }).selectOption('Credit');
    await expect(page.getByTestId('txn-row')).toHaveCount(2);
    for (const cell of await page.getByTestId('txn-type').all()) {
      await expect(cell).toHaveText('Credit');
    }
  });
});
