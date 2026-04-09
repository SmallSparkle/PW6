import { test, expect } from '@playwright/test';

test('Поиск ролевых селекторов', async ({ page }) => {
  await page.goto('file:///Users/anastasiabespalova/Projects/burger-order.html');
  
  await page.getByRole('textbox', { name: 'Имя клиента:' }).fill('Sniper');
  await page.getByRole('combobox', { name: 'Тип бургера:' }).selectOption('cheeseburger');
  await page.getByRole('radio', { name: 'Средний' }).click();
  await page.getByRole('checkbox', { name: 'Горчица' }).click();
//   await page.getByRole('checkbox', { name: 'Да' }).check(); // ToDO check() dosent work
await page.getByRole('button', { name: '+' }).click();
await page.getByRole('radio', { name: 'Картой онлайн' }).click();
await page.getByRole('button', { name: 'Заказать бургер' }).click();

await expect(page.locator('h2')).toContainText('✅ Заказ принят!');
await expect(page.locator('#popup')).toMatchAriaSnapshot(`- button "Закрыть"`);
});

test('Поиск селекторов по классу', async ({ page }) => {
    await page.goto('file:///Users/anastasiabespalova/Projects/burger-order.html');

    await page.locator('.order-form').locator('.form-group').locator('input').first().fill('Sniper');
    await page.locator('.order-form').locator('select').first().selectOption('cheeseburger');
    await page.locator('.radio-group').filter({hasText: 'Большой'}).click();
    await page.locator('.checkbox-group').filter({hasText: 'Горчица'}).click();
    await page.locator('.switch-label').click();
    await page.locator('.counter-increase').click();
    await page.locator('.radio-group').filter({hasText: 'Картой онлайн'}).click();
    await page.locator('.btn-primary').first().click();
// todo
    await expect(page.getByRole('heading', { name: '✅ Заказ принят!'})).toBeVisible();

  });

  test('Поиск селекторов по ID', async ({ page }) => {
    await page.goto('file:///Users/anastasiabespalova/Projects/burger-order.html');

    await page.locator('#customerName').fill('Sniper');
    await page.locator('#burgerType').selectOption('cheeseburger');
    await page.locator('#quantity').fill('2');

    await page.getByRole('button', { name: 'Заказать бургер' }).click();

// todo
    await expect(page.getByRole('heading', { name: '✅ Заказ принят!'})).toBeVisible();

  });
  test('Поиск селекторов по атрибуту и значению', async ({ page }) => {
    await page.goto('file:///Users/anastasiabespalova/Projects/burger-order.html');

    await page.locator('[name="customerName"]').fill('Sniper');
    await page.locator('[name="burgerType"]').selectOption('cheeseburger');
    await page.locator('#quantity').fill('2');
    await page.getByRole('button', { name: 'Заказать бургер' }).click();

// todo
    await expect(page.getByRole('heading', { name: '✅ Заказ принят!'})).toBeVisible();

  });
  