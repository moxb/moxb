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
NPM = npm install --preserve-symlinks
PACREL = ./node_modules/.bin/parcel

# create a helper directory with files for the makefile
$(M):
	$(MKDIR) $@

.PHONY: all
all: build

.PHONY: build
build:  all-dependencies
	$(ACTIVATE) \
		&& $(PACREL) build index.html

.PHONY: dev
dev:  all-dependencies
	$(ACTIVATE) \
		&& $(PACREL) index.html

#include $(ADMIN)/makefiles/clean.mk
.PHONY: clean
clean:
	$(RM) -rf $(M)
	$(RM) -rf node_modules

###### node_module
node_modules:
	$(RM) -rf $(M)/npm-dependencies
	$(MAKE) $(M)/npm-dependencies

# reinstall node modules when version changes
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
	$(M) \
	all-tools \
	node_modules \
	$(M)/npm-dependencies \

.PHONY: all-tools
all-tools:
	cd $(ROOT) && $(MAKE) all-dependencies
