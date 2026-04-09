import { test, expect } from '../src/fixtures/pages.fixture';
import { faker } from '@faker-js/faker';


const user = {
    userName: faker.person.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
}

test('User can register using email and password', async ({ main, register, home }) => {
    await main.open();
    await main.goToSignUpPage();
    await register.signup(user)

    await expect(home.getMainContent()).toContainText('Your Feed');
    await expect(home.getProfileName()).toContainText(user.userName);
});
