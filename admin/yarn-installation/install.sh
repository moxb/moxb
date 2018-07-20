#!/usr/bin/env bash

# exit if any command fails
set -e

INSTALLATION=$(cd "$(dirname "$0")"; pwd);

## xargs trims the whitespace https://stackoverflow.com/a/12973694/2297345
VERSION=`cat $INSTALLATION/.yarn-version | xargs`
TAR="yarn-v${VERSION}.tar.gz"
URL="https://github.com/yarnpkg/yarn/releases/download/v${VERSION}/${TAR}"

rm -rf $INSTALLATION/installation
mkdir -p $INSTALLATION/installation/current
cd $INSTALLATION/installation

wget $URL

tar -zxf $TAR --strip-components 1 -C current

rm -f $TAR
