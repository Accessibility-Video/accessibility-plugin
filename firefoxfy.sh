#!/bin/bash

dist=dist
manifest=$dist/manifest.json
background_wrapper=$dist/background.esm\-wrapper.js

if [ ! -e "$manifest" ]; then
    echo "Could not target 'manifest.json'"
    exit 1;
fi
if [ ! -e "$background_wrapper" ]; then
    echo "Could not target 'background.esm-wrapper.js'"
    exit 1;
fi
##
# Replaces the content scripts for the bundled ones.
##
npx rollup --config rollup.firefox.config.js --environment production
sed -i 's/assets\/foreground\(-[a-z]\{1,\}\)-[a-z0-9]\{1,\}.js/foreground\1.js/g' $manifest
##
# Replaces the chrome with browser so the onInstalled works.
##
sed -i 's/chrome/browser/' $background_wrapper
