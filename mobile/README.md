# WishMe — Expo React Native App (Android + iOS)

## Project Structure

```
WishMeFinal/
├── app/                    # Expo Router screens
│   ├── _layout.tsx         # Root layout (KeyboardProvider REMOVED — see notes)
│   ├── index.tsx           # Entry redirect
│   └── (tabs)/             # Add your tab screens here
├── assets/images/          # App icons and splash screens
├── components/             # Shared UI components
├── context/                # React context providers
├── constants/              # App constants (colors, etc.)
├── hooks/                  # Custom hooks
├── app.json                # Expo config (newArchEnabled: true, reactCompiler: false)
├── babel.config.js         # Babel (api.cache(false) — prevents stale transforms)
└── metro.config.js         # Metro (packageExports + single react instance)
```

---

## Setup Steps (After Cloning)

```bash
# Install dependencies inside this folder ONLY — never at a parent level
npm install

# Start dev server
npx expo start

# Press 'a' for Android emulator, 'i' for iOS simulator (Mac only), or scan QR with Expo Go
```

---

## Building a Release APK — Android (Windows)

### Step 1 — Generate the Android project
```bash
npx expo prebuild --platform android --clean
```

### Step 2 — Apply gradle.properties config
Open `android/gradle.properties` and add at the bottom:
```properties
newArchEnabled=true
MYAPP_RELEASE_STORE_FILE=my-release-key.jks
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=aseas@#
MYAPP_RELEASE_KEY_PASSWORD=aseas@#
```

### Step 3 — Add signingConfigs to android/app/build.gradle
Inside the `android { }` block, place `signingConfigs` **outside and above** `buildTypes`:

```groovy
android {
    // ... existing config ...

    signingConfigs {
        release {
            storeFile file(MYAPP_RELEASE_STORE_FILE)
            storePassword MYAPP_RELEASE_STORE_PASSWORD
            keyAlias MYAPP_RELEASE_KEY_ALIAS
            keyPassword MYAPP_RELEASE_KEY_PASSWORD
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }
    }
}
```

### Step 4 — Place your keystore file
Copy `my-release-key.jks` into the `android/app/` folder.

### Step 5 — Build the release APK
```bash
cd android
.\gradlew assembleRelease --rerun-tasks
```

APK output path:
```
android\app\build\outputs\apk\release\app-release.apk
```

### If gradle clean fails (cache issues)
Manually delete these two folders instead:
```
android\app\.cxx
android\app\build
```
Then re-run:
```bash
.\gradlew assembleRelease --rerun-tasks
```

---

## Building for iOS

### Option A — Using EAS Build (Recommended for Windows users)

EAS Build runs the iOS build on Expo's cloud servers — no Mac required.

```bash
# Install EAS CLI
npm install -g eas-cli

# Log in to your Expo account
eas login

# Configure EAS for this project (first time only)
eas build:configure

# Build iOS IPA
eas build --platform ios --profile production
```

You will be guided to connect your Apple Developer account during the first build.
The IPA file will be available for download from the Expo dashboard.

### Option B — Build locally on a Mac

```bash
# Generate the iOS project
npx expo prebuild --platform ios --clean

# Open in Xcode
open ios/WishMe.xcworkspace

# In Xcode: Product → Archive → Distribute App
```

---

## Config Fix Notes

| File | Fix Applied | Why |
|------|------------|-----|
| `app.json` | `newArchEnabled: true` | Required by reanimated/worklets (both platforms) |
| `app.json` | `reactCompiler: false` | Prevents `useMemoCache` crash in release |
| `babel.config.js` | `api.cache(false)` | Prevents stale React Compiler transforms in release |
| `metro.config.js` | `unstable_enablePackageExports: true` | Fixes expo-router/entry resolution |
| `metro.config.js` | `resolveRequest` hook | Forces single react/react-native instance (prevents `useState of null` crash) |
| `app/_layout.tsx` | `KeyboardProvider` removed | Crashes Android release builds |
| `app/_layout.tsx` | No `KeyboardAwareScrollViewCompat` | Use `KeyboardAvoidingView` from react-native instead |
