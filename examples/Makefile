M = .makehelper

#ROOT = ../..
ROOT = $(shell cd .. && pwd)
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

build:  all-dependencies
	$(ACTIVATE) \
		&& ($(TSC) || echo typescript ERRORS found but ignored)

#include $(ADMIN)/makefiles/clean.mk
clean:
	$(RM) -rf $(M)
	$(RM) -rf node_modules

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

########################################################################################################################
##### Begin tsc ###################################################################################################

watch:  all-dependencies
	$(ACTIVATE) \
		&& $(TSC) --watch --preserveWatchOutput

clean-generated-js-files:
	$(RM) -rf build

#####  END tsc ####################################################################################################
########################################################################################################################
test:
	echo 'No tests for examples needed'

all-dependencies: \
	$(M) \
	all-tools \
	node_modules \
	$(M)/npm-dependencies \

all-tools:
	cd $(ROOT) && $(MAKE) all-dependencies
