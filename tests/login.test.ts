import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/Login.page';

const REQUIRED_FIELD = 'This is a required field';
const INVALID_USERNAME = 'invalid_user_qa_001';
const INVALID_PASSWORD = 'WrongPassword!001';

test.describe('Login — /login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.expectOnLoginPage();
  });

  test.describe('positive', () => {
    test('login page shows username, password, and login controls', async () => {
      await expect(loginPage.usernameLabel).toBeVisible();
      await expect(loginPage.passwordLabel).toBeVisible();
      await expect(loginPage.loginButton).toBeVisible();
      await expect(loginPage.forgotPasswordLink).toBeVisible();
      await expect(loginPage.rememberMeCheckbox).toBeVisible();
    });

    test('login with valid credentials redirects away from /login', async () => {
      await loginPage.loginWithEnv();
      await loginPage.expectSuccessfulLogin();
    });

    test('login with remember me checked succeeds', async () => {
      const username = process.env.LOGIN_USERNAME || '';
      const password = process.env.LOGIN_PASSWORD || '';
      await loginPage.login(username, password, { rememberMe: true });
      await loginPage.expectSuccessfulLogin();
    });

    test('forgot password link navigates to /forgot-password', async ({
      page,
    }) => {
      await loginPage.clickForgotPassword();
      await expect(page).toHaveURL(/\/forgot-password/);
    });
  });

  test.describe('negative', () => {
    test('empty username and password show required field errors', async () => {
      await loginPage.clickLogin();
      await loginPage.expectUsernameRequired(REQUIRED_FIELD);
      await loginPage.expectPasswordRequired(REQUIRED_FIELD);
      await loginPage.expectStillOnLoginPage();
      await expect(loginPage.loginError).toBeHidden();
    });

    test('empty username shows required field error', async () => {
      await loginPage.fillPassword(INVALID_PASSWORD);
      await loginPage.clickLogin();
      await loginPage.expectUsernameRequired(REQUIRED_FIELD);
      await loginPage.expectStillOnLoginPage();
    });

    test('empty password shows required field error', async () => {
      await loginPage.fillUsername(INVALID_USERNAME);
      await loginPage.clickLogin();
      await loginPage.expectPasswordRequired(REQUIRED_FIELD);
      await loginPage.expectStillOnLoginPage();
    });

    test('whitespace-only credentials show required field errors', async () => {
      await loginPage.fillUsername('   ');
      await loginPage.fillPassword('   ');
      await loginPage.clickLogin();
      await loginPage.expectUsernameRequired(REQUIRED_FIELD);
      await loginPage.expectPasswordRequired(REQUIRED_FIELD);
      await loginPage.expectStillOnLoginPage();
    });

    test('invalid credentials show login error and stay on /login', async () => {
      await loginPage.login(INVALID_USERNAME, INVALID_PASSWORD);
      await loginPage.expectLoginErrorVisible();
      await loginPage.expectStillOnLoginPage();
    });

    test('valid username with wrong password shows login error', async () => {
      const username = process.env.LOGIN_USERNAME || INVALID_USERNAME;
      await loginPage.login(username, INVALID_PASSWORD);
      await loginPage.expectLoginErrorVisible();
      await loginPage.expectStillOnLoginPage();
    });
  });
});
