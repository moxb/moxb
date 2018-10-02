# Change Log

Follow the principles in [keepachangelog.com](https://keepachangelog.com)!

# v.Next (Current)

### Added
* Integrate error messages for all semui and ant design components
* Added required property for all ui components
* Added form item components for datePicker and timePicker
* Added some basic tests for ant design components

### Changed
* Updated npm version to version 6 so we can use `npm ci`

### Removed

### Fixed
* Fixed jest test coverage generation


# [v0.2.0-beta.6](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.6) (2018-09-27)

### Added
* Added onPressKey to text input fields
* Created ant design search input field for tables
* Added column and label wrapper to action and text component
* Added new variant for manyOf component with checkboxes
* Created ant design datePicker and TimePicker components
* Added `sortData` method to `TableSort` so it can be used for inline tables

### Changed
* Updated dependency packages
* The data-fetcher listens to `ready` on the table
* Changed styling of the example app and show 100 items in the demo table by default

### Fixed
* The search button in the search field of the table
* Fixed jest testing and tslint errors
* Fixed bugs in `OneOfAnt`, `OneOfSelectAnt` and OneOfSelectFormAnt

### Removed


# [v0.2.0-beta.2](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.2) (2018-08-22)

### Added

* top level make now installs `jest` (which is used in the sub makefiles)
* top level make can now
  - `make`
  - `make test`
  - `make clean`
* makefiles can now format code
  - `make format-code` formats changed files
  - `make format-check` checks if files need to be formatted
  - `make format-force` checks if files need to be formatted
* makefile can now update all dependencies:
  - `make npm-update` recursively updates npm dependencies interactively
* `make watch-packages` now watches all packages. This is useful when linking the packages...
* [ant design](https://ant.design/docs/react/introduce) example
* For meteor there is now `MeteorTableImpl` for a simple table implementation that only requires a meteor method
  for the results.
* with the function `parseQuery` a string query can turned into a mongo query
* `MeteorTableData` contains now an optional `error` of type `Meteor.Error`. If it is defined, `MeteorTableImpl`
   derives its  `error` string from this attribute. 
   The reason this was needed, because else the `mobx.onBecomeObserved`, is called all the time if there is an error.
   The code is a bit too complex and we should simplify it. However sit seems to work now.
* `TableAnt` now shows an error message, if there was a server error.
* `parseQuery` throws an `Meteor.Error` if something goes wrong (like one of the search strings is an invalid regex)
* `MeteorTableImpl` can now take an additional `selector` of the query.

### Changed

* Refactor the `ActionUi` component to `ActionFormButtonUi`, because it describes the nested html element more clearly and exact.
* use a common makefile [admin/makefiles/package.mk](admin/makefiles/package.mk) that is included in all package Makefiles.
* extracted new package `@moxb/meteor` for meteor related code.
* In theory, `jest` can run all [projects in parallel](https://github.com/paularmstrong/jest-multi-project-example). 
  In reality, I was not able to get it going. 
* use [`parcel`](https://parceljs.org) instead of `webpack` for examples.
* use `npm` instead of `yarn` because `npm` has a flag `--preserve-symlinks` which
  allows to keep the symlinks after installation. It seems that `npm` is now as fast
  as `yarn` and there is no need to use `yarn`.
* new top level makefile target: `watch-all`: this runs the examples and whatches
  for all changes. It starts some background processes in [admin/bin/watch-packages.sh](admin/bin/watch-packages.sh).
* new top level makefile target: `link-all`
* use `npm-check --update` instead of `yarn update-interactive`
* Makefiles: eliminated the `$(M)` variable: use the name of the directory `.makehelper` directly
  (this simplifies makefile editing and works better with the webstorm makefile plugin)
* exported `bindAllTo` function
* `bindAllTo` function does not access getters anymore. The problem was that getters is that getters could do all
  kind of compilcated stuff and we don't want this to happen in during the bind.
* `toJSON` helper function added to print `mobx` trees. Quite useful in the console...
* reworked `Table`:
  - it now has pagination, sorting and search built in
* removed `peer-dependencies`! We now install some of the peer dependencies in the top level `node_modules` as
  `devDependencies`. This seems to work better and is simpler. 
  We also add some `peerDependencies` as `devDependencies` in the module itself. I made some experiments
  with [`npm-install-peers`](https://github.com/spatie/npm-install-peers#readme) and the documentation says
  > You probably don't need this package! It's generally a better idea to have your peerDependencies contents as 
  > devDependencies too.
*  `@moxb/meteor` is now using the global `Meteor` and `Tracker` variables, because `meteor/meteor` is not a real
   package and therefore there are some problems with dependencies....
* rename `extractErrorMessage` to `extractErrorMessages` and added `extractErrorString` function

### Removed

### Fixed
