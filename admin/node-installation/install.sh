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

curl $URL --output $TAR

tar -zxf $TAR --strip-components 1 -C current

rm -f $TAR



# Install the specified version of npm
NPM_VERSION=`cat $INSTALLATION/.npm-version | xargs`

# to upgrade npm we need npm in the PATH....
export PATH=$INSTALLATION/installation/current/bin:$PATH

echo 'Before installing latest npm version'
npm --version
echo "Installing npm version npm@$NPM_VERSION (see $INSTALLATION/.npm-version)"

npm install -g npm@$NPM_VERSION

npm --version
