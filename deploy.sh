#!/bin/sh
./build.scm && rsync -avhe ssh --delete ./dist/ cocz.net:./cocz.net/
