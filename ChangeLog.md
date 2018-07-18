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
  

### Removed

### Fixed



