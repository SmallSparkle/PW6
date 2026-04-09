export class HomePage {

    constructor(page) {
        this.page = page;

        this.URL = 'https://realworld.qa.guru/#';
        this.mainContent = page.getByRole('main');
        this.profileName = page.getByRole('.feed-toggle');
        this.newArticleLink = page.getByRole('link', { name: ' New Article' });

    }


    async open() {
        await this.page.goto(this.URL);
    };

    getNewArticle() {
        return this.newArticleLink;
    };

    getMainContent() {
        return this.mainContent;
    }

    getProfileName() {
        return this.profileName;
    }

}
//// await expect(page.getByRole('main')).toContainText('Your Feed');
