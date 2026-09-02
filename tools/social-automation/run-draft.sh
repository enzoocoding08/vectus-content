#!/usr/bin/env bash
set -euo pipefail

ROOT="/home/lorenz-parzer/Documents/Account"
LOCK="$ROOT/tools/social-automation/draft.lock"
LOG_DIR="$ROOT/tools/social-automation/logs"
mkdir -p "$LOG_DIR"

exec 9>"$LOCK"
flock -n 9 || exit 0

STAMP="$(date +%Y%m%d-%H%M%S)"
CODEX_BIN="$(command -v codex || true)"
if [[ -z "$CODEX_BIN" ]]; then
  for candidate in /home/lorenz-parzer/.nvm/versions/node/*/bin/codex; do
    if [[ -x "$candidate" ]]; then
      CODEX_BIN="$candidate"
    fi
  done
fi
if [[ -z "$CODEX_BIN" ]]; then
  echo "codex executable not found in PATH" >"$LOG_DIR/$STAMP.log"
  exit 127
fi

"$CODEX_BIN" --approve-for-me exec \
  --skip-git-repo-check \
  --cd "$ROOT" \
  --sandbox workspace-write \
  "$(<"$ROOT/tools/social-automation/draft-prompt.md")" \
  >"$LOG_DIR/$STAMP.log" 2>&1
