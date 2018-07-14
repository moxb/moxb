M = .makehelper

ROOT = ../..
# ROOT = $(shell cd ../.. && pwd)
ADMIN = $(ROOT)/admin

ACTIVATE = . $(ADMIN)/activate

MKDIR = mkdir
RM = rm
TOUCH = touch

# this will forward any other make goal to the parent makefile

all: tsc

# create a helper directory with files for the makefile
$(M):
	$(MKDIR) $@

build:
	$(MKDIR) build

#include $(ADMIN)/makefiles/clean.mk

clean:
	$(RM) -rf $(M)
	$(RM) -rf node_modules
	$(RM) -rf optional-dependencies/node_modules
	$(RM) -rf build

###### node_module
node_modules:
	$(RM) -rf $(M)/npm-dependencies
	$(MAKE) $(M)/npm-dependencies

# reinstall node modules when yarn version changes
$(M)/src-node_modules: $(ADMIN)/yarn-installation/.yarn-version
	$(RM) -rf node_modules $(M)/npm-dependencies
	$(MAKE) $(M)/npm-dependencies
	@touch $@

$(M)/npm-dependencies: package.json yarn.lock
	@echo "Installing NPM dependencies for the meteor server..."
	$(ACTIVATE) \
		&& yarn --ignore-engines
	$(RM) -rf $(M)/formatted $(M)/tslinted  $(M)/tslinted-all
	@touch $@

###### optional-dependencies/node_module
optional-dependencies/node_modules:
	rm -rf $(M)/optional-dependencies-node_module
	$(MAKE) $(M)/optional-dependencies-node_module

# reinstall node modules when yarn version changes
$(M)/optional-dependencies-node_modules: admin/yarn-installation/.yarn-version
	rm -rf optional-dependencies/node_modules $(M)/optional-dependencies-dependencies
	$(MAKE) $(M)/optional-dependencies-dependencies
	@touch $@

$(M)/optional-dependencies-dependencies: optional-dependencies/package.json optional-dependencies/yarn.lock
	@echo "Installing NPM dependencies for the meteor server..."
	$(ACTIVATE) \
		&& cd optional-dependencies \
		&& yarn --ignore-engines
	@touch $@

########################################################################################################################
##### Begin tsc hack ###################################################################################################
# TODO add src/__mocks__ here
# It does not work, because there are problems with tsc

tsc-watch:  all-dependencies
	$(ACTIVATE) \
		&& cd src \
		&& tsc --watch --preserveWatchOutput

tsc-clean-generated-js-files:
	rm -rf build

tsc:  all-dependencies
	$(ACTIVATE) \
		&& cd src \
		&& (tsc || echo typescript ERRORS found but ignored)

#####  END tsc hack ####################################################################################################
########################################################################################################################



all-dependencies: \
	$(M) \
	build \
	all-tools \
	node_modules \
	$(M)/npm-dependencies \
	$(M)/optional-dependencies-dependencies

all-tools:
	cd $(ROOT) && $(MAKE) all-dependencies
