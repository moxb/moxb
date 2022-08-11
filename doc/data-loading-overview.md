
# Ways to load data with moxb

## registerMeteorMethod()

A type-safe way to define and call a Meteor method.
Not reactive in any way.

## Loader

A `Loader` can follow the changes in some input data, and prepare some output data accordingly.

Let's assume that there is a value ("output") that depends on some other value ("input"),
and can be derived from it using an asynchronous function.

One example would be loading some data from an external source, based on an ID or other criteria.
(For example, using RPC defined by `registerMeteorMethod()`)

A `Loader` can do this for you: it watches the input (via mobx reactivity),
and maintains the output accordingly.

Mainly intended to be used as part of a store.
The loaded data is mobx-observable.

## useAsyncData()

A React Hook for using data produced by an async method based on some input.

(For example, using RPC defined by `registerMeteorMethod()`)

Conceptually similar to the `Loader`.

Mainly intended for situations when you don't want to have a store,
but load all the data directly inside the React components.

(This hook will channel the mobx input param reactivity to React.)

TODO: make sure that `Loader` and `useAsyncData()` have the same features, and the input params are compatible.

## registerMeteorPublication()

A comfy way to define and access a Meteor publication in a type-safe way.

This is a wrapper around `Meteor.publish()`, `Meteor.subscribe()` and `Collection.find()`.
The idea is that you register your publication with this function (in common code),
and you get a handler that makes it easier to use it on the client side,
and makes it impossible to pass the wrong type of parameters.

Mainly intended to be used via `MeteorPublicationLoader` (in a store)
or `useMeteorPublication()` (directly in React components).

## useMeteorPublication()

A React hook for using data from a Meteor publication.

It will automatically follow the input args; subscribe, unsubscribe, etc.
This will be reactive to both changes in the input (via React prop reactivity),
and changes coming from the server (via Meteor Tracker reactivity).

Requires a publication defined by `registerMeteorPublication()`.

Mainly intended for situations when you don't want to have a store,
but load all the data directly inside the React components.
(This React hook channels the Meteor Tracker reactivity back to React.)

## MeteorPublicationLoader

A component for loading data via a Meteor Publication defined using `registerMeteorPublication()`.

This will be reactive to both changes in the input (via mobx reactivity),
and changes coming from the server (via Meteor Tracker reactivity).

Intended to be used part of a store.
The loaded data is mobx-observable.

## MeteorSubscription

A component for loading data via a Meteor Publication _not_ defined using `registerMeteorPublication()`,
but directly with Meteor APIs.

This will be reactive to both changes in the input (via mobx), and changes coming from the server (via Meteor Tracker).

## Other similar components

... that should be synchronized with the above:

- `MateorDataFetcher`
- `MeteorTableFetcher`
