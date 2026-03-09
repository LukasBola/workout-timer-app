import { test, expect } from '@playwright/test';

test.describe('Timer UI', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('shows idle state on load', async ({ page }) => {
    await expect(page.getByText('Ready')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Start' })).toBeVisible();
  });

  test('can configure settings', async ({ page }) => {
    const workoutInput = page.locator('input[type="number"]').first();
    await workoutInput.fill('45');
    await expect(workoutInput).toHaveValue('45');
  });

  test('starts timer on Start click', async ({ page }) => {
    await page.getByRole('button', { name: 'Start' }).click();
    // Should see preparation or work phase
    await expect(page.locator('.phase-label').filter({ hasText: /^(Get Ready!|Workout)$/ })).toBeVisible({ timeout: 2000 });
    await expect(page.getByRole('button', { name: 'Pause' })).toBeVisible();
  });

  test('can pause and resume timer', async ({ page }) => {
    await page.getByRole('button', { name: 'Start' }).click();
    await page.getByRole('button', { name: 'Pause' }).click();
    await expect(page.getByRole('button', { name: 'Resume' })).toBeVisible();
    await page.getByRole('button', { name: 'Resume' }).click();
    await expect(page.getByRole('button', { name: 'Pause' })).toBeVisible();
  });

  test('can reset timer', async ({ page }) => {
    await page.getByRole('button', { name: 'Start' }).click();
    await page.getByRole('button', { name: 'Reset' }).click();
    await expect(page.getByText('Ready')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Start' })).toBeVisible();
  });

  test('settings are disabled while timer is active', async ({ page }) => {
    await page.getByRole('button', { name: 'Start' }).click();
    const inputs = page.locator('.settings-form input');
    for (const input of await inputs.all()) {
      await expect(input).toBeDisabled();
    }
  });
});
