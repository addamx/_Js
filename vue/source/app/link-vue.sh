#!/usr/local/bin
# shellcheck shell=bash
rm -rf ./node_modules/vue
ln -s "$(pwd)/vue-2.7.14" "$(pwd)/node_modules/vue"
