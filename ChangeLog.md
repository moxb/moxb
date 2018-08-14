# Change Log

Follow the principles in [keepachangelog.com](https://keepachangelog.com)!

## v.Next

### Added

- top level make now installs `jest` (which is used in the sub makefiles)
- top level make can now
  - `make`
  - `make test`
  - `make clean`

- makefiles can now format code
  - `make format-code` formats changed files
  - `make format-check` checks if files need to be formatted
  - `make format-force` checks if files need to be formatted
  
- makefile can now update all dependencies:
  - `make npm-update` recursively updates npm dependencies interactively

- `make watch-packages` now watches all packages. This is useful when linking the packages...

- [ant design](https://ant.design/docs/react/introduce) example

- For meteor there is now `MeteorTableImpl` for a simple table implementation that only requires a meteor method
  for the results.

- with the function `parseQuery` a string query can turned into a mongo query

### Changed

- Refactor the `ActionUi` component to `ActionFormButtonUi`, because it describes the nested html element more clearly and exact.

- use a common makefile [admin/makefiles/package.mk](admin/makefiles/package.mk) that is included in all package Makefiles.

- extracted new package `@moxb/meteor` for meteor related code.

- In theory, `jest` can run all [projects in parallel](https://github.com/paularmstrong/jest-multi-project-example). 
  In reality, I was not able to get it going.
  
- use [`parcel`](https://parceljs.org) insted of `webpack` for examples.

- use `npm` instead of `yarn` because `npm` has a flag `--preserve-symlinks` which
  allows to keep the symlinks after installation. It seems that `npm` is now as fast
  as `yarn` and there is no need to use `yarn`.

- new top level makefile target: `watch-all`: this runs the examples and whatches
  for all changes. It starts some background processes in [admin/bin/watch-packages.sh](admin/bin/watch-packages.sh).

- new top level makefile target: `link-all`

- use `npm-check --update` instead of `yarn update-interactive`

- Makefiles: eliminated the `$(M)` variable: use the name of the directory `.makehelper` directly
  (this simplifies makefile editing and works better with the webstorm makefile plugin)
  
- exported `bindAllTo` function

- `bindAllTo` function does not access getters anymore. The problem was that getters is that getters could do all
  kind of compilcated stuff and we don't want this to happen in during the bind.

- `toJSON` helper function added to print `mobx` trees. Quite useful in the console...

- reworked `Table`:
  - it now has pagination, sorting and search built in
  
- removed `peer-dependencies`! We now install some of the peer dependencies in the top level `node_modules` as
  `devDependencies`. This seems to work better and is simpler. 
  
  We also add some `peerDependencies` as `devDependencies` in the module itself. I made some experiments
  with [`npm-install-peers`](https://github.com/spatie/npm-install-peers#readme) and the documentation says
  > You probably don't need this package! It's generally a better idea to have your peerDependencies contents as 
  > devDependencies too.

-  `@moxb/meteor` is now using the global `Meteor` and `Tracker` variables, because `meteor/meteor` is not a real
   package and therefore there are some problems with dependencies....

- rename `extractErrorMessage` to `extractErrorMessages` and added `extractErrorString` function
### Removed

### Fixed



