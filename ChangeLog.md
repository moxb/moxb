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
  
### Changed

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

### Removed

### Fixed



