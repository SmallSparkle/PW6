const BASE_URL = 'https://realworld.qa.guru';
const LOGIN_URL = `${BASE_URL}/api/users/login`;

export class ApiLoginHelper {

    constructor(page, request) {
        this.page = page;
        this.request = request;
    }

    async login(user) {
        const response = await this.request.post(LOGIN_URL, {
            data: {
                user: {
                    email: user.email,
                    password: user.password,
                },
            },
        });

        if (!response.ok()) {
            throw new Error(`Login request failed with status ${response.status()}`);
        }

        const body = await response.json();
        const loggedInUser = body.user;
        const token = loggedInUser?.token;

        if (!token) {
            throw new Error('Login response does not contain auth token');
        }

        await this.page.context().addInitScript((authData) => {
            const serializedUser = JSON.stringify(authData.user);

            window.localStorage.setItem('jwtToken', authData.token);
            window.localStorage.setItem('token', authData.token);
            window.localStorage.setItem('user', serializedUser);
            window.localStorage.setItem('currentUser', serializedUser);

            window.sessionStorage.setItem('jwtToken', authData.token);
            window.sessionStorage.setItem('token', authData.token);
            window.sessionStorage.setItem('user', serializedUser);
            window.sessionStorage.setItem('currentUser', serializedUser);
        }, { token, user: loggedInUser });

        return loggedInUser;
    }
}
