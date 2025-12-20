# Fixing Native Module Error

## Problem
`expo-document-picker` requires native code and doesn't work in Expo Go. You're seeing:
```
ERROR  [Error: Cannot find native module 'ExpoDocumentPicker']
```

## Solution Options

### Option 1: Use Development Build (Recommended for Production)

This allows you to use `expo-document-picker` with all features:

```bash
# Install expo-dev-client (already in package.json)
npx expo install expo-dev-client

# For Android
npx expo run:android

# For iOS
npx expo run:ios
```

This will create a custom development build with all native modules included.

### Option 2: Use Expo Go Compatible Alternative (Quick Testing)

For now, to test in Expo Go, we can temporarily disable the file picker and allow users to use files from their recordings. Or use a web-based approach.

### Option 3: Prebuild and Build Locally

```bash
# Generate native projects
npx expo prebuild

# Run on Android
npx expo run:android

# Run on iOS  
npx expo run:ios
```

## Recommended Next Steps

Since you're developing a production app with audio processing, I recommend:

1. **Use Development Build** (Option 1):
   ```bash
   npx expo run:android
   ```
   
   This will:
   - Install expo-dev-client
   - Build a custom version of your app
   - Include all native modules (expo-document-picker, etc.)
   - Allow you to test the full API integration

2. **After the build completes**, the app will run on your device/emulator with all native features enabled.

## Alternative: Use recordings from the app

Instead of picking files, users can:
1. Record audio in the Recorder tab
2. Go to Noise Reducer or Voice Booster
3. Select from their recordings

This would work in Expo Go without any native modules. Let me know if you'd like me to implement this approach instead!
