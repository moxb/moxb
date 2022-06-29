# Synchronous wrappers around Promises, using fiber Futures

You can use this library to wrap your Promise-returning functions with (seemingly) fully synchronous functions,
which can then be called without any extra precaution, without using async/await.

The magic is powered by [fibers](https://www.npmjs.com/package/fibers).

Before using it for new project, **please consider the node of obsolesce at fiber's side**.
