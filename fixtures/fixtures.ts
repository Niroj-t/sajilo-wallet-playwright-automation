import { test as base, expect, Page } from '@playwright/test';
import users from '../test-data/users.json';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { PaymentPage } from '../pages/PaymentPage';
import { HistoryPage } from '../pages/HistoryPage';

type MyFixtures = {
  loginPage: LoginPage;      // reset data, open /login (not logged in)
  loggedInPage: Page;        // reset data, log in as Ram, land on /dashboard
  dashboardPage: DashboardPage;
  paymentPage: PaymentPage;
  historyPage: HistoryPage;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page, request }, use) => {
    await request.post('/api/test/reset');
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },

  loggedInPage: async ({ page, loginPage }, use) => {
    await loginPage.login(users.ram.username, users.ram.password);
    await expect(page).toHaveURL(/\/dashboard$/);
    await use(page);
  },

  dashboardPage: async ({ loggedInPage }, use) => {
    await use(new DashboardPage(loggedInPage));
  },
  paymentPage: async ({ loggedInPage }, use) => {
    await use(new PaymentPage(loggedInPage));
  },
  historyPage: async ({ loggedInPage }, use) => {
    await use(new HistoryPage(loggedInPage));
  },
});

export { expect };
