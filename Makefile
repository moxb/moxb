# the helper directory with all the touched files to check timestamps
M = .makehelper

ACTIVATE = . $(shell pwd)/admin/activate
ROOT = $(shell pwd)
ADMIN = $(ROOT)/admin

TOUCH = touch
CP = cp
YARN = yarn

MKDIR = mkdir
RM = rm
MORE = more

PACKAGE_DIRS= \
   packages/moxb \
   packages/semui \
   packages/meteor \
   examples \

## Some Colors for the output
NC='\033[0m'
RED='\033[0;31m'
CYAN='\033[00;36m'
LIGHT_GREEN='\033[1;32m'
LIGHT_BLUE='\033[1;34m'

# recursively makes all targets before the :
all test: all-dependencies
	for dir in $(PACKAGE_DIRS); do \
		echo ${LIGHT_BLUE}'=======================================' $$dir '======================================='${NC}; \
		$(MAKE) -C $$dir -f Makefile $@; \
	done

help:
	@$(MORE) MakeHelp.md

clean:
	for dir in $(PACKAGE_DIRS); do \
		$(MAKE) -C $$dir clean; \
	done
	$(RM) -rf admin/activate
	$(RM) -rf admin/bin-tools
	$(RM) -rf node_modules
	$(RM) -rf admin/yarn-installation/installation/current
	$(RM) -rf admin/yarn-installation/installation/yarn-*
	$(RM) -rf .git/hooks/pre-push
	$(RM) -rf .git/hooks/pre-commit
	$(RM) -rf $(M)


admin/activate: admin/activate.in admin/bin/write-activate.sh
	admin/bin/write-activate.sh

pre-push: pre-commit

pre-commit: all-dependencies _check-for-only
	$(MAKE) test

_check-for-only:
	@!( grep '\.only(' `find $(PACKAGE_DIRS) -name '*.test.ts*'`)


# create a helper directory with files for the makefile
$(M):
	$(MKDIR) $@

.git/hooks/pre-push: hooks/pre-push
	$(CP) hooks/pre-push .git/hooks/

.git/hooks/pre-commit: hooks/pre-commit
	$(CP) hooks/pre-commit .git/hooks/

### yarn ########################################

$(M)/yarn-installation: admin/yarn-installation/.yarn-version admin/bin/install-yarn.sh
	@echo "Installing yarn..."
	@$(ACTIVATE) && admin/bin/install-yarn.sh
	@touch $@


_check-if-commands-exist:
	@admin/bin/check-if-commands-exist.sh node

###### node_module #############################

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

###### bin-tools ###################################

admin/bin-tools:
	make $(M)/bin-tools

$(M)/bin-tools: Makefile
	rm -rf admin/bin-tools
	mkdir -p admin/bin-tools
	ln -sf ../../node_modules/.bin/jest admin/bin-tools/
	@touch $@


###### all-dependencie #############################

all-dependencies: \
	$(M) \
	_check-if-commands-exist \
	admin/activate \
	$(M)/yarn-installation \
	node_modules \
	admin/bin-tools \
	$(M)/bin-tools \
	$(M)/src-node_modules \
	.git/hooks/pre-push \
	.git/hooks/pre-commit \


.PHONY: \
	all \
	help \
	clean \
	pre-push \
	pre-commit \
	all-dependencies \

