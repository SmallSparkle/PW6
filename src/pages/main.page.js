export class MainPage {

    constructor(page) {
        this.page = page;

        this.URL = 'https://realworld.qa.guru/#';
        this.signUpLink = page.getByRole('link', { name: 'Sign up' });
    }


    async open() {
        await this.page.goto(this.URL);
    };

    async goToSignUpPage() {
        await this.signUpLink.click();
    }

}
