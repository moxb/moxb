#!/usr/bin/env bash

# make sure all background processes are killed when finishes
trap 'kill -SIGTERM $(jobs -p) > /dev/null 2>&1 || true' EXIT HUP TERM INT

## we take the first argument wait until it dies
first="$1"

shift

# now we start all other targets in backgorund
# we ignore the output of the backgorund watch processes
for dir in "$@"
do
    if [ "$MOXB_WATCH_ALL_VERBOSE" != "" ]; then
        echo 'make -C "'$dir'" watch &'
        make -C "$dir" watch &
    else
        echo 'make -C "'$dir'" watch >/dev/null &'
        make -C "$dir" watch >/dev/null &
    fi
done

if [ "$MOXB_FIRST_VERBOSE" != "" ]; then
    echo 'make -C "'$first'" watch'
    make -C "$first" watch
else
    echo 'make -C "'$first'" watch >/dev/null'
    make -C "$first" watch >/dev/null
fi
