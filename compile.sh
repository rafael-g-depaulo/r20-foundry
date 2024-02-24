#!/bin/bash

SERVE_PORT=3939

# rm -rf dist &>/dev/null
# mkdir dist

SERVE_DIR=serve

# rm -rf $SERVE_DIR &>/dev/null
# mkdir $SERVE_DIR
#
# build code
yarn build

# make system.json
cat system.json |
	jq ". + {download: \"https://localhost:$SERVE_PORT/r20-module.zip\" }" |
	jq ". + {manifest: \"https://localhost:$SERVE_PORT/system.json\" }" |
	tee $SERVE_DIR/system.json &>/dev/null

# zip module and put it in serve folder
# FILES_TO_ZIP=$(echo **/* | tr ' ' '\n' | grep -Ev -e '^node_modules' -e '^dist' -e '^build' -e '^serve')
FILES_TO_ZIP=$(echo **/* | tr ' ' '\n')
rm $SERVE_DIR/r20-module.zip
zip $SERVE_DIR/r20-module.zip $FILES_TO_ZIP

# make ssl certificates
mkcert localhost

# serve built stuff (should be another script)
# fuser -k $SERVE_PORT/tcp
# ./node_modules/.bin/serve -d $SERVE_DIR -p $SERVE_PORT
