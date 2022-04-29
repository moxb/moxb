## To override this variable you have to use the following statement **before** including this file
#  override TS_DIRS = src
TS_DIRS = src

# see https://prettier.io/docs/en/options.html
PRETTIER_FORMAT= $(ACTIVATE) \
	&& prettier --parser typescript \
		--single-quote true \
		--print-width 120 \
		--bracket-spacing true \
		--trailing-comma es5 \
		--tab-width 4

TSLINT = $(ACTIVATE) && tslint --project tsconfig.json
ESLINT = $(ACTIVATE) && eslint

# all typescript files
TS_FILES = $(shell find $(TS_DIRS) -type f \( -name '*.ts' -o -name '*.tsx' \))

###### code formatting  ########################################################

.PHONY: format-code
format-code: all-dependencies
	$(MAKE) PRETTIER_OP=--write .makehelper/formatted

.PHONY: format-force
format-force: all-dependencies
	rm -f .makehelper/formatted
	$(MAKE) PRETTIER_OP=--write .makehelper/formatted

.PHONY: format-check
format-check: all-dependencies
	@$(MAKE) .makehelper/formatted PRETTIER_OP=--list-different || (echo '\033[31mrun `make format-code` and commit the changes!\033[0m' && false)

.PHONY: format-file
format-file: all-dependencies
	@test -n "$(FILE)" || (echo 'Call make with `make $@ FILE=path/to/file`' && exit -1)
	@$(PRETTIER_FORMAT) --write $(FILE)

# in this rule $? refers only to the files that have changed since .makehelper/formatted has been touched
.makehelper/formatted: $(TS_FILES)
	$(PRETTIER_FORMAT) $(PRETTIER_OP) $?
	@touch $@ # we can touch the file since there was no error....

###### tslint ########################################################

.PHONY: tslint
tslint: all-dependencies .makehelper/tslint-cfg .makehelper/tslinted

.makehelper/tslint-cfg: tslint.json tsconfig.json
	rm -f .makehelper/tslinted .makehelper/tslint-fixed
	@touch $@


# in this rule $? refers only to the files that have changed since .makehelper/formatted has been touched
.makehelper/tslinted: $(TS_FILES)
	$(TSLINT) $?
	@touch $@ # we can touch the file since there was no error....

.PHONY: tslint-all
tslint-all: .makehelper/tslinted-all

# The second run of tslint with the `--format verbose` option is to show the rule in the output.
# However, webstrom does not recognize this line and does not link to the location.
# Therefore, we have the first run without the rule...
.makehelper/tslinted-all: all-dependencies $(TS_FILES) tslint.json tsconfig.json
	$(TSLINT) $(TS_FILES) \
		|| $(TSLINT) --format verbose $(TS_FILES)
	@touch $@

.PHONY: tslint-fix
tslint-fix: all-dependencies .makehelper/tslint-cfg .makehelper/tslint-fixed

# in this rule $? refers only to the files that have changed since .makehelper/formatted has been touched
.makehelper/tslint-fixed: $(TS_FILES)
	$(TSLINT) --fix $?
	@touch $@ # we can touch the file since there was no error....

# this formats the output of tslint so that webstorm shows clickable links in the external tools window
#  exit ${PIPESTATUS[0]} make sure the command exits when there are errors
#  see https://stackoverflow.com/a/4968688/2297345
.PHONY: tslint-for-webstorm
tslint-for-webstorm:
	bash -c '$(MAKE) tslint-all | sed -E "s/ERROR: ([^\[]+)\[([0-9]+), ([0-9]+)...(.*)/at \4 (\1:\2:\3)/"; exit $${PIPESTATUS[0]}'

# show an alert on mac: https://developer.apple.com/library/content/documentation/LanguagesUtilities/Conceptual/MacAutomationScriptingGuide/DisplayDialogsandAlerts.html#//apple_ref/doc/uid/TP40016239-CH15-SW1
.PHONY: webstorm-before-commit
webstorm-before-commit:
	$(MAKE) format-code tslint-for-webstorm run-unit-tests ||  (osascript -e 'display dialog "make webstorm-before-commit FAILED"' && false)

.PHONY: eslint
eslint:
	$(ESLINT) $(TS_FILES)
