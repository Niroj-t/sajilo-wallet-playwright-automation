import { Page, Locator } from '@playwright/test';

export type PaymentDetails = {
  mobile: string;
  amount: string;
  purpose: string;
};

export class PaymentPage {
  // Step 1: form
  readonly receiverInput: Locator;
  readonly amountInput: Locator;
  readonly purposeSelect: Locator;
  readonly continueButton: Locator;
  readonly amountError: Locator;

  // Step 2: confirm
  readonly confirmHeading: Locator;
  readonly confirmReceiverName: Locator;
  readonly confirmAmount: Locator;
  readonly pinInput: Locator;
  readonly confirmButton: Locator;
  readonly wrongPinError: Locator;

  // Step 3: result
  readonly successMessage: Locator;
  readonly newBalance: Locator;
  readonly successTxnId: Locator;

  constructor(private readonly page: Page) {
    this.receiverInput = page.getByLabel('Receiver mobile number');
    this.amountInput = page.getByLabel('Amount (Rs.)');
    this.purposeSelect = page.getByLabel('Purpose');
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.amountError = page.getByTestId('amount-error');

    this.confirmHeading = page.getByRole('heading', { name: 'Confirm Payment' });
    this.confirmReceiverName = page.getByTestId('confirm-receiver-name');
    this.confirmAmount = page.getByTestId('confirm-amount');
    this.pinInput = page.getByLabel('Transaction PIN');
    this.confirmButton = page.getByRole('button', { name: 'Confirm Payment' });
    this.wrongPinError = page.getByText('Incorrect transaction PIN');

    this.successMessage = page.getByTestId('success-message');
    this.newBalance = page.getByTestId('new-balance');
    this.successTxnId = page.getByTestId('success-txn-id');
  }

  async goto() {
    await this.page.goto('/payment');
  }

  async fillAndContinue({ mobile, amount, purpose }: PaymentDetails) {
    await this.receiverInput.fill(mobile);
    await this.amountInput.fill(amount);
    await this.purposeSelect.selectOption(purpose);
    await this.continueButton.click();
  }

  async confirmWithPin(pin: string) {
    await this.pinInput.fill(pin);
    await this.confirmButton.click();
  }

  async getSuccessTxnId(): Promise<string> {
    return ((await this.successTxnId.textContent()) ?? '').trim();
  }
}
