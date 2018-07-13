How to use `make`
================

**Philosophy**: don't try to be too clever. Just make the most reasonable thing for
the given environment (`$TYE_ENV`).

The purpose of this makefile is to be a single entry point for

- installation
  - ensures the connect version of node is installed
  - node packages
- update
- running
- developing
- testing
- style checking


`make` (without any parameter) equivalent to `make all`
-------------------------------------------------------


It behaves slightly different depending which `TYE_ENV` you are using. Therefore the environment variable
`TYE_ENV` has to be set before you can run make (don't worry make will complain if it is not set).

Here is a short summary of the differences depending on `TYE_ENV`:

- `production` and `staging`

  - do not run tests
  - build and minify client site resources (like javascript, css etc)
  - run the node server with [`forever`](https://github.com/foreverjs/forever)

- `ci`

  - run *all* tests
  - build and minify client site resources
  - run the node server with `forever`

- `development`

  The default action in development is to just run the basic tests.

  **Note** to start the server run `make start-dev`



`make start-dev`
---------------

Run this in another shell, it will not terminate!

It will ensure that everything is set up correctly and it will react to file
changes. Ideally, you don't have to kill this process, unless you change the
version of node.


`make start`
-----------

  - runs `gulp dist` which builds and minifies the
  - starts the server using `forever`

  **Note**: it will fail if address `3000` is bound

`make _install`
--------------

This is implicitly run by many commands -- you never have to run it directly.

  - `admin/activate` is up to date. `admin/activate` inside used the makefile to set `$PATH`
    correctly to the `node`, `nvm` and all node tools installed by [`package.json`](package.json)

    **Note**: there is no need to run `admin/activate` before you run make!

  - `node` is installed in the expected version specified in [`.nvmrc`](.nvmrc)
     - `nvm` is installed globally, it uses `nvm` to switch to the expected version of `node`
       - If it cannot find `nvm` it will be installed in `admin/nvm`
       - In both cases, it creates a symbolic link to the `bin` directory of the specified
         version of `node` in `admin/node_bin`
     - The node packages are installed or updated and obsolete packages are removed
     - If the node version changes, only the C code is recompiled (the packages are not reinstalled)

  - The git `pre-push` hook is up to date

  - The `geoip` is installed (not attempts are made to update it. If you want to update
    it, just remove the `geoip` directory)

Summary
=======

Make targets for development
----------------------------

- `all` (or just `make`) -- to run the tests
- `start-dev` -- watch on the dev machine
- `test-server` -- run the node tests
- `coverage` -- runs `test-server` with coverage
- `test-clinet` -- run the karma tests
- `test-selenium` -- run selenium tests
- `test-all` -- test client, server and run selenium tests
- `kill-selenium` -- if the selenium server hangs this may help
- `check-style` -- runs `jscs` and `eslint` (also run as pre-push hook)
- `format` -- uses `jscs` to fix formatting problems
- `clean` -- removes all generated files (as if the repository was freshly cloned)

Make targets on server
----------------------

- `all` (or just `make`) -- installs and build all and (re)starts the server
- `start` -- (re)start forever
- `status` -- show the forever status
- `stop` -- kill the server
- `clean` -- removes all generated files (as if the repository was freshly cloned)


