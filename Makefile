
ACTIVATE = . $(shell pwd)/admin/activate
ROOT = $(shell pwd)
ADMIN = $(ROOT)/admin

TOUCH = touch
CP = cp

MKDIR = mkdir
RM = rm
MORE = more
NPM = npm install --preserve-symlinks

PACKAGE_DIRS= \
   packages/moxb \
   packages/semui \
   packages/antd \
   packages/meteor \

EXAMPLE_DIRS= \
   examples \

SUB_DIRS= $(PACKAGE_DIRS) $(EXAMPLE_DIRS)

## Some Colors for the output
NC='\033[0m'
RED='\033[0;31m'
CYAN='\033[00;36m'
LIGHT_GREEN='\033[1;32m'
LIGHT_BLUE='\033[1;34m'

### main targets ###################################

# recursively makes all targets before the :

.PHONY: all test format-code format-check format-force
all test format-code format-check format-force: all-dependencies
	for dir in $(SUB_DIRS); do \
		echo ${LIGHT_BLUE}'=======================================' $$dir '======================================='${NC}; \
		$(MAKE) -C $$dir -f Makefile $@ || exit 1; \
	done

.PHONY: help
help:
	@$(MORE) MakeHelp.md

.PHONY: clean
clean:
	for dir in $(SUB_DIRS); do \
		$(MAKE) -C $$dir clean; \
	done
	$(RM) -rf admin/activate
	$(RM) -rf admin/bin-tools
	$(RM) -rf node_modules
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

#################################################

.PHONY: _check-if-commands-exist
_check-if-commands-exist:
	@admin/bin/check-if-commands-exist.sh wget

###### node_module #############################

node_modules:
	$(RM) -rf .makehelper/npm-dependencies
	$(MAKE) .makehelper/npm-dependencies

package-lock.json:
	$(RM) -rf node_modules
	$(ACTIVATE) \
    		&& $(NPM)

.PHONY: npm-update
npm-update:
	$(ACTIVATE) \
        && npm-check --update
	for dir in $(SUB_DIRS); do \
		echo ${LIGHT_BLUE}'=======================================' $$dir '======================================='${NC}; \
		$(MAKE) -C $$dir -f Makefile $@ || exit 1; \
	done

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

###### npm-link ###################################
## Links npm projects so that they are updated when souce changes...
.makehelper/npm-linked:
	$(MAKE) npm-link
	@$(TOUCH) $@

.PHONY: npm-link
npm-link: all-dependencies
	for dir in $(SUB_DIRS); do \
		(cd $$dir && $(ACTIVATE) && npm link); \
	done
	for dir in $(SUB_DIRS); do \
		$(MAKE) -C $$dir npm-link-dependencies; \
	done
	@$(TOUCH) .makehelper/npm-linked

###### bin-tools ###################################

admin/bin-tools:
	make .makehelper/bin-tools

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

.PHONY: watch-all
watch-all: all .makehelper/npm-linked
# the first argument is the one we are waiting for!
	admin/bin/watch-packages.sh $(EXAMPLE_DIRS) $(PACKAGE_DIRS)

###### all-dependencie #############################

.PHONY: all-dependencies
all-dependencies: \
	.makehelper \
	_check-if-commands-exist \
	admin/activate \
	.makehelper/node-installation \
	node_modules \
	admin/bin-tools \
	.makehelper/bin-tools \
	.makehelper/src-node_modules \
	.git/hooks/pre-push \
	.git/hooks/pre-commit \


