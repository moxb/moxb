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
# TODO add src/__mocks__ here
# It does not work, because there are problems with tsc

.PHONY: watch
watch:  all-dependencies
	$(ACTIVATE) \
		&& cd src \
		&& $(TSC) --watch --preserveWatchOutput

.PHONY: clean-generated-js-files
clean-generated-js-files:
	$(RM) -rf build

.PHONY: build-all
build-all:  all-dependencies
	$(ACTIVATE) \
		&& cd src \
		&& ($(TSC) || echo typescript ERRORS found but ignored)

#####  END tsc ####################################################################################################
########################################################################################################################


.PHONY: all-dependencies
all-dependencies: \
	.makehelper \
	build
