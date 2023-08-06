#!/bin/bash

KEYGEN_ACCOUNT="custodian-dev"
PLATFORM=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)
FILE_NAME="marzano-$PLATFORM-$ARCH"
URL="https://api.keygen.sh/v1/accounts/$KEYGEN_ACCOUNT/artifacts/$FILE_NAME"

# Fetch the artifact and extract the release version name
ARTIFACT_JSON=$(curl -s "$URL")
REDIRECT_URL=$(echo $ARTIFACT_JSON | jq -r '.data.links.redirect')
RELEASE_VERSION=$(echo $ARTIFACT_JSON | jq -r '.data.relationships.release.data.id')

# Download and uncompress the archive
TEMP_PATH="./marzano.tmp"
curl -L -o "$TEMP_PATH" "$REDIRECT_URL"
tar -xzf "$TEMP_PATH" -C "./"
rm "$TEMP_PATH"

echo "CLI version $RELEASE_VERSION installed."
