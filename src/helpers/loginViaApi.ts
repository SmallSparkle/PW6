import { APIRequestContext, BrowserContext, request } from '@playwright/test';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UserCredentials {
  email: string;
  password: string;
}

/** Exact shape returned by POST /api/users/login */
export interface LoggedInUser {
  email: string;
  username: string;
  bio: string | null;
  image: string | null;
  token: string;
}

/**
 * Exact structure the app writes to localStorage after a successful login.
 *
 * Key: "loggedUser"
 * {
 *   headers:    { Authorization: "Token <jwt>" }
 *   isAuth:     true
 *   loggedUser: { email, username, bio, image, token }
 * }
 */
interface AppAuthState {
  headers: { Authorization: string };
  isAuth: boolean;
  loggedUser: LoggedInUser;
}

const BASE_URL = 'https://realworld.qa.guru';
const LS_KEY = 'loggedUser'; // single localStorage key the app reads

// ─── Core login ───────────────────────────────────────────────────────────────

/**
 * Calls POST /api/users/login and returns the logged-in user object.
 * Throws a descriptive error on any non-2xx response.
 */
export async function loginViaApi(
  credentials: UserCredentials,
  apiContext?: APIRequestContext,
): Promise<LoggedInUser> {
  const ctx = apiContext ?? (await request.newContext({ baseURL: BASE_URL }));

  const response = await ctx.post('/api/users/login', {
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    data: {
      user: {
        email: credentials.email,
        password: credentials.password,
      },
    },
  });

  if (!response.ok()) {
    const body = await response.text();
    throw new Error(`Login failed [${response.status()}]: ${body}`);
  }

  const { user } = await response.json();
  return user as LoggedInUser;
}

// ─── Browser-context helpers ──────────────────────────────────────────────────

/**
 * Builds the localStorage payload the app expects from a LoggedInUser.
 */
function buildAppAuthState(user: LoggedInUser): AppAuthState {
  return {
    headers: { Authorization: `Token ${user.token}` },
    isAuth: true,
    loggedUser: user,
  };
}

/**
 * Logs in via API and injects the correct localStorage state into the browser
 * context so every page opened from it is already authenticated.
 *
 * Call this BEFORE opening any page in the context.
 *
 * @example
 * // inside a custom fixture or beforeEach
 * const user = await loginAndSetToken(context, credentials);
 * const page = await context.newPage();
 * await page.goto('/');   // ✅ already logged in as user.username
 */
export async function loginAndSetToken(
  context: BrowserContext,
  credentials: UserCredentials,
): Promise<LoggedInUser> {
  const user = await loginViaApi(credentials);
  const authState = buildAppAuthState(user);

  await context.addInitScript(
    ({ key, value }: { key: string; value: string }) => {
      window.localStorage.setItem(key, value);
    },
    { key: LS_KEY, value: JSON.stringify(authState) },
  );

  return user;
}

// ─── Global-setup helper (storageState) ───────────────────────────────────────

/**
 * Logs in once and saves auth state to a JSON file.
 * Reference the file via `storageState` in playwright.config.ts so every
 * test starts pre-authenticated without repeating the login flow.
 *
 * @example
 * // global-setup.ts
 * import { saveAuthState } from './helpers/loginViaApi';
 * export default async () => {
 *   await saveAuthState(
 *     { email: 'a.kortikova12321232@gmail.com', password: '12345' },
 *     'playwright/.auth/user.json',
 *   );
 * };
 *
 * // playwright.config.ts
 * export default defineConfig({
 *   globalSetup: './global-setup.ts',
 *   use: { storageState: 'playwright/.auth/user.json' },
 * });
 */
export async function saveAuthState(
  credentials: UserCredentials,
  storageStatePath: string,
): Promise<LoggedInUser> {
  const { chromium } = await import('@playwright/test');

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const user = await loginAndSetToken(context, credentials);

  // Navigate to the origin so the initScript fires and localStorage is written
  const page = await context.newPage();
  await page.goto(BASE_URL);

  await context.storageState({ path: storageStatePath });

  await context.close();
  await browser.close();

  return user;
}