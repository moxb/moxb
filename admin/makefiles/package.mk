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

build:
	$(MKDIR) build

.PHONY: clean-build
clean-build:
	$(RM) -rf build

.PHONY: clean
clean: clean-build
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

# all JS files found in the
TSC_JS_FILES = $(shell cd build && find . -type f -name '*.js' | sort )

# the names of the generated ja files
TSC_TS_TO_JS = $(shell cd src && find . -type f  \( -name '*.ts' -o -name '*.tsx' \) \
           	| grep -v '\.d\.ts' \
           	| sed s/\.ts$$/.js/g \
           	| sed s/\.tsx$$/.js/g \
           	| sort \
           	)

# we check if the list of generated files is the same as the list of
# actual files. If not, we remove all generated files...
.PHONY: _tsc-clean-generated-js-files-if-needed
_tsc-clean-generated-js-files-if-needed:
	@if [ "$(TSC_JS_FILES)" != "$(TSC_TS_TO_JS)" ]; then \
		$(MAKE) clean-generated-js-files; \
	fi

.PHONY: watch
watch:  all-dependencies _tsc-clean-generated-js-files-if-needed
	$(ACTIVATE) \
		&& cd src \
		&& $(TSC) --watch --preserveWatchOutput

.PHONY: clean-generated-js-files
clean-generated-js-files:
	$(RM) -rf build

.PHONY: build-all
build-all: all-dependencies _tsc-clean-generated-js-files-if-needed
	$(ACTIVATE) \
		&& cd src \
		&& ($(TSC) || echo typescript ERRORS found but ignored)

#####  END tsc ####################################################################################################
########################################################################################################################


.PHONY: all-dependencies
all-dependencies: \
	.makehelper \
	build
