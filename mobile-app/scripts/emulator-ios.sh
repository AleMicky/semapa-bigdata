#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
unset CI

export EXPO_PUBLIC_API_URL="${EXPO_PUBLIC_API_URL:-http://localhost:3000}"

PORT="${EXPO_PORT:-8081}"
if lsof -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  PORT=8082
  echo "Puerto 8081 ocupado; usando $PORT"
fi

exec npx expo start --ios --port "$PORT"
