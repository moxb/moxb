#!/bin/bash

MOXB_ROOT=$(cd "$(dirname "$0")";cd ../..; pwd)
ADMIN=$(cd "$(dirname "$0")";cd ..; pwd)
TARGET=$ADMIN/activate

echo "# This file must be used with \"source activate\" *from bash*" > $TARGET
echo "# you cannot run it directly" >> $TARGET
echo "#" >> $TARGET
echo "# Also, don't try to edit this file, since this is generated from activate.in" >> $TARGET
echo ADMIN=$ADMIN >> $TARGET
echo MOXB_ROOT=$MOXB_ROOT >> $TARGET

cat $ADMIN/activate.in >> $TARGET
