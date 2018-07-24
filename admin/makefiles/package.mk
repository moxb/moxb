#ROOT = ../..
ROOT = $(shell cd ../.. && pwd)
PROJECT = $(shell pwd)
ADMIN = $(ROOT)/admin
TOOLS = $(PROJECT)/node_modules/.bin

ACTIVATE = . $(ADMIN)/activate

MKDIR = mkdir
RM = rm
TOUCH = touch
TSC = $(TOOLS)/tsc
NPM = npm install --preserve-symlinks
JEST = jest

# create a helper directory with files for the makefile
.makehelper:
	$(MKDIR) $@

build:
	$(MKDIR) build

#include $(ADMIN)/makefiles/clean.mk

.PHONY: clean
clean:
	$(RM) -rf .makehelper
	$(RM) -rf node_modules
	$(RM) -rf peer-dependencies/node_modules
	$(RM) -rf build

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

###### peer-dependencies/node_module
peer-dependencies/node_modules:
	$(RM) -rf .makehelper/peer-dependencies-node_module
	$(MAKE) .makehelper/peer-dependencies-node_module

# reinstall node modules when version changes
.makehelper/peer-dependencies-node_modules:
	$(RM) -rf peer-dependencies/node_modules .makehelper/peer-dependencies-dependencies
	$(MAKE) .makehelper/peer-dependencies-dependencies
	@$(TOUCH) $@

.makehelper/peer-dependencies-dependencies: peer-dependencies/package.json peer-dependencies/package-lock.json
	@echo "Installing NPM dependencies for the meteor server..."
	$(ACTIVATE) \
		&& cd peer-dependencies \
		&& $(NPM)
	@$(TOUCH) $@

########################################################################################################################
.PHONY: test
test: run-unit-tests

.PHONY: run-unit-tests
run-unit-tests: all-dependencies
	$(ACTIVATE) \
		&& cd src \
		&& $(JEST)

.PHONY: run-unit-tests-verbose
run-unit-tests-verbose: all-dependencies
	$(ACTIVATE) \
		&& cd src \
		&& $(JEST) --verbose

########################################################################################################################
##### Begin tsc ###################################################################################################
# TODO add src/__mocks__ here
# It does not work, because there are problems with tsc

.PHONY: watch
watch:  all-dependencies
	$(ACTIVATE) \
		&& cd src \
		&& $(TSC) --watch --preserveWatchOutput

.PHONY: clean-generated-js-files
clean-generated-js-files:
	$(RM) -rf build

.PHONY: build-all
build-all:  all-dependencies
	$(ACTIVATE) \
		&& cd src \
		&& ($(TSC) || echo typescript ERRORS found but ignored)

#####  END tsc ####################################################################################################
########################################################################################################################


.PHONY: all-dependencies
all-dependencies: \
	.makehelper \
	build \
	all-tools \
	node_modules \
	.makehelper/npm-dependencies \
	.makehelper/peer-dependencies-dependencies

.PHONY: all-tools
all-tools:
	cd $(ROOT) && $(MAKE) all-dependencies
