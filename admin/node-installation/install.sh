#!/usr/bin/env bash

# exit if any command fails
set -e

# https://stackoverflow.com/a/3466183/2297345
unameOut="$(uname -s)"
case "${unameOut}" in
    Linux*)     MASHINE=linux-x64;;
    Darwin*)    MASHINE=darwin-x64;;
#    CYGWIN*)    MASHINE=Cygwin;;
#    MINGW*)     MASHINE=MinGw;;
    *)          MASHINE="UNKNOWN:${unameOut}"
esac


INSTALLATION=$(cd "$(dirname "$0")"; pwd);

## xargs trims the whitespace https://stackoverflow.com/a/12973694/2297345
VERSION=`cat $INSTALLATION/.node-version | xargs`
TAR="node-v${VERSION}-${MASHINE}.tar.gz"
URL="https://nodejs.org/dist/v${VERSION}/${TAR}"

rm -rf $INSTALLATION/installation
mkdir -p $INSTALLATION/installation/current
cd $INSTALLATION/installation

wget $URL

tar -zxf $TAR --strip-components 1 -C current

rm -f $TAR
