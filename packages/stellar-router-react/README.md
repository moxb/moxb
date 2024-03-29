# Stellar Router - React

Stellar Router is a router for web applications. This package provides the React integration.
For more info about the design goals and features of this routing system,
see the [@moxb/stellar-router-core](https://www.npmjs.com/package/@moxb/stellar-router-core) package.

## Usage

### Initialization

On application boot, you should set up your `routingStore` instance.
Then you should rap your application with the `<StellarRouterProvider>` component,
and pass in the created routing store:

```typescript jsx
const routingStore = createRoutingStore();

const App = () => (
    <StellarRouterProvider store={routingStore} >
        <MainAppLayout />
    </StellarRouterProvider>
);
```

Now you can start to add routing- and navigation-related React components to
your app, and they will automatically connect to the routing store.
To manually access the individual store components from your code, you can use
the provided `useLocationManager()`, `useTokenManager()` and `useLinkGenerator()`
React hooks.

### Defining the state space for UI.

When defining the state space, instead of the generic `StateSpace` interface, we will use the `StateSpaceUI` interface,
which defines that the every menu labels is a `UIFragment` and app content is specified by `UIFragmentSpec`.

```typescript jsx
export const mainMenu: UIStateSpace = {
    subStates: [
        {
            root: true,
            fragment: <div>Welcome!</div>,
        },
        {
            key: 'one',
            fragment: <div>Part One</div>,
        },
        {
            key: 'two',
            fragment: <div>Part Two</div>,
        },
        {
            key: 'three',
            label: <b>Three</b>,
            fragment: <div>Part Three</div>,
        }
    ],
};
```

### Showing content based on state

The main entry point here the `<LocationDependentArea>` component. Basically, this is a React component
that you can place somewhere on your layout, and it will display content that is appropriate, based on the current
state of the application, as described in the state space.

(Naturally, `LocationDependentArea` needs to be provided with the definition of the state space.)

This component doesn't actually _control_ any navigation events, it just sits there and renders the current content,
based on the URL.

Basic example:
```typescript jsx
import { mainMenu } from "./menu-structure.tsx";

const MainAppLayout = () => (
    <div>
        <h1>My cool app</h1>
        <LocationDependentArea
            id="main-app-layout"
            stateSpace={mainMenu}
        />
    </div>
);
```

See [LocationDependentAreaProps](https://github.com/moxb/moxb/blob/master/packages/stellar-router-react/src/LocationDependentAreaProps.ts) for configuration options.

Another important widget is `rootOrDetails`.

```typescript jsx
// TODO
```

### Widgets

 * The most important widget for navigation is the `<NavLink>`,
which can render a link that will trigger navigation changes.

Basic examples:

```typescript jsx
// Prepare an UrlArg for interacting with the "lang" url query param
const lang = locationManager.defineStringArg("lang", "en");

const links = () => (
    <div>
        <NavLink to={["foo", "bar"]}>
            Go to /foo/bar
        </NavLink>
        <NavLink appendTokens={["fav"]}>
            Append /fav to the current path
        </NavLink>
        <NavLink removeTokenCount={1}>
            Go up one level
        </NavLink>
        <NavLink argChanges={[setArg(lang, "de")]}>
            Switch to German
        </NavLink>
    </div>
);
```
See [CoreLinkProps](https://github.com/moxb/moxb/blob/master/packages/stellar-router-core/src/linking/CoreLinkProps.ts)
and [AnchorParams](https://github.com/moxb/moxb/blob/master/packages/react-html/src/Anchor.tsx) about supported parameters.

 * Besides `NavLink`, there is also `BoundNavLink`, which is similar to `NavLink`,
   except that it takes the information about where to go from a `BoundLink`,
   which is a data object probably living in a store, and is passed to the UI widget as the `operation` prop,
   in the usual `@moxb/moxb` fashion.

 * Another way to change the location is to use a Redirect widget: rendering `<Redirect to={["foo", "bar"]} />` will
navigate the application to `/foo/bar`.

 * The `NavRefRedirect` component is responsible for executing redirects based on base64-encoded `NavRef` links.
Just put it into a menu (under the preferred url prefix used for the redirects),
and it will handle the rest. I.e. add this to the root state space:

```typescript
{
    key: 'redirects',
    hidden: true,
    fragment: NavRefRedirect,
},
```

## See also
* [@moxb/stellar-router-core](https://www.npmjs.com/package/@moxb/stellar-router-core) for the core router package
* [@moxb/stellar-router-antd](https://www.npmjs.com/package/@moxb/stellar-router-antd) provides further navigational widgets
  (menus etc.) built using the Ant Design library.
