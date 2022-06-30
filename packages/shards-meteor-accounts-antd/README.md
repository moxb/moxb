# Shards - Meteor User Accounts with Ant Design

This package provides a _very basic_ solution for common user account workflows for Meteor applications.

**This is considered to be W.I.P.**

## Assumptions:
 - You are building a Meteor application, with a React UI
 - Client-side routing is provided by Stellar Router

## Features

* This is based on normal Meteor accounts.
* If the user is not logged in, he will be automatically redirected to the login form.
* User login, registration, password reset request and password reset are supported.
* After successful login, the user is redirected to the original location he tried to visit.

## Quick start

### Client side:

App integration:

```typescript jsx
// This is for routing, not for accounts
const routingStore = createRoutingStore();

// We will use this on the login form
const Splash = () => <h1>Welcome to my app!</h1>;

export const App = () => (
    <StellarRouterProvider store={routingStore}>
        <LoginRequired splash={<Splash />}>
            <MainAppLayout />
        </LoginRequired>
    </StellarRouterProvider>
);
```

Other:
 - For logging out, you can use `userLogout()` function or the `<LogoutButton>`
 - To check the currently active user, you can use the `useMeteorUserId()` and `useMeteorUser()` React hooks
   from the `@moxb/meteor-react` package.

### Server side:

```typescript
setupUserAccounts()
```

This is required to set up the paths that will go into the various account-related emails
so that it matches with the client-side routing.

## See also

The whole UI for this package comes from `@moxb/shards-accounts-ui-antd`.
