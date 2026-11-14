import { test, expect } from '../fixtures/fixtures';

test.describe('Transaction History', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.openAllTransactions();
  });

  test('AT-08 newest first, then Credit filter @regression', async ({ historyPage }) => {
    // All transactions: 6 rows, newest first
    await expect(historyPage.rows).toHaveCount(6);
    await expect(historyPage.cell(historyPage.firstRow, 'txn-id')).toHaveText('TXN1006');

    // Credit filter: 2 rows, all Credit
    await historyPage.filterByType('Credit');
    await expect(historyPage.rows).toHaveCount(2);
    for (const cell of await historyPage.typeCells.all()) {
      await expect(cell).toHaveText('Credit');
    }
  });
});
