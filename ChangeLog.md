Change Log
=======================================================================================

Follow the principles in [keepachangelog.com](https://keepachangelog.com)!

Next version
=======================================================================================

### Added

### Fixed

### Changed

[v0.2.0-beta.89](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.89) (2021-10-01)
=======================================================================================

### Added
- Add support for unblocked methods via `registerMeteorMethod`
- Introduce SelectableConfirm component (with Ant support) to render confirm dialogs
  with multiple confirm buttons.

[v0.2.0-beta.88](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.88) (2021-09-24)
=======================================================================================

### Fixed
- When an action assigned to a modal dialog's confirm button is disabled,
  properly indicate this on the button. (Also display the reason if available.)
- Added `multiple` option to fileUpload

[v0.2.0-beta.87](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.87) (2021-09-17)
=======================================================================================

### Changed
- Use antd tools for file upload instead of react-dropzone.
- Add option from fileupload to define allowed file extensions and/or file types

[v0.2.0-beta.86](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.86) (2021-08-25)
=======================================================================================

### Fixed

- Fix type parameter passing in ManyOfImpl and OneOfImpl.
  This is used when using ManyOf with a custom type, instead of a string.
  We already had support for this, but it was incomplete.

### Added

- Added default comparator function for ManyOfImpl, so the dirty field detection
  behaves more intuitively for this kind of fields

[v0.2.0-beta.85](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.85) (2021-08-06)
=======================================================================================

### Added

- FileUpload and FileUploadAnt: file upload controls that work like the other
  bound from input control values and widgets


[v0.2.0-beta.84](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.84) (2021-08-04)
=======================================================================================

### Added

- ToolTipAnt: added support for displaying the reason why it is disabled
- Added [`ShallowStructObservable`](packages/moxb/src/util/ShallowStructObservable.ts) a helper to do to
  combine `observable.shallow` with `observable.struct`. Useful when `observable.struct` causes too many reactions
  and `observable` would make all children observable. It is used when new versions of a object come form a rest call or
  a meteor subscription and you are interested in changes at the top level.

[v0.2.0-beta.83](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.83) (2021-06-01)
=======================================================================================

- version `v0.2.0-beta.82` did not publish correctly

[v0.2.0-beta.82](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.82) (2021-06-08)
=======================================================================================

### Added

- [`NavMenuBarAnt`](packages/antd/src/routing/NavMenuBarAnt.tsx) has new property `triggerSubMenuAction`

[v0.2.0-beta.81](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.81) (2021-06-01)
=======================================================================================

### Added

- Added support for saving previous path upon executing redirects
- Add support for opening links on new tabs using Ctrl-click and Meta-click

[v0.2.0-beta.80](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.80) (2021-05-31)
=======================================================================================

### Changed

- Fix previous npm package upgrade

[v0.2.0-beta.79](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.79) (2021-05-26)
=======================================================================================

### Changed

- Upgraded npm packages

[v0.2.0-beta.78](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.78) (2021-05-18)
=======================================================================================

### Added

- Add some missing exports

[v0.2.0-beta.77](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.77) (2021-05-05)
=======================================================================================

### Added

- Added dependantArgs, which is a pseudo UrlArg like derivedArg, just two-way

[v0.2.0-beta.76](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.76) (2021-04-30)
=======================================================================================

### Added

- Added (and changed) some more methods on LocationManager

### Interface changes:

- Export new function: `urlToLocation()``
- New methods on `LocationManager`:
    - `getPathTokensForLocation()`
    - `getQueryForLocation`
- New parameters on existing methods on `LocationManager`
    - `getNewLocationForPathAndQueryChange()` now accepts `dropPermanent`
    - `getNewLocationForLinkProps()` now accepts `dropPermanent`

### Internal changes:

- Relax the `TestLocation` interface
    - `doPathTokensMatch` is now optional
- In `BasicLocationManagerImpl`
    - The `getNewLocationForPathTokens()` method now expects a base location parameter
- In `TokenManagerImpl`:
    - BUGFIX: in `_getLocationForTokenChangeOnMapping()`, really observer the `prevLocation` parameter

[v0.2.0-beta.75](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.75) (2021-03-26)
=======================================================================================

### Fixed

- Handle non-integer steps for NumericAnt

[v0.2.0-beta.74](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.74) (2021-03-13)
=======================================================================================

### Added

- Introduce Rate and RateAnt components.

### Fixed

- Adjusted message priorities on OneOfAnt and OneOfButtonAnt

[v0.2.0-beta.73](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.73) (2021-02-26)
=======================================================================================

### Fixed

- Export some missing interfaces

v.Next (Current)
=======================================================================================

[v0.2.0-beta.72](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.72) (2021-02-26)
=======================================================================================

### Added

- TokenManager: add support for vanishing tokens

[v0.2.0-beta.71](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.71) (2021-02-23)
=======================================================================================

### Changed

- Revert to the browser's native title feature, instead of the ant tooltip

[v0.2.0-beta.70](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.70) (2021-02-20)
=======================================================================================

### Added

- Implement displaying the per-option help messages on all OneOf and ManyOf components where it was missing

[v0.2.0-beta.69](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.69) (2021-02-19)
=======================================================================================

### Added

- Added support for disabling individual choices in OneOf... and ManyOf... components.

### Fixed

- Fixed errors on the console when trying to access an undefined tab on a NavTabBarAnt.

[v0.2.0-beta.68](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.68) (2021-02-18)
=======================================================================================

### Changed

- Input widget improvements

[v0.2.0-beta.67](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.67) (2021-02-17)
=======================================================================================

### Added

- Add missing ManyOfCheckboxFormAnt component

[v0.2.0-beta.66](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.66) (2021-02-16)
=======================================================================================

### Added

- BoundLink: added help, enabled and disabled options.
- OneOfAnt and OneOfButtonAnt: add support for adding a line break after every nth option.

### Fixed

- Fixed support for the `target` HTML arg on `NavLink` and it's derivatives.
- Fixed handling of requests for non-existent tabs on NavTabBarAnt.
- Fixed support for the `target` HTML arg on `NavLinkButtonAnt` and it's derivatives.
- Fixed the disabled property on Anchor

### Added

- Add some utility functions for dealing with decisions

[v0.2.0-beta.65](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.65) (2021-02-10)
=======================================================================================

### Added

- OneOfFormAnt: add support for vertical layout of choices (like OneOfAnt)

[v0.2.0-beta.64](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.64) (2021-02-05)
=======================================================================================

### Added

- Introduce OneOfSearchAbleSelectAnt and OneOfSearchableSelectFormAnt
- Extend OneOf with searchData and filteredChoices

[v0.2.0-beta.62](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.62) (2021-02-02)
=======================================================================================

- OneOfAnt: add support for vertical layout of choices
- OneOfAnt: add support for displaying explanation besides the choices

[v0.2.0-beta.61](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.61) (2021-01-30)
=======================================================================================

- Define interfaces that implement various sub-sets of the feature set of UrlArgs, and allow using these in situations
  that don't require all features.

[v0.2.0-beta.60](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.60) (2021-01-29)
=======================================================================================

- Extended NativeUrlSchema so that it's also usable when the app doesn't live at the root of the website

[v0.2.0-beta.58](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.58) (2021-01-28)
=======================================================================================

### Added

- Extended TokenManager for simple menu-less applications

[v0.2.0-beta.57](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.57) (2021-01-26)
=======================================================================================

### Fixed

- Small fix for slider spacing

[v0.2.0-beta.56](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.56) (2021-01-22)
=======================================================================================

### Added

- BoolSwitchAnt (and BoolSwitchFormAnt) for using toggle switch to set boolean value

[v0.2.0-beta.55](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.55) (2021-01-21)
=======================================================================================

### Added

- SliderAnt (and SliderFormAnt) for inputting a number via a slider

### Fixed

- Fixed a missing dependency and a few invalid imports in the example app

[v0.2.0-beta.54](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.54) (2021-01-13)
=======================================================================================

### Added

- The ability to override the `help` field on form items

[v0.2.0-beta.53](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.53) (2020-11-05)
=======================================================================================

### Added

- The ability to assign a postFormatter to CountingClock
- Export Logger interface

### Fixed

- A reactivity issue in CountingClock

[v0.2.0-beta.52](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.52) (2020-11-05)
=======================================================================================

### Added

- Support indicating the pending state on ToolTipAnt
- Add CountingClock widget to @moxb/html
- Add support for using navRefs on BoundNavLink and BoundNavLinkButtonAnt (like all other links)

[v0.2.0-beta.51](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.51) (2020-10-20)
=======================================================================================

### Changed

- Moved everything from @moxb/antd / not-antd into @moxb/html

[v0.2.0-beta.50](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.50) (2020-10-20)
=======================================================================================

### Changed

- Removed a mistaken Meteor reference from @moxb/moxb
- Split the LinkAnt component into two: NavLink and NavLinkButtonAnt
- Split BoundLinkAnt into BoundNavLink and BoundNavLinkButtonAnt

[v0.2.0-beta.49](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.49) (2020-10-19)
=======================================================================================

### Fixed

- Added a mixing export

[v0.2.0-beta.48](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.48) (2020-10-19)
=======================================================================================

### Added

- A shortcut for resetting URL arguments

[v0.2.0-beta.47](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.47) (2020-10-15)
=======================================================================================

### Changed

- Stronger differentiation between UrlArgs that can be undefined, and those that can't be.

[v0.2.0-beta.45](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.45) (2020-10-15)
=======================================================================================

### Added

- More convenient methods for defining URL args
- Type for integer URL args
- Added BoundLink, BoundLinkImpl and BoundLinkAnt: a link widget to be controlled by a component in the store, in a
  Bind-like way

### Changed

- Refactored some internal interfaces.
- Moved some code around

[v0.2.0-beta.44](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.44) (2020-10-12)
=======================================================================================

### Added:

- Support for arranging the choices in ManyOfAnt vertically

[v0.2.0-beta.43](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.43) (2020-09-21)
=======================================================================================

### Fixed:

- Teach the UI Fragment rendering code to recognize some already rendered React components.
- In NavMenuBarAnt, accept UI Fragments instead of only JSX Elements.
  (This is backward compatible, and fixed some problems with recent React and antd.)

[v0.2.0-beta.42](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.42) (2020-09-21)
=======================================================================================

### Fixed:

- More NPM dependency cleanup
    - Downgrade TS from 4.0.2 to 3.8.3 (the latest version used by Meteor)
    - Remove the unused read-code-prettify dep
    - removed the unwanted and obsolete mobx-react dev dependency.

[v0.2.0-beta.41](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.41) (2020-09-14)
=======================================================================================

### Changed

* Updated dependency packages

[v0.2.0-beta.40](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.40) (2020-07-15)
=======================================================================================

### Added

* Added `TreeAnt` component and `Tree` and `TreeImpl` store components to represent editing data in a treeView.

[v0.2.0-beta.39](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.39) (2020-07-02)
=======================================================================================

### Changed

- Changed how we import Icons from antd. The old way was causing performance issues.

[v0.2.0-beta.37](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.37) (2020-06-09)
=======================================================================================

### Breaking Changes

- Upgraded antd dependency to 4.x instead of 3.x

[v0.2.0-beta.36](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.36) (2020-05-12)
=======================================================================================

### Added

- Added support for opening NavRefs in new window

[v0.2.0-beta.35](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.35) (2020-05-07)
=======================================================================================

### Added

- [VS-139](https://goessntl.atlassian.net/browse/VS-139) Extend the NavControl interface with new APIs
  (preparation for page enter and leave hooks)
- Added a small, conditional debug log utility
- Added support for hiding ToolTipButtonAnt, via the operator's invisible flag. (Just like normal buttons.)
- Added a [cached value utility](packages/moxb/src/cached-evaluator/readme.md) to cache values that are expensive to
  retrieve. The cached value can have an expiration time.

[v0.2.0-beta.25](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.25) (2019-06-27)
=======================================================================================

### Breaking Changes

### Added

* Allow using a ReactNode component in the modal.header.
* Support conditions in TableSearch
* Allow styling location dependent containers

### Fixed

* Replace EmptyLog type in activity logger
* Improved QueryString quoting
* Fixed a function scoping bug in NavStepAnds

[v0.2.0-beta.24](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.24) (2019-06-03)
=======================================================================================

### Breaking Changes

* `Modal` now takes an interface with actions (instead of an array). However, the array still works but will be removed
  soon.
* `NavRadioButtonBarAnt` used to take and `extras` prop (for a list of extra components to display), but this caused
  some problems, because React doesn't like rendering components from a list without unique keys. (And since the
  components can come from different sources, there is no way to reliably assign keys.) Reducing it to accepting a
  single component.

### Added

* Declare that the `renderUIFragment()` function accepts undefined input, too
* Added `NavRadioButtonBarAnt` component, which is just like the `NavMenuBarAnt`, but with radio buttons
* Adding `PollingUpdaterAnt` component, for displaying some content that is periodically updated
* Added `redirectToNavRef()` function, for adding redirect components to NavRefs
* Teach `LinkAnt` to handle `NavRef`s directly, too
* Exported one more interface with a group of `LinkAnt` parameters -- useful when creating custom link components.
* `data-testid` to `antd` elements. Can be used to detect elements in integration tests.

### Fixed

* Fixed a TS warning around btoa-lite
* When using the `mountAll` option with a menu, rendering of "fallback"
  content was broken. (Ie. when a non-existent item is requested from the menu.)
  Also, we were rendering _all_ the sub-states, not only those that were currently available, considering the
  conditions. These problems have been fixed.

[v0.2.0-beta.23](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.23) (2019-05-29)
=======================================================================================

### Breaking Changes

* Removed the `key` field from the `UrlArg` interface
* Removed some APIs from LocationManager that were inconsistent with the contract implied by the `UrlArg` interface.
  (Ie. `serializeArgChanges`)

### Added

* Exposed some of the (previously) internal APIs of LocationManager.
    * `location`
    * `trySetLocation()`
    * `getNewLocationForQueryChanges()`
    * `getNewLocationForPathAndQueryChanges()`
      These are mostly useful for other navigational components.
* Also export utility function `locationToUrl()`

* Added a new API to `UrlArg` (and all implementations): `getModifiedLocation()`
  This can be used for calculating what would be the new location if a given arg was changed to the given value. This
  API is defined so that it's possible to cascade multiple calls for multiple args.
* Added the `NavRef` and `LinkGenerator` system for attaching schemas to specific parts of the navigation sub-tree, and
  then generating links and redirect to those states, without knowing the exact path tokens.

### Fixed

* The Path-token - based UrlArgs didn't play nice with <LinkAnt>. Also, <LinkAnt> couldn't properly handle multiple args
  that had different implementations. Now this has been fixed - using the newly introduced API.
* Made sure that permanent UrlArgs are always handled properly, independent of the implementation

[v0.2.0-beta.19](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.19) (2019-03-29)
=======================================================================================

### Breaking Changes

### Added

* Added new toggle button component for the ant design package
* Added the original onSubmit form event to the form operation, so the event handling can be done in a callback.
* Added support for easily adding separators in submenus
* Menu items now get IDs, for easier testing
* Added support for passing on class names for submenus
* Added `onEnter()` and `onLeave()` navigation state hooks.
* Added `unregisterStateHooks()` API to remove navigation state hooks.
* Added `isAvtive()` and `wouldBeActive()` APIs to the `NavControl` interface.

### Changed

* Separated the decision-related code (from binding) into a new module, so that it can be more easily reused by other
  components.
* Enhanced `registerMeteorMethod` with new configuration options and behaviors
* Improved parsing of meteor queries
    - better regex parsing
    - remove not needed  `$and` and `$or`
* Changed the `registerStateHooks` API: now a component ID is also mandatory.

### Fixed

* Fix placeholder text display for OneOfSelect and ManyOfSelect ant design components
* If the `Makefile`, any file in `admin/makefiles` or the `tsconfig.json` or `package-lock.json` changes, we have to
  re-run `tsc`
* Fixed error handling for form errors, e.g. errors from callbacks.
* `make clean-dist` removes all files generated by typescript (but does not remove the `node_modules`)
* Fix `make watch-all` and `make watch-all-verbose` on a clean workspace
* Fix `active page` for `TableAnt`

### Removed

[v0.2.0-beta.8](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.8) (2018-10-09)
=======================================================================================

### Changed

* `make build-all` now only builds if needed (that is if the TypeScript files are newer than the generated `.js` files)
* the build output directories are now called `dist` (instead of `build`) to reduce confusion in Makefiles what on
  what `build` means.

### Added

* new make target: `clean-generated` to only clean the generated files but
* new make target: `npm-publish` to publish a new version using `lerna`

### Breaking Changes

* Renamed main property for ModalAnt and ConfirmAnt to `operation` to be consistent with other components.

[v0.2.0-beta.7](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.7) (2018-10-08)
=======================================================================================

### Added

* Integrate error messages for all semui and ant design components
* Added required property for all ui components
* Added form item components for datePicker and timePicker
* Added some basic tests for ant design components
* `make watch-all-verbose` and `make watch-verbose` and added: does not suppress the `tsc --watch` output.
* `make build-pakages` added as new target: only builds the `packages` directory
* `MeteorTableImpl` has now a new method `invalidateData` (https://github.com/moxb/moxb/pull/31)
* 'make npm-publish' added to run `lerna`

### Changed

* Updated npm version to version 6 so we can use `npm ci`
* `make build` does not remove the `build` directory unless some typescript files have been added or removed since the
  last build. The old version of the `Makefile` was pretty aggressive:

    - on make it always removed the `build` directories
    - on `make watch` it
        - first removed the `build` directory
        - then did a full build (`tsc --watch` initially builds all files anyway, therefore this step is not needed)

  This is not really necessary. Now it removes the `build` directories only if some typescript files have been added or
  removed since the last build. It does it by comparing the list of `.ts` files with the list of `.js` files
  ignoring `*.d.ts` files, because no `.js` file is build for those files.

### Removed

### Fixed

* Fixed jest test coverage generation

[v0.2.0-beta.6](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.6) (2018-09-27)
=======================================================================================

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

[v0.2.0-beta.2](https://github.com/moxb/moxb/releases/tag/v0.2.0-beta.2) (2018-08-22)
=======================================================================================

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
* For meteor there is now `MeteorTableImpl` for a simple table implementation that only requires a meteor method for the
  results.
* with the function `parseQuery` a string query can turned into a mongo query
* `MeteorTableData` contains now an optional `error` of type `Meteor.Error`. If it is defined, `MeteorTableImpl`
  derives its  `error` string from this attribute. The reason this was needed, because else the `mobx.onBecomeObserved`,
  is called all the time if there is an error. The code is a bit too complex and we should simplify it. However sit
  seems to work now.
* `TableAnt` now shows an error message, if there was a server error.
* `parseQuery` throws an `Meteor.Error` if something goes wrong (like one of the search strings is an invalid regex)
* `MeteorTableImpl` can now take an additional `selector` of the query.

### Changed

* Refactor the `ActionUi` component to `ActionFormButtonUi`, because it describes the nested html element more clearly
  and exact.
* use a common makefile [admin/makefiles/package.mk](admin/makefiles/package.mk) that is included in all package
  Makefiles.
* extracted new package `@moxb/meteor` for meteor related code.
* In theory, `jest` can run all [projects in parallel](https://github.com/paularmstrong/jest-multi-project-example). In
  reality, I was not able to get it going.
* use [`parcel`](https://parceljs.org) instead of `webpack` for examples.
* use `npm` instead of `yarn` because `npm` has a flag `--preserve-symlinks` which allows to keep the symlinks after
  installation. It seems that `npm` is now as fast as `yarn` and there is no need to use `yarn`.
* new top level makefile target: `watch-all`: this runs the examples and whatches for all changes. It starts some
  background processes in [admin/bin/watch-packages.sh](admin/bin/watch-packages.sh).
* new top level makefile target: `link-all`
* use `npm-check --update` instead of `yarn update-interactive`
* Makefiles: eliminated the `$(M)` variable: use the name of the directory `.makehelper` directly
  (this simplifies makefile editing and works better with the webstorm makefile plugin)
* exported `bindAllTo` function
* `bindAllTo` function does not access getters anymore. The problem was that getters is that getters could do all kind
  of compilcated stuff and we don't want this to happen in during the bind.
* `toJSON` helper function added to print `mobx` trees. Quite useful in the console...
* reworked `Table`:
    - it now has pagination, sorting and search built in
* removed `peer-dependencies`! We now install some of the peer dependencies in the top level `node_modules` as
  `devDependencies`. This seems to work better and is simpler. We also add some `peerDependencies` as `devDependencies`
  in the module itself. I made some experiments
  with [`npm-install-peers`](https://github.com/spatie/npm-install-peers#readme) and the documentation says
  > You probably don't need this package! It's generally a better idea to have your peerDependencies contents as
  > devDependencies too.
* `@moxb/meteor` is now using the global `Meteor` and `Tracker` variables, because `meteor/meteor` is not a real package
  and therefore there are some problems with dependencies....
* rename `extractErrorMessage` to `extractErrorMessages` and added `extractErrorString` function

### Removed

### Fixed
