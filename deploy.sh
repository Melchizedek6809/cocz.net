#!/bin/sh
npm run build && rsync -avhe ssh --delete ./dist/ cocz.net:./cocz.net/
