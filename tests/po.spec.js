import { test, expect } from '../src/fixtures/pages.fixture';
import { loginAndSetToken } from '../src/helpers/loginViaAPI';
import { faker } from '@faker-js/faker';
import { credentials } from '../src/test-data/credentials.local';

const article = {
    title: faker.lorem.words(3),
    description: faker.lorem.sentence(),
    body: faker.lorem.paragraph(),
    tags: faker.lorem.word(2),
};

test.describe('Articles', () => {
  test.beforeEach(async ({ context }) => {
    await loginAndSetToken(context, credentials);
  });

  test.only('Create a new article', async ({ home, createArticle, page }) => {
    await home.open();
    await home.getNewArticle().click();
    await createArticle.createArticle(article);

    await expect(page).toHaveURL(new RegExp(`/#/article/${article.title.replace(/\s+/g, '-')}`));
    await expect(page.getByRole('heading', { level: 1 })).toMatchAriaSnapshot(`- heading "${article.title}" [level=1]`);    
    await expect(page.getByRole('paragraph')).toContainText(article.body);
});

  test('Delete an article', async ({ page }) => {
    await home.open();
    await home.getNewArticle().click();
    await createArticle.createArticle(article);
  });

});
