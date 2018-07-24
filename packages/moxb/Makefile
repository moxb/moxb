
# this will forward any other make goal to the parent makefile

all: build-all

include ../../admin/makefiles/package.mk
include ../../admin/makefiles/check-code.mk

.PHONY: npm-link-dependencies
npm-link-dependencies:
	echo noop
