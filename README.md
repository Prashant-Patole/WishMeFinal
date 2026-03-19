# WishMe — Expo React Native App

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
# 1. Install dependencies (inside this folder only — never at a parent level)
npm install

# 2. Start dev server
npx expo start

# 3. Press 'a' to open on Android emulator or scan QR with Expo Go
```

---

## Building a Release APK on Windows

### Step 1 — Generate the Android project
```bash
npx expo prebuild --platform android --clean
```

### Step 2 — Apply gradle.properties config
Open `android/gradle.properties` and add these lines at the bottom:
```properties
newArchEnabled=true
MYAPP_RELEASE_STORE_FILE=my-release-key.jks
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=aseas@#
MYAPP_RELEASE_KEY_PASSWORD=aseas@#
```

### Step 3 — Add signingConfigs to android/app/build.gradle
In `android/app/build.gradle`, find the `android { }` block.
Place the `signingConfigs` block OUTSIDE AND ABOVE `buildTypes`:

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
Copy your `my-release-key.jks` file into the `android/app/` folder.

### Step 5 — Build the release APK
```bash
cd android
.\gradlew assembleRelease --rerun-tasks
```

The APK will be at:
```
android\app\build\outputs\apk\release\app-release.apk
```

### If gradle clean fails (cache issues)
Do NOT use `gradle clean`. Instead, manually delete these folders:
```
android\app\.cxx
android\app\build
```
Then re-run:
```bash
.\gradlew assembleRelease --rerun-tasks
```

---

## Config Fix Notes

| File | Fix Applied | Why |
|------|------------|-----|
| `app.json` | `newArchEnabled: true` | Required by reanimated/worklets |
| `app.json` | `reactCompiler: false` | Prevents `useMemoCache` crash in release |
| `babel.config.js` | `api.cache(false)` | Prevents stale React Compiler transforms in release |
| `metro.config.js` | `unstable_enablePackageExports: true` | Fixes expo-router/entry resolution |
| `metro.config.js` | `resolveRequest` hook | Forces single react/react-native instance (prevents `useState of null` crash) |
| `app/_layout.tsx` | `KeyboardProvider` removed | Crashes Android release builds |
| `app/_layout.tsx` | No `KeyboardAwareScrollViewCompat` | Crashes Android release builds |

---

## Adding API Integration (Later)

The backend is already ready. When you're ready to connect:
1. Add your API base URL to `constants/`
2. Create API service files in a `services/` folder
3. Update screens to use real data instead of mock data
