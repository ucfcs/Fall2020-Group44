# Mobile

## Prerequisite

- [Running on Device](https://reactnative.dev/docs/running-on-device)
- Setup ngrok as a proxy for the backend and add that url to the `.env.json`

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

```json
{
	"BACKEND_URL": "https://df1da6f61a00.ngrok.io",
	"WS_SERVER_URL": "http://localhost:3001"
}
```

## Setup

Start terminal and open the following tabs.

tab 1 - youll need to run ngrok to act as a proxy for your backend

- use the following command `./ngrok http 5000`
- copy the url and update the following places
  - the redirect url on canvas developer keys
  - the backend .env redirect url var
  - into the `.env.json` in the mobile folder

tab 2 - will be used to run the backend. `npm run dev`

tab 3 - go into the mobile folder and run the following `npm run start`

tab 4 - will be for running the emulator ios: `npx react-native run-ios`
android: `npx react-native run-android`. Close after emulator has launched.
