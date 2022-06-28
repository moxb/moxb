# Shards - Meteor User Accounts with Ant Design

This package provides a _very basic_ solution for common user account workflows for Meteor applications.
**This is considered to be W.I.P.**

## Assumptions:
 - You are building a Meteor application, with a React UI
 - The UI is built using Ant Design components
 - App routing is provided by Stellar Router

## Features

* If the user is not logged in, he will be automatically redirected to a login form.
* User login, registration, password reset request and password reset are supported.
* After successful login, the user is redirected to the original location he tried to visit.

## Quick start

In order to use this, you need to:
 * On the client side, wrap your main application with a `<LoginRequired>` component.
 * On the server side, call `setupUserAccounts()` at app startup
