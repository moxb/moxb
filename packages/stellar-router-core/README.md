# Stellar Router - core

Stellar Router is a router for web applications.

## Features and design goals

 - It should be implemented in TypeScript, with strong type safety
 - It should integrate with mobx reactivity.
 - The app developer should be able to describe the structure of the application
   in a single location of the code.
 - The application structure is described as a state-space,
   which consists of various sub-states.
 - A sub-state is usually identified by some key, which might (or might not) be
   a part of the URL.
 - Various parts of the UI will change based on where are we inside the
   state-space of the application. (Which sub-state.)
 - The sub-states can be divided further into even smaller sub-states.
 - The menu structure consists of a description of the sub-states,
   similar to a tree.
 - This menu structure, this single source of truth should be used
   to render the menus, links, and execute the actual routing.
   So it should be impossible to add a new sub-state and forget to display it
   in the menu, or adding a new menu item but forgetting to set up the routing,
   or accidentally misspelling the path in any of the two.
 - It should be possible to freely embed these sub-state trees into each other,
   and on the code level, they should remain independent,
   so that the different parts of the application can define
   their own sub state-spaces (i.e. menus and routing) independently.
 - It should be possible to math our location in the application state-space to
   the path in the URL. The connection should be fully automatic in all directions,
   without requesting assistance from the app developer.
 - The processing of the elements of the path should be a hierarchical process:
   on one level we consume one token and select a sub-state based on that, and then
   transfer the remaining part of the path to the next level, so that they can be
   mapped to any sub-states there.
 - It should also be possible to use query parameters, instead of the path.
 - The routing system should be capable to consider permissions.
   - Again, do the same thing consistently for the actual routing
     and rendering the menus.
   - The actual permission system should be flexible;
     i.e. left for the application to control.
 - It should be possible to generate links (for example to be used in emails)
   that are permanent in the sense that they can be resolved even if we have
   reorganized the menu structure in the meantime.
 - The router should be independent of UI frameworks.
 - (I.e. not strongly coupled to React.)

## Features in the core packages

 * The interfaces for defining the state-space and the sub-states.
 * The code for navigating these state-spaces
 * The code for interacting with browser history, defining variables
   mapped to the URL, etc
 * The code and interfaces for the interactive processing of the path tokens
   on multiple levels, and the interaction between the levels

## Usage

The following links should work if you are reading this
[on GitHub](https://github.com/moxb/moxb/blob/master/packages/stellar-router-core/).

### Initialization

You should be using something like [@moxb/stellar-router-react](../stellar-router-react) package for integrating this to your app.

### Using different URL schemes

Stellar Router works with work with
 - hash-based URLs: www.example.com/#/a/b/c?foo=bar
 - query-based URLs: www.example.com/?path=a&foo=bar
 - native URLs: www.example.com/a/b/c?foo=bar

What works for you will depend on the web server serving the app.
You need to specify this when initializing the `LocationManager`.

In any case, LocationManager will provide a uniform abstraction from
the actual URL to a list of path tokens and query string parameters.

### Defining the state space

Basic example:
```typescript
const menu: StateSpace<string, string, void> = {
    subStates: [
        {
            root: true,
            fragment: "Welcome",
        },
        {
            key: "foo", // this goes to the URL
            fragment: "First part", // this will be the content
        },
        {
            key: "bar",
            fragment: "Second part",
        },
        {
            key: "colors",
            label: "Color selector", // We will use this when rendering a menu
            fragment: "Please pick a color!",
            subStates: [ // this sub-state also has it's own sub-states
                {
                    key: "green",
                    fragment: "Green color",
                },
                {
                    key: "blue",
                    fragment: "Blue color",
                },
                {
                    key: "red",
                    fragment: "Red color",
                },
            ],
        },
    ],
    fallback: "Unknown content", // we will display this when at an unknown url
};
```

See [StateSpace.ts](src/location-state-space/state-space/StateSpace.ts) for more.

### Navigating the state space from code

You can use the LocationManager to move around within the app. Basic examples:
```typescript
locationManager.trySetPathTokens(0, ["colors", "green"]); // will go to /colors/green
locationManager.tryRemovePathTokens(1);                   // will go to /colors
locationManager.tryAppendPathTokens("blue");              // will go to /colors/blue
locationManager.trySetPathTokens(1, ["red"]);             // will go to /colors/red
```

See [LocationManager.ts](src/location-manager/LocationManager.ts) for more.

### Interacting with query string parameters using UrlArgs

A `UrlArg` is an abstraction to wrap query string parameters. It provides:
 * Type safety and automatic type conversion / serialization / deserialization.
 * Simple, unified interface to read/write, independently of backend (memory, browser history, etc.)
 * Full integration into app reactivity

Basic example:
```typescript
// Let's set up a UrlArg to deal with the lang query string param!
const lang = locationManager.defineStringArg('lang', 'en', true);

// Since the referenced search query patameter is not present,
// it will be assumed to be the default value.
console.log("Lang is", lang.value);  // Will say "en"
lang.trySet("de"); // Will add "?lang=de" to the URL
console.log("Lang is", lang.value); // Will say "de";
lang.tryReset(); // Will remove "lang" from the URL
console.log("Lang is", lang.value); // Will say "en" again;

// Let's store what hats are we wearing in in the URL!
const hats = locationManager.defineUnorderedStringArrayArg("hats");

// We can now set this using a string array.
hats.trySet(["red", "blue"]); // Will set "hats=blue,red" in the URL
// We can work with the value knowing that it's a string array
hats.value.forEach(hat => console.log("I am wearing a", hat, "hat."));
```

Normally, when we change the path (see above), we drop all query string parameters.
However, some UrlArgs can be marked permanent when defining them.
Permanent UrlArgs are retained even when the path changes.

See [UrlArg.ts](src/url-arg/UrlArg.ts) for more.

### Interacting with path tokens using TokenManager and UrlArgs

Basic example:
```typescript
// TODO
```

### Using memory-backed UrlArgs

Basic example:
```typescript
// TODO
```

### Addressing specific parts of the app without knowing where try are

You can "attach" navigation goalposts (NavRefs) to specific locations
of the menu structure, and then you can navigate to (or generate link to)
those locations without knowing their actual path.

Basic example:
```typescript
// TODO
```

### Permalinks

When using NavRefs (see above), It's also possible to generate links
in such a way that they will keep working even after the goalposts
have been moved to a different location
within the menu system, and so the target location has changed.

Basic example:
```typescript
// TODO
```

### Using redirects

It's possible to set up automatic redirections from specific parts of the menu system.

Basic example:
```typescript
// TODO
```

### Integration of multiple levels of navigation

Let's assume that you have a "main menu" in your app, and on of the parts
also has its own internal menu. Here is how to join them together:

Basic example:
```typescript
// TODO
```

## See also
* [@moxb/stellar-router-react](../stellar-router-react) provides integration with React,
  and some React components that can use the router.
* [@moxb/stellar-router-antd](../stellar-router-antd) provides further navigational widgets
  (menus etc.) built using the Ant Design library.
