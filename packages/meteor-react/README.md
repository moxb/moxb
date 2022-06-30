# Meteor react hooks

This package contains various small utilities I find useful when building React applications,
using React hooks, on top of Meteor.

## Provided React hooks:
* `useMeteorUserId()` for obvious reasons
* `useMeteorUser()` for obvious reasons
 * `useMeteorPublication()` for using the live results of a subscription to a Meteor publication, with flow control, error handling, etc
 * `useMethodResults()` for using the results of a Meteor method, with various flow control functions, manual triggers, polling, error handling, etc
