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
YARN = $(ADMIN)/yarn-installation/installation/current/bin/yarn
JEST = jest

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
	@$(TOUCH) $@

$(M)/npm-dependencies: package.json yarn.lock
	@echo "Installing NPM dependencies for the meteor server..."
	$(ACTIVATE) \
		&& $(YARN) --ignore-engines
	$(RM) -rf $(M)/formatted $(M)/tslinted  $(M)/tslinted-all
	@$(TOUCH) $@

###### optional-dependencies/node_module
optional-dependencies/node_modules:
	$(RM) -rf $(M)/optional-dependencies-node_module
	$(MAKE) $(M)/optional-dependencies-node_module

# reinstall node modules when yarn version changes
$(M)/optional-dependencies-node_modules: admin/yarn-installation/.yarn-version
	$(RM) -rf optional-dependencies/node_modules $(M)/optional-dependencies-dependencies
	$(MAKE) $(M)/optional-dependencies-dependencies
	@$(TOUCH) $@

$(M)/optional-dependencies-dependencies: optional-dependencies/package.json optional-dependencies/yarn.lock
	@echo "Installing NPM dependencies for the meteor server..."
	$(ACTIVATE) \
		&& cd optional-dependencies \
		&& $(YARN) --ignore-engines
	@$(TOUCH) $@

########################################################################################################################
run-unit-tests: all-dependencies
	$(ACTIVATE) \
		&& cd src \
		&& $(JEST)

run-unit-tests-verbose: all-dependencies
	$(ACTIVATE) \
		&& cd src \
		&& $(JEST) --verbose

########################################################################################################################
##### Begin tsc ###################################################################################################
# TODO add src/__mocks__ here
# It does not work, because there are problems with tsc

watch:  all-dependencies
	$(ACTIVATE) \
		&& cd src \
		&& $(TSC) --watch --preserveWatchOutput

clean-generated-js-files:
	$(RM) -rf build

build-all:  all-dependencies
	$(ACTIVATE) \
		&& cd src \
		&& ($(TSC) || echo typescript ERRORS found but ignored)

#####  END tsc ####################################################################################################
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
