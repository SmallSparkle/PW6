import { test, expect } from '../fixtures/pages.fixture';
import { faker } from '@faker-js/faker';


const user = {
    userName: faker.person.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
}

test.only('User can register using email and password', async ({ main, register, yourFeed }) => {
    await main.open();
    await main.goToSignUpPage();
    await register.signup(user)

    await expect(yourFeed.getMainContent()).toContainText('Your Feed');
    await expect(yourFeed.getProfileName()).toContainText(user.userName);
});
