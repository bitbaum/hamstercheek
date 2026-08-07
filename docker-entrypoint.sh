#!/bin/sh
# Startup for the app container: apply migrations, then run the server.
#
# The database may accept connections a moment before it is truly ready (or the
# app may start fractionally ahead of the db healthcheck on a cold boot), so the
# migration step is retried a few times before we give up.
set -eu

PORT="${PORT:-3000}"

echo "[entrypoint] applying database migrations..."
attempt=0
until npm run --silent db:migrate; do
  attempt=$((attempt + 1))
  if [ "$attempt" -ge 10 ]; then
    echo "[entrypoint] migrations failed after ${attempt} attempts, giving up." >&2
    exit 1
  fi
  echo "[entrypoint] migrate attempt ${attempt} failed; retrying in 3s..."
  sleep 3
done

echo "[entrypoint] starting HamsterCheek on port ${PORT}..."
exec npm run --silent start -- -p "${PORT}" -H 0.0.0.0
