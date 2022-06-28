# Meteor react hooks

This package contains various small utilities I find useful when building React applications,
using React hooks, on top of Meteor.

## Generic features

 * Support for defining Meteor publications in a type-safe way,
   using a declarative specification for various things.
   (Like auth checks, filtering on both the server and the client side, etc.)
   In the end you get a callable handle which you can use directly on the client side.

## React hooks:
 * `useMeteorUserId()` for obvious reasons
 * `useMeteorUser()` for obvious reasons
 * `useMeteorPublication()` for using the live results of a subscription to a Meteor publication, with flow control, error handling, etc
 * `useMethodResults()` for using the results of a Meteor method, with various flow control functions, manual triggers, polling, error handling, etc
