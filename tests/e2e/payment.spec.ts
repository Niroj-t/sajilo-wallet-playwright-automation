import { test, expect } from '../fixtures/fixtures';
import users from '../test-data/users.json';
import boundaries from '../test-data/amount-boundaries.json';

test.describe('Send Money', () => {
  test('AT-05 send Rs. 500 to Sita end to end @smoke', async ({ dashboardPage, paymentPage, historyPage }) => {
    // Step 1: open the payment page from the dashboard
    await dashboardPage.openPayment();

    // Step 2: fill the form
    await paymentPage.fillAndContinue({
      mobile: users.sita.mobile,
      amount: '500',
      purpose: 'Bill Sharing',
    });

    // Step 3: confirm
    await expect(paymentPage.confirmReceiverName).toHaveText('Sita Sharma');
    await expect(paymentPage.confirmAmount).toHaveText('Rs. 500.00');
    await paymentPage.confirmWithPin(users.ram.pin);

    // Step 4: check the result
    await expect(paymentPage.successMessage).toHaveText('Payment Successful');
    await expect(paymentPage.newBalance).toHaveText('Rs. 31,950.00');
    const txnId = await paymentPage.getSuccessTxnId();

    // Step 5: check the side effects (History, then Dashboard)
    await historyPage.goto();
    const firstRow = historyPage.firstRow;
    await expect(historyPage.cell(firstRow, 'txn-id')).toHaveText(txnId);
    await expect(historyPage.cell(firstRow, 'txn-type')).toHaveText('Debit');
    await expect(historyPage.cell(firstRow, 'txn-amount')).toHaveText('Rs. 500.00');

    await dashboardPage.goto();
    await expect(dashboardPage.balance).toHaveText('Rs. 31,950.00');
  });

  for (const b of boundaries) {
    test(`AT-06 amount ${b.amount} is ${b.valid ? 'accepted' : 'rejected'} @regression`, async ({ paymentPage }) => {
      await paymentPage.goto();
      await paymentPage.fillAndContinue({
        mobile: users.sita.mobile,
        amount: b.amount,
        purpose: 'Personal Use',
      });

      if (b.valid) {
        await expect(paymentPage.confirmHeading).toBeVisible();
      } else {
        await expect(paymentPage.amountError).toHaveText(b.message!);
      }
    });
  }

  test('AT-07 wrong PIN blocks the payment @regression', async ({ paymentPage }) => {
    await paymentPage.goto();
    await paymentPage.fillAndContinue({
      mobile: '9800000004',
      amount: '100',
      purpose: 'Personal Use',
    });

    await paymentPage.confirmWithPin('9999');

    await expect(paymentPage.wrongPinError).toBeVisible();
    await expect(paymentPage.successMessage).toHaveCount(0);
  });
});
