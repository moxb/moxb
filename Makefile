
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

## Some Colors for the output
NC='\033[0m'
RED='\033[0;31m'
CYAN='\033[00;36m'
LIGHT_GREEN='\033[1;32m'
LIGHT_BLUE='\033[1;34m'

### main targets ###################################

# recursively makes all targets before the :

.PHONY: \
all format-code format-check format-force tslint tslint-fix tslint-all webstorm-before-commit clean-dist
all format-code format-check format-force tslint tslint-fix tslint-all webstorm-before-commit clean-dist: all-dependencies
	for dir in $(SUB_DIRS); do \
		echo ${LIGHT_BLUE}'=======================================' $$dir $@ '======================================='${NC}; \
		$(MAKE) -C $$dir -f Makefile $@ || exit 1; \
	done

.PHONY: help
help:
	@$(MORE) MakeHelp.md

.PHONY: clean
clean: clean-generated
	$(RM) -rf node_modules
	$(RM) -rf admin/node-installation/installation
	$(RM) -rf .makehelper

.PHONY: clean-generated
clean-generated:
	($(ACTIVATE) && jest --clearCache) || true
	($(ACTIVATE) && $(LERNA) clean --yes) || true
	for dir in $(SUB_DIRS); do \
		$(MAKE) -C $$dir clean; \
	done
	$(RM) -f .makehelper/lerna-bootstrap
	$(RM) -f .makehelper/bin-tools
	$(RM) -rf admin/activate
	$(RM) -rf admin/bin-tools
	$(RM) -rf coverage
	$(RM) -rf .git/hooks/pre-push
	$(RM) -rf .git/hooks/pre-commit

### activate ###################################

admin/activate: admin/activate.in admin/bin/write-activate.sh
	admin/bin/write-activate.sh

### git hooks ###################################

.PHONY: pre-push
pre-push: pre-commit

.PHONY: pre-commit
pre-commit: all-dependencies _check-for-only
	$(MAKE) format-check
	$(MAKE) build-packages test

# is there an `only` in any of the tests
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

.makehelper/node-installation: admin/node-installation/.node-version admin/node-installation/.npm-version admin/node-installation/install.sh
	@echo "Installing node..."
	@admin/bin/check-if-commands-exist.sh wget
	@$(ACTIVATE) && admin/node-installation/install.sh
	@touch $@

### lerna ########################################

# all node_modules in the packages directory but not the one in examples
LERNA_NODE_MODULES = $(patsubst %,%/node_modules,$(PACKAGE_DIRS))
LERNA_PACKAGE_JSON = $(patsubst %,%/package.json,$(PACKAGE_DIRS))
LERNA_PACKAGE_LOCK_JSON = $(patsubst %,%/package-lock.json,$(PACKAGE_DIRS))

# if the node_modules do not exist, then create them.
# if we `make clean` in one of the packages, we have to re-install the node modules
$(LERNA_NODE_MODULES):
	mkdir -p $(LERNA_NODE_MODULES)

# if any of those changes - `lerna bootstrap` has to run again
LERNA_DEPENDENCIES = \
	node_modules \
	.makehelper/npm-dependencies \
	$(LERNA_NODE_MODULES) \
	$(LERNA_PACKAGE_JSON) \
	$(LERNA_PACKAGE_LOCK_JSON)

# this is a bit tricky: if any of the $(LERNA_DEPENDENCIES) changes we have to call `lerna bootstrap`
# BUT if we have called `npm install ...` in any of the packages dir, npm will install **all**
# npm packages in the node_modules. This confuses the whole proces....
# Therefore we remove the node modules in the `package/**/` directory and run `lerna`.
# This is quite fast, because lerna only create a few links in the node_modules
.makehelper/lerna-bootstrap: $(LERNA_DEPENDENCIES)
	rm -rf $(LERNA_NODE_MODULES) # remove all modules
	mkdir -p $(LERNA_NODE_MODULES) # create empty dirs, lerna may not create it if there is no content!
	$(ACTIVATE) && lerna bootstrap --hoist
	touch $@
	touch .makehelper/npm-dependencies # lerna touches package.json package-lock.json!


###### node_module for global tools ##############
node_modules:
	$(RM) -rf .makehelper/npm-dependencies
	$(MAKE) .makehelper/npm-dependencies

.makehelper/npm-dependencies: package.json package-lock.json
	@echo "Installing NPM dependencies..."
	$(ACTIVATE) \
		&& $(NPM) ci
	@$(TOUCH) $@


###### node_module #############################

.PHONY: npm-update
npm-update:
	$(ACTIVATE) && npm-check --update
	$(ACTIVATE) \
        && $(LERNA)  --concurrency=1 exec -- npm-check --update
	$(ACTIVATE) && cd examples && npm-check --update
########################################################################################################################
.PHONY: test
test: run-unit-tests

.PHONY: run-unit-tests
run-unit-tests: all-dependencies
	$(ACTIVATE) && $(JEST)

.PHONY: run-unit-tests-ci
run-unit-tests-ci: all-dependencies
	$(ACTIVATE) && $(JEST) --maxWorkers=4

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
	ln -sf ../../node_modules/.bin/lerna admin/bin-tools/
	@touch $@

###### watch-all ###################################
.PHONY: build-packages
build-packages: all-dependencies
	@for dir in $(PACKAGE_DIRS); do \
		echo ${LIGHT_BLUE}'=======================================' $$dir '======================================='${NC}; \
		$(MAKE) -C $$dir -f Makefile all || exit 1; \
	done

# we first build all packages
.PHONY: watch-all
watch-all: all-dependencies
	# the first argument is the one we are waiting for!
	MOXB_FIRST_VERBOSE=1 admin/bin/watch-packages.sh $(EXAMPLE_DIRS) $(PACKAGE_DIRS)

.PHONY: watch-all-verbose
watch-all-verbose:
	MOXB_WATCH_ALL_VERBOSE=1 $(MAKE) watch-all

# we first build all packages
.PHONY: watch
watch: all-dependencies
	# the first argument is the one we are waiting for!
	admin/bin/watch-packages.sh $(PACKAGE_DIRS)

.PHONY: watch-verbose
watch-verbose:
	MOXB_WATCH_ALL_VERBOSE=1 MOXB_FIRST_VERBOSE=1 $(MAKE) watch

.PHONY: watch-test
watch-test: all-dependencies
	$(ACTIVATE) && $(JEST) --watch

npm-publish: build-packages
	$(ACTIVATE) && lerna publish

###### all-dependencie #############################

.PHONY: all-dependencies
all-dependencies: \
	.makehelper \
	admin/activate \
	.makehelper/node-installation \
	admin/bin-tools \
	.makehelper/bin-tools \
	.makehelper/lerna-bootstrap \
	.git/hooks/pre-push \
	.git/hooks/pre-commit


