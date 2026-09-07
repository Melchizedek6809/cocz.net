#!/bin/sh
./build && rsync -avhe ssh --delete ./dist/ cocz.net:./cocz.net/
