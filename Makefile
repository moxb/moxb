# the helper directory with all the touched files to check timestamps
M = .makehelper

ACTIVATE = . $(shell pwd)/admin/activate

TOUCH = touch
CP = cp

MKDIR = mkdir

# see https://prettier.io/docs/en/options.html
PRETTIER_FORMAT= $(ACTIVATE) \
	&& prettier --parser typescript \
		--single-quote true \
		--print-width 120 \
		--bracket-spacing true \
		--trailing-comma es5 \
		--tab-width 4

RM = rm
MORE = more

TSLINT = tslint --config src/tslint.json --project src/tsconfig.json

all: tsc-watch

help:
	@$(MORE) MakeHelp.md

clean: _clean-obsolete _clean-generated-files
	$(RM) -rf src/node_modules
	$(RM) -rf optional-modules/node_modules
	$(RM) -rf admin/bin_node
	$(RM) -rf admin/bin_tools
	$(RM) -rf admin/node_modules
	$(RM) -rf admin/yarn-installation/installation/current
	$(RM) -rf admin/yarn-installation/installation/yarn-*
	$(RM) -rf admin/activate
	$(RM) -rf .git/hooks/pre-push
	$(RM) -rf .git/hooks/pre-commit
	$(RM) -rf $(M)

# clean generated files
_clean-generated-files: tsc-clean-generated-js-files

# The following files and directories do not exist in the current version of the project.
# Because previous versions of this project have used them, they are here to keep things
# clean when going back and forth in history
_clean-obsolete:

admin/activate: admin/activate.in admin/bin/write-activate.sh
	admin/bin/write-activate.sh

pre-push: pre-commit

pre-commit: all-dependencies _check-for-only
	$(MAKE) $(M)/formatted PRETTIER_OP=--list-different || (echo '\033[31mrun `make format-code` and commit the changes!\033[0m' && false)
	$(MAKE) $(M)/tslinted || (echo '\033[31mrun `make tslint-fix` and commit the changes!\033[0m' && false)
	$(MAKE) run-unit-tests

_check-for-only:
	@!( grep '\.only(' `find src/moxb -name '*.test.*'`)


# create a helper directory with files for the makefile
$(M):
	$(MKDIR) $@

.git/hooks/pre-push: hooks/pre-push
	$(CP) hooks/pre-push .git/hooks/

.git/hooks/pre-commit: hooks/pre-commit
	$(CP) hooks/pre-commit .git/hooks/

##########################################################
# meteor related

admin/bin_tools:
	make $(M)/bin-tools

$(M)/bin-tools: Makefile
	rm -rf admin/bin_tools
	mkdir -p admin/bin_tools
	ln -sf ../../src/node_modules/.bin/tsc admin/bin_tools/
	ln -sf ../../src/node_modules/.bin/tslint admin/bin_tools/
	ln -sf ../../src/node_modules/.bin/prettier admin/bin_tools/
	ln -sf ../../src/node_modules/.bin/chimp admin/bin_tools/
	ln -sf ../../src/node_modules/.bin/ts-node admin/bin_tools/
	ln -sf ../../src/node_modules/.bin/jest admin/bin_tools/
	@touch $@

###### src/node_module
src/node_modules:
	rm -rf $(M)/npm-dependencies
	$(MAKE) $(M)/npm-dependencies

# reinstall node modules when yarn version changes
$(M)/src-node_modules: admin/yarn-installation/.yarn-version
	rm -rf src/node_modules $(M)/npm-dependencies
	$(MAKE) $(M)/npm-dependencies
	@touch $@

$(M)/npm-dependencies: src/package.json src/yarn.lock
	@echo "Installing NPM dependencies for the meteor server..."
	$(ACTIVATE) \
		&& cd src \
		&& yarn --ignore-engines
	rm -rf $(M)/formatted $(M)/tslinted  $(M)/tslinted-all
	@touch $@


###### optional-modules/node_module
optional-modules/node_modules:
	rm -rf $(M)/optional-modules-node_module
	$(MAKE) $(M)/optional-modules-node_module

# reinstall node modules when yarn version changes
$(M)/optional-modules-node_modules: admin/yarn-installation/.yarn-version
	rm -rf optional-modules/node_modules $(M)/optional-modules-dependencies
	$(MAKE) $(M)/optional-modules-dependencies
	@touch $@

$(M)/optional-modules-dependencies: optional-modules/package.json optional-modules/yarn.lock
	@echo "Installing NPM dependencies for the meteor server..."
	$(ACTIVATE) \
		&& cd optional-modules \
		&& yarn --ignore-engines
	@touch $@


$(M)/yarn-installation: admin/yarn-installation/.yarn-version admin/bin/install-yarn.sh
	@echo "Installing yarn..."
	@$(ACTIVATE) && admin/bin/install-yarn.sh
	@touch $@


_check-if-commands-exist:
	@admin/bin/check-if-commands-exist.sh node


all-dependencies: \
	$(M) \
	_clean-obsolete \
	_check-if-commands-exist \
	.git/hooks/pre-push \
	.git/hooks/pre-commit \
	admin/activate \
	admin/bin_tools \
	$(M)/yarn-installation \
	$(M)/bin-tools \
	$(M)/src-node_modules \
	src/node_modules \
	$(M)/npm-dependencies \
	$(M)/optional-modules-dependencies \
	_tsc


