all:
	cd ../.. && $(MAKE)

# this will forward any other make goal to the parent makefile
$(MAKECMDGOALS):
	cd ../.. && $(MAKE) $(MAKECMDGOALS)
