import { Page, Locator } from '@playwright/test';

export class HistoryPage {
  readonly rows: Locator;
  readonly typeCells: Locator;
  readonly typeFilter: Locator;

  constructor(private readonly page: Page) {
    this.rows = page.getByTestId('txn-row');
    this.typeCells = page.getByTestId('txn-type');
    this.typeFilter = page.getByLabel('Type', { exact: true });
  }

  async goto() {
    await this.page.goto('/transactions');
  }

  get firstRow(): Locator {
    return this.rows.first();
  }

  /** A cell inside one row: 'txn-id', 'txn-type' or 'txn-amount'. */
  cell(row: Locator, field: 'txn-id' | 'txn-type' | 'txn-amount'): Locator {
    return row.getByTestId(field);
  }

  async filterByType(type: 'All' | 'Credit' | 'Debit') {
    await this.typeFilter.selectOption(type);
  }
}
