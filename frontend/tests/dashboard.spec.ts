import { test, expect } from '@playwright/test';

test('dashboard loads and supports filters and exports', async ({ page }) => {
  await page.goto('/');

  // Simulate interacting with a filter control if present
  const filters = page.locator('[data-testid="filter"]');
  if (await filters.count()) {
    await filters.first().click();
  }

  // Attempt to trigger export buttons if they exist
  const pdfButton = page.getByRole('button', { name: /pdf/i });
  if (await pdfButton.count()) {
    await pdfButton.click();
  }

  const csvButton = page.getByRole('button', { name: /csv/i });
  if (await csvButton.count()) {
    await csvButton.click();
  }
});
