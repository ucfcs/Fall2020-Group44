# Mobile

## Prerequisite

[Running on Device](https://reactnative.dev/docs/running-on-device)

## Run instructions for iOS:

    •  npx react-native run-ios
    - or -
    • Open mobile/ios/mobile.xcworkspace in Xcode or run "xed -b ios"
    • Hit the Run button

## Run instructions for Android:

    • Have an Android emulator running (quickest way to get started), or a device connected.
    •  npx react-native run-android

## Run instructions for Windows and macOS:

    • See https://aka.ms/ReactNative for the latest up-to-date instructions.

## Resources

- [Setup](https://reactnative.dev/docs/typescript)
- [Android Studio](https://developer.android.com/studio)
- [XCode](https://apps.apple.com/us/app/xcode/id497799835?mt=12)

## Environment Variable File

Create a `.env.json` file in the root folder for mobile and provide the
following content. An object with one property, `BACKEND_URL`.

```.env.json
{
    "BACKEND_URL": "https://df1da6f61a00.ngrok.io"
}
```
