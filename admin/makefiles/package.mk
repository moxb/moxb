M = .makehelper

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
$(M):
	$(MKDIR) $@

build:
	$(MKDIR) build

#include $(ADMIN)/makefiles/clean.mk

.PHONY: clean
clean:
	$(RM) -rf $(M)
	$(RM) -rf node_modules
	$(RM) -rf peer-dependencies/node_modules
	$(RM) -rf build

###### node_module
node_modules:
	$(RM) -rf $(M)/npm-dependencies
	$(MAKE) $(M)/npm-dependencies

# reinstall node modules when yarn version changes
$(M)/src-node_modules:
	$(RM) -rf node_modules $(M)/npm-dependencies
	$(MAKE) $(M)/npm-dependencies
	@$(TOUCH) $@

$(M)/npm-dependencies: package.json package-lock.json
	@echo "Installing NPM dependencies for the meteor server..."
	$(ACTIVATE) \
		&& $(NPM)
	$(RM) -rf $(M)/formatted $(M)/tslinted  $(M)/tslinted-all
	@$(TOUCH) $@

###### peer-dependencies/node_module
peer-dependencies/node_modules:
	$(RM) -rf $(M)/peer-dependencies-node_module
	$(MAKE) $(M)/peer-dependencies-node_module

# reinstall node modules when yarn version changes
$(M)/peer-dependencies-node_modules:
	$(RM) -rf peer-dependencies/node_modules $(M)/peer-dependencies-dependencies
	$(MAKE) $(M)/peer-dependencies-dependencies
	@$(TOUCH) $@

$(M)/peer-dependencies-dependencies: peer-dependencies/package.json peer-dependencies/package-lock.json
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
	$(M) \
	build \
	all-tools \
	node_modules \
	$(M)/npm-dependencies \
	$(M)/peer-dependencies-dependencies

.PHONY: all-tools
all-tools:
	cd $(ROOT) && $(MAKE) all-dependencies
