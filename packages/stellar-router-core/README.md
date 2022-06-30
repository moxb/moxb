# Stellar Router - core

Stellar Router is yet another router for web applications.

## Design goals

 - It should be implemented in TypeScript, with strong type safety
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
 - It should be possible to freely embed these sub-state trees into each other,
   and on the code level, they should remain independent.
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

## Features in this core packages

 * The interfaces for defining the state-space and the sub-states.
 * The code for navigating these state-spaces
 * The code for interacting with browser history, defining variables
   mapped to the URL, etc
 * The code and interfaces for the interactive processing of the path tokens
   on multiple levels, and the interaction between the levels

## Some interfaces of interest

The following links should work if you are reading this
[on GitHub](https://github.com/moxb/moxb/blob/master/packages/stellar-router-core/).

 * Defining the state space: [StateSpace.ts](src/location-state-space/state-space/StateSpace.ts)

## See also
 * `@moxb/stellar-router-react` provides integration with React,
    and some React components that can use the router.
 * `@moxb/stellar-router-antd` provides further navigational widgets (menus etc)
    built using the Ant Design library.
