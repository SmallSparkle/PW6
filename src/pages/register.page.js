export class RegisterPage {

    constructor(page) {
        this.page = page;

        this.URL = 'https://realworld.qa.guru/#/register';
        this.nameInput = page.getByRole('textbox', { name: 'Your Name' });
        this.emailInput = page.getByRole('textbox', { name: 'Email' });
        this.passwordInput = page.getByRole('textbox', { name: 'Password' });
        this.signUpButton = page.getByRole('button', { name: 'Sign up' })
    }

    async signup(user) {
        const {userName, email, password} = user;

        await this.nameInput.click();
        await this.nameInput.fill(userName);
        await this.emailInput.click();
        await this.emailInput.fill(email);
        await this.passwordInput.click();
        await this.passwordInput.fill(password);
        await this.signUpButton.click();
    };
}
