#!/bin/bash
#set -o xtrace

# Name of your app.
APP="Sqlite Page Explorer"
# The path of your app to sign.
APP_PATH="release-builds/Sqlite Page Explorer-mas-x64/Sqlite Page Explorer.app"
# The path to the location you want to put the signed package.
RESULT_PATH="release-builds/Sqlite Page Explorer-mas-x64/$APP.pkg"
# The name of certificates you requested.
APP_KEY="3rd Party Mac Developer Application: Arundale Ramanathan (K4J7VPDHY4)"
INSTALLER_KEY="3rd Party Mac Developer Installer: Arundale Ramanathan (K4J7VPDHY4)"
# The path of your plist files.
CHILD_PLIST="child.plist"
PARENT_PLIST="parent.plist"
LOGINHELPER_PLIST="loginhelper.plist"

FRAMEWORKS_PATH="$APP_PATH/Contents/Frameworks"

#electron-osx-sign "$APP_PATH" --entitlements="$PARENT_PLIST" --platform=mas --provisioning-profile=Siara_Logics_cc.provisionprofile --embedded-binary="$APP_PATH/Contents/Resources/app.asar"

codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/Electron Framework.framework/Versions/A/Electron Framework"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/Electron Framework.framework/Versions/A/Libraries/libffmpeg.dylib"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/Electron Framework.framework/Versions/A/Libraries/libnode.dylib"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/Electron Framework.framework"
# codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/$APP Helper.app/Contents/MacOS/$APP Helper"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/$APP Helper.app/"
# codesign -s "$APP_KEY" -f --entitlements "$LOGINHELPER_PLIST" "$APP_PATH/Contents/Library/LoginItems/$APP Login Helper.app/Contents/MacOS/$APP Login Helper"
codesign -s "$APP_KEY" -f --entitlements "$LOGINHELPER_PLIST" "$APP_PATH/Contents/Library/LoginItems/$APP Login Helper.app/"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$APP_PATH/Contents/Frameworks/$APP Helper EH.app"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$APP_PATH/Contents/Frameworks/$APP Helper NP.app"
# codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$APP_PATH/Contents/MacOS/$APP"
codesign -s "$APP_KEY" -f --entitlements "$PARENT_PLIST" "$APP_PATH"

productbuild --component "$APP_PATH" /Applications --sign "$INSTALLER_KEY" "$RESULT_PATH"
#productbuild --component HelloCordova.app /Applications --sign "3rd Party Mac Developer Installer: Arundale Ramanathan (K4J7VPDHY4)" .
#codesign -s "3rd Party Mac Developer Application: Arundale Ramanathan (K4J7VPDHY4)" -f --entitlements child.plist HelloCordova.app
#spctl --ignore-cache --no-cache --assess --type execute --verbose=4 sign/Electron.app/Contents/Frameworks/Electron\ Helper.app
#find -H release-builds/Sqlite\ Page\ Explorer-mas-x64/Sqlite\ Page\ Explorer.app -print0 | xargs -0 file | grep "Mach-O .*executable"
