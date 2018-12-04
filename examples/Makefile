#ROOT = ../..
ROOT = $(shell cd .. && pwd)
PROJECT = $(shell pwd)
ADMIN = $(ROOT)/admin
TOOLS = $(PROJECT)/node_modules/.bin

ACTIVATE = . $(ADMIN)/activate

MKDIR = mkdir
RM = rm
TOUCH = touch
PARCEL = ./node_modules/.bin/parcel

include ../admin/makefiles/check-code.mk

.PHONY: all
all: build

# create a helper directory with files for the makefile
.makehelper:
	$(MKDIR) $@

.PHONY: build
build:  all-dependencies npm-link-dependencies
	$(ACTIVATE) \
		&& $(PARCEL) build index.html

.PHONY: clean-build
clean-dist:
	$(RM) -rf .cache

clean-js-files:
	$(RM) -f  `find src -name '*.js'`

#include $(ADMIN)/makefiles/clean.mk
.PHONY: clean
clean: clean-build clean-js-files
	$(RM) -rf .makehelper
	$(RM) -rf node_modules


###### node_module
node_modules:
	$(RM) -rf .makehelper/npm-dependencies
	$(MAKE) .makehelper/npm-dependencies

# reinstall node modules when version changes
.makehelper/src-node_modules:
	$(RM) -rf node_modules .makehelper/npm-dependencies
	$(MAKE) .makehelper/npm-dependencies
	@$(TOUCH) $@

.makehelper/npm-dependencies: package.json package-lock.json
	@echo "Installing NPM dependencies..."
	$(ACTIVATE) \
		&& npm ci --preserve-symlinks
	$(RM) -rf .makehelper/formatted .makehelper/tslinted  .makehelper/tslinted-all
	@$(TOUCH) $@

PHONY: npm-update
npm-update:
	$(ACTIVATE) \
        		&& npm-check --update

.PHONY: npm-link-dependencies
npm-link-dependencies:
	rm -rf node_modules/@moxb/* \
    		&& cd node_modules/@moxb \
    		&& ln -s ../../../packages/moxb  \
    		&& ln -s ../../../packages/semui  \
    		&& ln -s ../../../packages/antd  \
    		&& ln -s ../../../packages/html  \


########################################################################################################################
##### Begin tsc ###################################################################################################

.PHONY: watch
watch:  all-dependencies npm-link-dependencies
	$(ACTIVATE) \
		&& $(PARCEL) index.html

.PHONY: clean-generated-js-files
clean-generated-js-files:
	$(RM) -rf build

#####  END tsc ####################################################################################################
########################################################################################################################
.PHONY: test
test:
	echo 'No tests for examples needed'

run-unit-tests:
	echo 'No tests for examples needed'

.PHONY: all-dependencies
all-dependencies: \
	.makehelper \
	all-tools \
	node_modules \
	.makehelper/npm-dependencies \

.PHONY: all-tools
all-tools:
	cd $(ROOT) && $(MAKE) all-dependencies
