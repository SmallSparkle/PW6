export class YourFeedPage {

    constructor(page) {
        this.page = page;

        this.URL = 'https://realworld.qa.guru/#';
        this.mainContent = page.getByRole('main');
        this.profileName = page.getByRole('navigation');
    }


    async open() {
        await this.page.goto(this.URL);
    };

    getMainContent() {
        return this.mainContent;
    }

    getProfileName() {
        return this.profileName;
    }

}
//// await expect(page.getByRole('main')).toContainText('Your Feed');