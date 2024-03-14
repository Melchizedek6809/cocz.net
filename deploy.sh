#!/bin/sh
zola build && rsync -avhe ssh ./ cocz.net:./cocz.net/
