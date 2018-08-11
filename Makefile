
ACTIVATE = . $(shell pwd)/admin/activate
ROOT = $(shell pwd)
ADMIN = $(ROOT)/admin

TOUCH = touch
CP = cp

MKDIR = mkdir
RM = rm
MORE = more
NPM = npm
LERNA = lerna
JEST = jest

PACKAGE_DIRS= \
   packages/moxb \
   packages/semui \
   packages/antd \
   packages/meteor

EXAMPLE_DIRS= \
   examples

SUB_DIRS= $(PACKAGE_DIRS) $(EXAMPLE_DIRS)

# all node_modules in the packages directory but not the one in examples
ALL_NODE_MODULES = $(patsubst %,%/node_modules,$(PACKAGE_DIRS))
ALL_PACKAGE_JSON = $(patsubst %,%/package.json,$(PACKAGE_DIRS))

## Some Colors for the output
NC='\033[0m'
RED='\033[0;31m'
CYAN='\033[00;36m'
LIGHT_GREEN='\033[1;32m'
LIGHT_BLUE='\033[1;34m'

### main targets ###################################

# recursively makes all targets before the :

.PHONY: all format-code format-check format-force tslint tslint-all webstorm-before-commit clean-build
all format-code format-check format-force tslint tslint-all webstorm-before-commit clean-build: all-dependencies
	for dir in $(SUB_DIRS); do \
		echo ${LIGHT_BLUE}'=======================================' $$dir '======================================='${NC}; \
		$(MAKE) -C $$dir -f Makefile $@ || exit 1; \
	done

.PHONY: help
help:
	@$(MORE) MakeHelp.md

.PHONY: clean
clean:
	$(LERNA) clean --yes
	for dir in $(SUB_DIRS); do \
		$(MAKE) -C $$dir clean; \
	done
	$(RM) -rf admin/activate
	$(RM) -rf admin/bin-tools
	$(RM) -rf node_modules
	$(RM) -rf coverage
	$(RM) -rf admin/node-installation/installation
	$(RM) -rf .git/hooks/pre-push
	$(RM) -rf .git/hooks/pre-commit
	$(RM) -rf .makehelper

### activate ###################################

admin/activate: admin/activate.in admin/bin/write-activate.sh
	admin/bin/write-activate.sh

### git hooks ###################################

.PHONY: pre-push
pre-push: pre-commit

.PHONY: pre-commit
pre-commit: all-dependencies _check-for-only
	$(MAKE) format-check
	$(MAKE) test

.PHONY: _check-for-only
_check-for-only:
	@!( grep '\.only(' `find $(SUB_DIRS) -name '*.test.ts*'`)


# create a helper directory with files for the makefile
# a directory with all the touched files to check timestamps
.makehelper:
	$(MKDIR) $@

.git/hooks/pre-push: hooks/pre-push
	$(CP) hooks/pre-push .git/hooks/

.git/hooks/pre-commit: hooks/pre-commit
	$(CP) hooks/pre-commit .git/hooks/

### node ########################################

.makehelper/node-installation: admin/node-installation/.node-version admin/node-installation/install.sh
	@echo "Installing node..."
	@$(ACTIVATE) && admin/node-installation/install.sh
	@touch $@

### lerna ########################################

.makehelper/lerna-installation: .makehelper/node-installation
	@echo "Installing lerna and jest..."
	@$(ACTIVATE) && $(NPM) install --global lerna@2.11.0 jest
	@touch $@

# if the node_modules do not exist, then create them.
# if we `make clean` in one of the packages, we have to re-install the node modules
$(ALL_NODE_MODULES) node_modules:
	@$(ACTIVATE) && lerna bootstrap --hoist

# this is a bit tricky: if any of the package.json changes we have to call `lerna bootstrap`
# BUT if we have called `npm install ...` in any of the packages dir, npm will install **all**
# npm packages in the node_modules. This confuses the whole proces....
# Therefore we remove the node modules in the `package/**/` directory and run `lerna`.
# This is quite fast, because lerna only create a few links in the node_modules
.makehelper/lerna-packages: $(ALL_NODE_MODULES) node_modules $(ALL_PACKAGE_JSON) package.json
	rm -rf $(ALL_NODE_MODULES)
	@$(ACTIVATE) && lerna bootstrap --hoist
	@touch $@


#################################################

.PHONY: _check-if-commands-exist
_check-if-commands-exist:
	@admin/bin/check-if-commands-exist.sh wget

###### node_module #############################

.PHONY: npm-update
npm-update:
	$(ACTIVATE) \
        && $(LERNA) exec -- npm-check --update

########################################################################################################################
.PHONY: test
test: run-unit-tests

.PHONY: run-unit-tests
run-unit-tests: all-dependencies
	$(ACTIVATE) && $(JEST)

###### bin-tools ###################################

admin/bin-tools:
	$(MAKE) .makehelper/bin-tools

.makehelper/bin-tools: Makefile
	rm -rf admin/bin-tools
	mkdir -p admin/bin-tools
	ln -sf ../../node_modules/.bin/jest admin/bin-tools/
	ln -sf ../../node_modules/.bin/npm-check admin/bin-tools/
	ln -sf ../../node_modules/.bin/prettier admin/bin-tools/
	ln -sf ../../node_modules/.bin/tsc admin/bin-tools/
	ln -sf ../../node_modules/.bin/tslint admin/bin-tools/
	@touch $@

###### watch-all ###################################
.PHONY: _build-packages
_build-packages: all-dependencies
	# first build the packages
	@for dir in $(PACKAGE_DIRS); do \
		echo ${LIGHT_BLUE}'=======================================' $$dir '======================================='${NC}; \
		$(MAKE) -C $$dir -f Makefile all || exit 1; \
	done
	# then make all dependenceis of the example
#	@for dir in $(EXAMPLE_DIRS); do \
#		echo ${LIGHT_BLUE}'=======================================' $$dir '======================================='${NC}; \
#		$(MAKE) -C $$dir -f Makefile all-dependencies || exit 1; \
#	done

# we first build all packages
.PHONY: watch-all
watch-all: clean-build _build-packages
	# the first argument is the one we are waiting for!
	admin/bin/watch-packages.sh $(EXAMPLE_DIRS) $(PACKAGE_DIRS)

# we first build all packages
.PHONY: watch
watch: _build-packages
	# the first argument is the one we are waiting for!
	admin/bin/watch-packages.sh $(PACKAGE_DIRS)

###### all-dependencie #############################

.PHONY: all-dependencies
all-dependencies: \
	.makehelper \
	_check-if-commands-exist \
	admin/activate \
	.makehelper/node-installation \
	.makehelper/lerna-installation \
	admin/bin-tools \
	.makehelper/bin-tools \
	.makehelper/lerna-packages \
	.git/hooks/pre-push \
	.git/hooks/pre-commit


