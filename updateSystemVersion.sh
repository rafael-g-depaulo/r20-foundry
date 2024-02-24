#!/bin/bash

# IMPORTANT: this needs the semver utility from https://github.com/fsaintjacques/semver-tool

OLD_VERSION=$(cat ./package.json | jq --raw-output '.version')
CHANGE_TYPE=$(
	echo "major minor patch" |
		tr ' ' '\n' |
		fzf --preview="echo \"$OLD_VERSION -> \$(semver bump {} $OLD_VERSION)\""
)

NEW_VERSION=$(semver bump $CHANGE_TYPE $OLD_VERSION)

# update system.json
cat ./system.json |
	jq ". + { version: \"$NEW_VERSION\", download: \"https://github.com/rafael-g-depaulo/r20-foundry/archive/refs/tags/v$NEW_VERSION.zip\"}" |
	tee ./system.json &>/dev/null

# update package.json
cat ./package.json |
	jq ". + {version: \"$NEW_VERSION\"}" |
	tee ./package.json &>/dev/null

# add git tag
git add -A
git commit -m "Release v$NEW_VERSION"
git tag v$NEW_VERSION &>/dev/null

echo "changed package semver: $OLD_VERSION -> $NEW_VERSION"
