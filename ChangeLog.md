# Change Log

Follow the principles in [keepachangelog.com](https://keepachangelog.com)!

## v.Next

### Added

- top level make now installs `jest` (which is used in the sub makefiles)
- top level make can now
  - `make`
  - `make test`
  - `make clean`

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

### Removed

### Fixed



