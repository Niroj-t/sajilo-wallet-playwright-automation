import { Page, Locator } from '@playwright/test';

export class DashboardPage {
  readonly balance: Locator;
  readonly walletId: Locator;
  readonly recentTransactions: Locator;
  readonly hideBalanceButton: Locator;
  readonly showBalanceButton: Locator;
  readonly makePaymentLink: Locator;
  readonly viewAllTransactionsLink: Locator;

  constructor(private readonly page: Page) {
    this.balance = page.getByTestId('balance-amount');
    this.walletId = page.getByTestId('wallet-id');
    this.recentTransactions = page.getByTestId('recent-txn');
    this.hideBalanceButton = page.getByRole('button', { name: 'Hide balance' });
    this.showBalanceButton = page.getByRole('button', { name: 'Show balance' });
    this.makePaymentLink = page.getByRole('link', { name: 'Make a Payment' });
    this.viewAllTransactionsLink = page.getByRole('link', { name: 'View All Transactions' });
  }

  async goto() {
    await this.page.goto('/dashboard');
  }

  async hideBalance() {
    await this.hideBalanceButton.click();
  }

  async showBalance() {
    await this.showBalanceButton.click();
  }

  async openPayment() {
    await this.makePaymentLink.click();
  }

  async openAllTransactions() {
    await this.viewAllTransactionsLink.click();
  }
}
