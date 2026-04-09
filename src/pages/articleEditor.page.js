export class ArticleEditorPage {

  constructor(page) {
    this.page = page;

    this.articleTitle = page.getByRole('textbox', { name: 'Article Title' });
    this.articleDescription = page.getByRole('textbox', { name: "What's this article about?" });
    this.articleBody = page.getByRole('textbox', { name: 'Write your article (in' });
    this.publishButton = page.getByRole('button', { name: 'Publish Article' });
    this.articleHeading = (title) => page.getByRole('heading', { name: title, level: 1 });
    this.articleBodyText = page.getByRole('paragraph');
  }

  async createArticle(article) {
    const {title, description, body} = article;

    await this.articleTitle.fill(title);
    await this.articleDescription.fill(description);
    await this.articleBody.fill(body);

    const responsePromise = this.page.waitForResponse(
      response =>
        response.url().includes('/api/articles') &&
        response.request().method() === 'POST' &&
        response.status() === 201,
    );

    await this.publishButton.click();

    return responsePromise;
  }

}
