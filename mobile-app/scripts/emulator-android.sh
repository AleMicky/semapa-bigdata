#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
export ANDROID_HOME="${ANDROID_HOME:-$HOME/Library/Android/sdk}"
export PATH="$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools:$PATH"

if ! command -v adb >/dev/null 2>&1; then
  echo "No se encontró adb. Instala Android Studio o define ANDROID_HOME."
  exit 1
fi

if ! adb devices | grep -qE 'device$'; then
  AVD="${ANDROID_AVD:-S23_API_33}"
  echo "Iniciando emulador Android: $AVD"
  nohup emulator -avd "$AVD" -no-snapshot-load >/tmp/semapa-android-emulator.log 2>&1 &
  adb wait-for-device
  until [[ "$(adb shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')" == "1" ]]; do
    sleep 2
  done
  echo "Emulador listo."
fi

cd "$ROOT"
unset CI
export EXPO_PUBLIC_API_URL="${EXPO_PUBLIC_API_URL:-http://10.0.2.2:3000}"

PORT="${EXPO_PORT:-8081}"
if lsof -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  PORT=8082
  echo "Puerto 8081 ocupado; usando $PORT"
fi

exec npx expo start --android --port "$PORT"
