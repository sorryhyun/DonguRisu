# Capacitor Android Backend (`/android`)

This directory contains the Capacitor 5.7 Android project for the mobile application.

## Directory Structure

| Path | Purpose |
|------|---------|
| `app/` | Main Android application module |
| `app/src/main/` | Source code and resources |
| `app/build.gradle` | App-level Gradle config |
| `build.gradle` | Project-level Gradle config |
| `variables.gradle` | SDK versions and dependencies |
| `gradle/` | Gradle wrapper |

## Configuration

### App Identity (`app/build.gradle`)

```groovy
namespace "co.aiclient.risu"
applicationId "co.aiclient.risu"
versionCode 2
versionName "127.0.0"
```

### SDK Versions (`variables.gradle`)

| Setting | Value |
|---------|-------|
| `minSdkVersion` | 22 (Android 5.1) |
| `compileSdkVersion` | 33 (Android 13) |
| `targetSdkVersion` | 33 |

## Android Manifest

### Permissions

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

### Activity Configuration

- **Launch mode**: `singleTask` (single instance)
- **Config changes handled**: orientation, keyboard, screen size, locale

## Project Structure

```
android/
├── app/
│   ├── src/main/
│   │   ├── AndroidManifest.xml
│   │   ├── java/co/aiclient/risu/   # Java source
│   │   └── res/                      # Resources (icons, layouts)
│   └── build.gradle
├── build.gradle
├── variables.gradle
├── gradle.properties
└── capacitor.settings.gradle
```

## Building

### Prerequisites

- Android Studio or Android SDK
- JDK 11+
- Capacitor CLI

### Development

```bash
# Sync web assets to Android
npx cap sync android

# Open in Android Studio
npx cap open android

# Run on device/emulator
npx cap run android
```

### Production Build

Build from Android Studio:
1. Build → Generate Signed Bundle/APK
2. Select APK
3. Create or use existing keystore
4. Build release APK

Or via command line:
```bash
cd android
./gradlew assembleRelease
```

Output: `app/build/outputs/apk/release/app-release.apk`

## Capacitor Integration

The web app is loaded from `app/src/main/assets/public/`.

Capacitor plugins used (from `capacitor.config.ts` in root):
- Filesystem access
- HTTP/Network
- Storage

## File Provider

Configured for secure file sharing:
```xml
<provider
    android:name="androidx.core.content.FileProvider"
    android:authorities="${applicationId}.fileprovider"
    ... />
```

## Related Documentation

- [Root CLAUDE.md](../CLAUDE.md) - Project overview
- [TypeScript CLAUDE.md](../src/ts/CLAUDE.md) - Frontend code
- [Capacitor docs](https://capacitorjs.com/docs)
