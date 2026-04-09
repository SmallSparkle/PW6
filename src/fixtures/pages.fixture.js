import { test as base } from '@playwright/test';
import { MainPage } from '../pages/main.page';
import { RegisterPage } from '../pages/register.page';
import { HomePage } from '../pages/home.page';
import { ApiLoginHelper } from '../helpers/api-login.helper';
import { ArticleEditorPage } from '../pages/articleEditor.page';

export const test = base.extend({
    main: async ({ page }, use) => {
        await use(new MainPage(page));
    },

    register: async ({ page }, use) => {
        await use(new RegisterPage(page));
    },

    home: async ({ page }, use) => {
        await use(new HomePage(page));
    },

    apiLogin: async ({ page, request }, use) => {
        await use(new ApiLoginHelper(page, request));
    },
    createArticle: async ({ page }, use) => {
        await use(new ArticleEditorPage(page));
    },
});

export { expect } from '@playwright/test';
