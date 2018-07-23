
# this will forward any other make goal to the parent makefile

all: build-all

include ../../admin/makefiles/package.mk

.PHONY: npm-link-dependencies
npm-link-dependencies:
	$(ACTIVATE) \
		&& npm link @moxb/moxb
