import { expect, type Page } from '@playwright/test';

/**
 * 16 — EDI Document view at /payments/edi-document
 * therapy-UI: features/payments/pages/EdiDocumentViewPage.tsx
 */
export class EdiDocumentViewPage {
  readonly page: Page;
  readonly path: string;

  constructor(page: Page) {
    this.page = page;
    this.path = '/payments/edi-document';
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }

  async expectOnPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/payments\/edi-document/);
  }
}
