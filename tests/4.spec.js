import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

const URL = 'https://realworld.qa.guru/#/register';

const user = {
    userName: faker.person.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
}

async function openPage(page) {
    await page.goto(URL);
    return page;
};

test('User can register using email and password', async ({ page }) => {
    const {userName, email, password} = user;
    
    await openPage(page);

    await page.getByRole('link', { name: 'Sign up' }).click();
    await page.getByRole('textbox', { name: 'Your Name' }).click();
    await page.getByRole('textbox', { name: 'Your Name' }).fill(userName);
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill(email);
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill(password);
    await page.getByRole('button', { name: 'Sign up' }).click();

    await expect(page.getByRole('main')).toContainText('Your Feed');
    // todo может быть проблемный ассерт из-за длинного имени
    await expect(page.getByRole('navigation')).toContainText(userName);
});
