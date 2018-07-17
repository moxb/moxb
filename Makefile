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

PACKAGE_DIRS= \
   packages/moxb \
   packages/semui \
   packages/meteor \


TSLINT = tslint --config src/tslint.json --project src/tsconfig.json

all: tsc-watch

test:


help:
	@$(MORE) MakeHelp.md

clean:
	for d in $(PACKAGE_DIRS); \
	   do cd $$p && $(MAKE) clean; \
	done
	$(RM) -rf admin/node-tools/node_modules
	$(RM) -rf admin/yarn-installation/installation/current
	$(RM) -rf admin/yarn-installation/installation/yarn-*
	$(RM) -rf admin/activate
	$(RM) -rf .git/hooks/pre-push
	$(RM) -rf .git/hooks/pre-commit
	$(RM) -rf $(M)


admin/activate: admin/activate.in admin/bin/write-activate.sh
	admin/bin/write-activate.sh

pre-push: pre-commit

pre-commit: all-dependencies _check-for-only
	$(MAKE) $(M)/formatted PRETTIER_OP=--list-different || (echo '\033[31mrun `make format-code` and commit the changes!\033[0m' && false)
	$(MAKE) $(M)/tslinted || (echo '\033[31mrun `make tslint-fix` and commit the changes!\033[0m' && false)
	$(MAKE) run-unit-tests

_check-for-only:
	@!( grep '\.only(' `find $(PACKAGE_DIRS) -name '*.test.*'`)


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


all-dependencies: \
	$(M) \
	_check-if-commands-exist \
	.git/hooks/pre-push \
	.git/hooks/pre-commit \
	admin/activate \
	$(M)/yarn-installation


run-unit-tests: all-dependencies
	$(ACTIVATE) \
		&& echo $$NODE_PATH
	$(ACTIVATE) \
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

tsc-watch:  all-dependencies
	$(ACTIVATE) \
		&& cd packages/moxb/src \
		&& tsc --watch --preserveWatchOutput

tsc-clean-generated-js-files:
	rm -rf src/build

tsc:  all-dependencies
	$(ACTIVATE) \
		&& cd packages/moxb/src \
		&& (tsc || echo typescript ERRORS found but ignored)

#####  END tsc hack ####################################################################################################
########################################################################################################################

# all typescript files
TS_DIRS = \
	packages/moxb/src

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
	run-unit-tests \
	run-unit-tests-jest \
	format-code \
	tsc-clean-generated-js-files \
	tsc \
	tsc-watch \
	tslint \
	tslint-fix \
	format-file

