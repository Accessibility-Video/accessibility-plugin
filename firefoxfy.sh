#!/bin/bash

dist=dist
manifest=$dist/manifest.json

if [ ! -e "$manifest" ]; then
    echo "Could not target 'manifest.json'"
    exit 1;
fi
##
# Replaces the content scripts for the bundled ones.
##
npx rollup --config rollup.firefox.config.js --environment production
sed -i 's/assets\/foreground\(-[a-z]\{1,\}\)-[a-z0-9]\{1,\}.js/foreground\1.js/g' $manifest
