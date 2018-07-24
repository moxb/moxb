#ROOT = ../..
ROOT = $(shell cd .. && pwd)
PROJECT = $(shell pwd)
ADMIN = $(ROOT)/admin
TOOLS = $(PROJECT)/node_modules/.bin

ACTIVATE = . $(ADMIN)/activate

MKDIR = mkdir
RM = rm
TOUCH = touch
NPM = npm install --preserve-symlinks
PACREL = ./node_modules/.bin/parcel

override TS_DIRS = semui
include ../admin/makefiles/check-code.mk

# create a helper directory with files for the makefile
.makehelper:
	$(MKDIR) $@

.PHONY: all
all: build

.PHONY: build
build:  all-dependencies
	$(ACTIVATE) \
		&& $(PACREL) build antd/index.html

.PHONY: dev
dev:  all-dependencies
	$(ACTIVATE) \
		&& $(PACREL) antd/index.html

#include $(ADMIN)/makefiles/clean.mk
.PHONY: clean
clean:
	$(RM) -rf .makehelper
	$(RM) -rf node_modules
	$(RM) -rf .cache
	$(RM) -rf dist

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
	@echo "Installing NPM dependencies for the meteor server..."
	$(ACTIVATE) \
		&& $(NPM)
	$(RM) -rf .makehelper/formatted .makehelper/tslinted  .makehelper/tslinted-all
	@$(TOUCH) $@

PHONY: npm-update
npm-update:
	$(ACTIVATE) \
        		&& npm-check --update

.PHONY: npm-link-dependencies
npm-link-dependencies:
	$(ACTIVATE) \
		&& npm link @moxb/moxb \
		&& npm link @moxb/semui \
		&& npm link @moxb/antd

########################################################################################################################
##### Begin tsc ###################################################################################################

.PHONY: watch
watch:  all-dependencies
	$(ACTIVATE) \
		&& $(PACREL) index.html

.PHONY: clean-generated-js-files
clean-generated-js-files:
	$(RM) -rf build

#####  END tsc ####################################################################################################
########################################################################################################################
.PHONY: test
test:
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
