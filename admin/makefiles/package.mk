#ROOT = ../..
ROOT = $(shell cd ../.. && pwd)
PROJECT = $(shell pwd)
ADMIN = $(ROOT)/admin

ACTIVATE = . $(ADMIN)/activate

MKDIR = mkdir
RM = rm
TOUCH = touch
TSC = tsc
JEST = jest

# create a helper directory with files for the makefile
.makehelper:
	$(MKDIR) $@

dist:
	$(MKDIR) dist

.PHONY: clean-dist
clean-dist:
	$(RM) -rf dist
	find src -name '*.js' | xargs rm -f # remove accidentally generated `.js` files

.PHONY: clean-dist
clean-obsolete:
	@$(RM) -rf build # legacy

.PHONY: clean
clean: clean-dist
	$(RM) -rf .makehelper
	$(RM) -rf node_modules

########################################################################################################################
.PHONY: test
test: run-unit-tests

.PHONY: run-unit-tests
run-unit-tests: all-dependencies
	$(ACTIVATE) \
		&& cd src \
		&& $(JEST)

.PHONY: run-unit-tests-verbose
run-unit-tests-verbose: all-dependencies
	$(ACTIVATE) \
		&& cd src \
		&& $(JEST) --verbose

########################################################################################################################
##### Begin tsc ###################################################################################################

#-----------------------------------------------------------------------------------------------------------------------
#-- Begin Clean Generated Files if needed ------------------------------------------------------------------------------

# all JS files found in the
TS_EXISTING_GENERATED_JS_FILES = $(shell cd dist && find . -type f -name '*.js' | sort )

# the names of the generated ja files
TS_EXPECTED_GENERATED_JS_FILES = $(shell cd src && find . -type f  \( -name '*.ts' -o -name '*.tsx' \) \
	| grep -v '\.d\.ts' \
	| sed s/\.ts$$/.js/g \
	| sed s/\.tsx$$/.js/g \
	| sort \
	)

# we check if the list of generated files is the same as the list of
# actual files. If not, we remove all generated files. That sould trigger
# a re-build of the `.js` files
.PHONY: _tsc-clean-generated-js-files-if-needed
_tsc-clean-generated-js-files-if-needed:
	@if [ "$(TS_EXISTING_GENERATED_JS_FILES)" != "$(TS_EXPECTED_GENERATED_JS_FILES)" ]; then \
		$(MAKE) clean-generated-js-files; \
	fi

.PHONY: clean-generated-js-files
clean-generated-js-files:
	$(RM) -rf dist


#-- End Clean Generated Files if needed --------------------------------------------------------------------------------
#-----------------------------------------------------------------------------------------------------------------------

# ----------------------------------------------------------------------------------------------------------------------
# - Begin typescript compilation ---------------------------------------------------------------------------------------

# All typescript files, that generate `.js` files (node: `.d.ts` files do not generate `.js` files)
TS_CODE_FILES=$(shell find src -type f \( -name '*.ts' -o -name '*.tsx' \) | grep -v '\.d\.ts$$' )


# All the the `.js` files that we expect to be generated by `tsc` (no `.d.ts` files)
# we have to replace `src` with `dist`!
TS_OUTPUT_JS_FILES = $(shell find src -type f  \( -name '*.ts' -o -name '*.tsx' \) \
	| grep -v '\.d\.ts$$' \
	| sed s/\.ts$$/.js/g \
	| sed s/\.tsx$$/.js/g \
	| sed s/^src/dist/g \
	| sort \
	)

# if any of the input `.ts` or `.tsx` files is newer that the `.js` files then run the typescript compiler `tsc`
# typescript files that produce .js files (that means excluding `.d.ts` files)
# this is a bit tricky: we use % on the left hand side to prevent the rule to be called on each changed file....
# https://stackoverflow.com/a/3077254/2297345
# https://www.gnu.org/software/make/manual/html_node/Substitution-Refs.html#Substitution-Refs
$(TS_OUTPUT_JS_FILES:.js=%js): $(TS_CODE_FILES)
	@echo 'changed files:' $?
	$(ACTIVATE) \
		&& cd src \
		&& tsc

.PHONY: watch
watch:  all-dependencies _tsc-clean-generated-js-files-if-needed
	$(ACTIVATE) \
		&& cd src \
		&& $(TSC) --watch --preserveWatchOutput

.PHONY: build-all
build-all: all-dependencies _tsc-clean-generated-js-files-if-needed $(TS_OUTPUT_JS_FILES)
	@cp src/*.css dist/ 2>/dev/null || true


# - End typescript compilation -----------------------------------------------------------------------------------------
# ----------------------------------------------------------------------------------------------------------------------

#####  END tsc ####################################################################################################
########################################################################################################################

# If the makefile changes, we need to re-build
.makehelper/tsc-dependencies: $(ADMIN)/makefiles/*.mk $(ROOT)/Makefile Makefile tsconfig.json $(ROOT)/package-lock.json package-lock.json
	@$(RM) -rf dist
	@touch $@

.PHONY: all-dependencies
all-dependencies: \
	.makehelper \
	clean-obsolete \
	.makehelper/tsc-dependencies \
	dist