npm-check-updates:
	$(ACTIVATE) && cd src && (yarn outdated || true)

run-unit-tests: run-unit-tests-jest

run-unit-tests-jest: all-dependencies
	$(ACTIVATE) \
		&& cd src \
		&& jest

run-unit-tests-verbose: all-dependencies
	$(ACTIVATE) \
		&& cd src \
		&& jest --verbose

format-code:
	$(MAKE) PRETTIER_OP=--write $(M)/formatted
	@touch $(M)/formatted

########################################################################################################################
##### Begin tsc hack ###################################################################################################
# TODO add src/__mocks__ here
# It does not work, because there are problems with tsc
TSC_TS_DIRS = \
	src/moxb

# all typescript files
TSC_TS_FILES = $(shell find $(TSC_TS_DIRS) -type f \( -name '*.ts' -o -name '*.tsx' \))

tsc-watch:  all-dependencies _tsc-clean-generated-js-files-if-needed
	$(ACTIVATE) \
		&& cd src \
		&& tsc --watch --preserveWatchOutput

tsc-clean-generated-js-files:
	find $(TSC_TS_DIRS) -name '*.ts'
#find $(TSC_TS_DIRS) -name '*.js' | xargs rm

# all JS files found in the
TSC_JS_FILES = $(shell find $(TSC_TS_DIRS) -type f -name '*.js' | sort )

# the names of the generated ja files
TSC_TS_TO_JS = $(shell find $(TSC_TS_DIRS) -type f  \( -name '*.ts' -o -name '*.tsx' \) \
           	| sed s/\.ts$$/.js/g \
           	| sed s/\.tsx$$/.js/g \
           	| sort \
           	)

# we check if the list of generated files is the same as the list of
# actual files. If not, we remove all generated files...
_tsc-clean-generated-js-files-if-needed:
	@if [ "$(TSC_JS_FILES)" != "$(TSC_TS_TO_JS)" ]; then \
		make tsc-clean-generated-js-files; \
	fi

_tsc: _tsc-clean-generated-js-files-if-needed
	$(ACTIVATE) \
		&& cd src \
		&& (tsc || echo typescript ERRORS found but ignored)

tsc:  all-dependencies _tsc
	$(ACTIVATE) \
		&& cd src \
		&& (tsc || echo typescript ERRORS found but ignored)

#####  END tsc hack ####################################################################################################
########################################################################################################################

# all typescript files
## TODO add
#    src/__mocks__
# here when tsc is removed (remove also `__mocks__` form the excludes in `tsconfig.json`!)
TS_DIRS = \
	src/moxb

# all typescript files
TS_FILES = $(shell find $(TS_DIRS) -type f \( -name '*.ts' -o -name '*.tsx' \))

# in this rule $? refers only to the files that have changed since $(M)/formatted has been touched
$(M)/formatted: $(TS_FILES)
	@echo "$(PRETTIER_FORMAT) $(PRETTIER_OP) ALL_CHANGED_FILES"
	@$(PRETTIER_FORMAT) $(PRETTIER_OP) $?
	@touch $@ # we can touch the file since there was no error....

# in this rule $? refers only to the files that have changed since $(M)/formatted has been touched
$(M)/tslinted: $(TS_FILES)
	@echo "$(PRETTIER_FORMAT) $(PRETTIER_OP) ALL_CHANGED_FILES"
	$(ACTIVATE) && $(TSLINT) $?
	@touch $@ # we can touch the file since there was no error....

tslint: $(M)/tslinted-all

# The second run of tslint with the `--format verbose` option is to show the rule in the output.
# However, webstrom does not recognize this line and does not link to the location.
# Therefore, we have the first run without the rule...
$(M)/tslinted-all:  $(TS_FILES) src/tslint.json
	$(ACTIVATE) && $(TSLINT)  \
		|| $(TSLINT) --format verbose
	@touch $@

tslint-fix:
	$(ACTIVATE) && $(TSLINT) --fix

format-file:
	@test -n "$(FILE)" || (echo 'Call make with `make $@ FILE=path/to/file`' && exit -1)
	@$(PRETTIER_FORMAT) --write $(FILE)

# this formats the output of tslint so that webstorm shows clickable links in the external tools window
#  exit ${PIPESTATUS[0]} make sure the command exits when there are errors
#  see https://stackoverflow.com/a/4968688/2297345
tslint-for-webstorm:
	bash -c '$(MAKE) tslint | sed -E "s/ERROR: ([^\[]+)\[([0-9]+), ([0-9]+)...(.*)/at \4 (\1:\2:\3)/"; exit $${PIPESTATUS[0]}'

# show an alert on mac: https://developer.apple.com/library/content/documentation/LanguagesUtilities/Conceptual/MacAutomationScriptingGuide/DisplayDialogsandAlerts.html#//apple_ref/doc/uid/TP40016239-CH15-SW1
webstorm-before-commit:
	$(MAKE) format-code tslint-for-webstorm run-unit-tests ||  osascript -e 'display dialog "make webstorm-before-commit FAILED"'


.PHONY: \
	all \
	help \
	clean \
	pre-push \
	pre-commit \
	all-dependencies \
	npm-check-updates \
	run-unit-tests \
	run-unit-tests-jest \
	format-code \
	tsc-clean-generated-js-files \
	tsc \
	tsc-watch \
	tslint \
	tslint-fix \
	format-file

