import { test as base } from '@playwright/test';
import { MainPage } from '../src/pages/main.page';
import { RegisterPage } from '../src/pages/register.page';
import { YourFeedPage } from '../src/pages/yourfeed.page';

export const test = base.extend({
    main: async ({ page }, use) => {
        await use(new MainPage(page));
    },

    register: async ({ page }, use) => {
        await use(new RegisterPage(page));
    },

    yourFeed: async ({ page }, use) => {
        await use(new YourFeedPage(page));
    },
});

export { expect } from '@playwright/test';
