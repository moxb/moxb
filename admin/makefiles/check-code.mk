## To override this variable you have to use the following statement **before** including this file
#  override TS_DIRS = src
TS_DIRS = src

# see https://prettier.io/docs/en/options.html
PRETTIER_FORMAT= $(ACTIVATE) \
	&& prettier

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

# show an alert on mac: https://developer.apple.com/library/content/documentation/LanguagesUtilities/Conceptual/MacAutomationScriptingGuide/DisplayDialogsandAlerts.html#//apple_ref/doc/uid/TP40016239-CH15-SW1
.PHONY: webstorm-before-commit
webstorm-before-commit:
	$(MAKE) format-code run-unit-tests ||  (osascript -e 'display dialog "make webstorm-before-commit FAILED"' && false)

.PHONY: eslint
eslint:
	$(ESLINT) $(TS_FILES)
