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

App integration:

```typescript jsx
// This is for routing, not for accounts
import {WithLoginFlow} from './WithLoginFlow';

const routingStore = createRoutingStore();
const authBackedn =
... // you need to bring your Auth Backend

// We will use this on the login form
const Splash = () => <h1>Welcome to my app!</h1>;

export const App = () => (
    <StellarRouterProvider store={routingStore}>
        <WithLoginFlow splash={<Splash/> backend={authBackend}}>
            <MainAppLayout/>
        </With>
    </StellarRouterProvider>
);
```

This is required to set up the paths that will go into the various account-related emails
so that it matches with the client-side routing.

## See also

- The UI used by this package is shipped in
  [@moxb/shards-accounts-ui-antd](https://www.npmjs.com/package/@moxb/shards-account-ui-antd).
- An example auth backend if provided by
  [@moxb/shards-accounts-meteor](https://www.npmjs.com/package/@moxb/shards-account-meteor).
