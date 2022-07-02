# Shards - User Login workflow with Ant Design

This package provides a _very basic_ solution for common user account workflows.

**This is considered to be W.I.P.**

### Assumptions:

- You are building a React application
- Client-side routing is provided by Stellar Router
- You want to use Ant Design for the UI

## Features

* If the user is trying to access a restricted part of the application,
  and is not logged in, he will be automatically redirected to the login form.
* User login, registration, password reset request and password reset are supported.
* After successful login, the user is redirected to the original location he tried to visit.

## Quick start

### Client side:

Basic app integration:

```typescript jsx
// This is for routing, not for accounts
import {SimpleLoginApp} from './WithLoginFlow';

const routingStore = createRoutingStore();

// you need to bring your Auth Backend
const authBackedn = new RandomAuthBackend();

// We will use this on the login form
const Splash = () => <h1>Welcome to my app!</h1>;

export const App = () => (
    <StellarRouterProvider store={routingStore}>
        <SingleLoginApp splash={<Splash/> backend={authBackend}}>
            <MainAppLayout/>
        </SingleLoginApp>
    </StellarRouterProvider>
);
```

- It's also possible to arrange it so that some part of the app is available
  without login, but a restricted part is not.
  In that case, wrap the root of the app with `<WithLoginFlow>`,
  and the restricted part with `<OnlyUsers>`.
- There is also `<LogoutButton />` that you can use for logging out.

## See also

- The UI used by this package is shipped in
  [@moxb/shards-accounts-ui-antd](https://www.npmjs.com/package/@moxb/shards-account-ui-antd).
- An example auth backend if provided by
  [@moxb/shards-accounts-meteor](https://www.npmjs.com/package/@moxb/shards-account-meteor).
