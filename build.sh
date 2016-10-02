#!/bin/bash
find . \( -name '.DS_Store' -or -name '._*' \) -delete
set -e

VERSION=${VERSION}
VERSION=${VERSION:=`git describe --tags --abbrev=0`}

echo "Version: $VERSION"

rm -fr dist

for b in $(ls manifests); do
    mkdir -p dist/${b}

    for lang in $(ls manifests/${b}); do
        dist=dist/${b}/${b}-${lang}-${VERSION}
        mkdir -p ${dist}

        cp -r options background img popup ${dist}

        mkdir -p ${dist}/_locales
        if [ -d messages/${lang} ]; then
          cp -r messages/${lang} ${dist}/_locales
        else
          cp -r messages/en ${dist}/_locales
        fi

        mkdir -p ${dist}/img
        cp -r img/*.* ${dist}/img

        export VERSION && envsubst '\$VERSION' < manifests/${b}/${lang}/manifest.json > ${dist}/manifest.json

    done
done

cd dist/firefox
for ext in $(ls -1 .); do
    cd ${ext} && zip -qr ../${ext}.xpi . && cd ..
done
cd ../..

# cd dist/chrome
# for ext in $(ls -1 .); do
#     ../../crx-build.sh ${ext} ~/.ssh/chrome-extension.pem
#     cd ${ext} && zip -qr ../${ext}.zip . && cd ..
# done