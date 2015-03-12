#!/bin/bash -e

ECHO_BLUE () { echo -e "\033[0;34m${1}\033[0m"; }

git checkout --orphan gh-pages-temp
git reset .
rm .gitignore
git pull https://github.com/rackerlabs/barricade.git master
grunt jsdoc
mv doc doc_temp
git checkout gh-pages
git branch -D gh-pages-temp
rm -r doc
mv doc_temp doc
git add doc/
git commit -m "Update docs"
ECHO_BLUE "READY TO PUSH"
