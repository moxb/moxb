#!/usr/bin/env bash

# exit if any command fails
set -e

# the latest yarn can ge found here
# update
# https://github.com/yarnpkg/yarn/releases/latest

YARN_INSTALLATION=$(cd "$(dirname "$0")";cd ../yarn-installation; pwd);

## xargs trims the whitespace https://stackoverflow.com/a/12973694/2297345
YARN_VERSION=`cat $YARN_INSTALLATION/.yarn-version | xargs`

YARN_TAR="yarn-v${YARN_VERSION}.tar.gz"

YARN_URL="https://github.com/yarnpkg/yarn/releases/download/v${YARN_VERSION}/${YARN_TAR}"

YARN_TARGET="yarn-$YARN_VERSION"

cd $YARN_INSTALLATION/installation

# remove the old version(s)
rm -rf yarn-*
rm -f $YARN_TAR

wget $YARN_URL

# Remove old dist directory. yarn tarballs changed root folder from dist to yarn-VERSION
if [ -d dist ]
then
    rm -rf dist
fi

# Remove existing symlink 'current'
if [ -L current ]
then
    rm -f current
fi

# Remove existing yarn installation
if [ -d $YARN_TARGET ]
then
    rm -rf $YARN_TARGET
fi

mkdir $YARN_TARGET
tar -zxf $YARN_TAR --strip-components 1 -C $YARN_TARGET
ln -s $YARN_TARGET current

rm -f $YARN_TAR
