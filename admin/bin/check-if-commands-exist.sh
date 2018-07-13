#!/usr/bin/env bash

for cmd in "$@" ; do
    if ! command -v "$cmd" &> /dev/null ; then
        echo Please install "$cmd"!
        exit 1
    fi
done
