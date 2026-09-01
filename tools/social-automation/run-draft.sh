#!/usr/bin/env bash
set -euo pipefail

ROOT="/home/lorenz-parzer/Documents/Account"
LOCK="$ROOT/tools/social-automation/draft.lock"
LOG_DIR="$ROOT/tools/social-automation/logs"
mkdir -p "$LOG_DIR"

exec 9>"$LOCK"
flock -n 9 || exit 0

STAMP="$(date +%Y%m%d-%H%M%S)"
"/home/lorenz-parzer/.nvm/versions/node/v22.23.2/bin/codex" --approve-for-me exec \
  --skip-git-repo-check \
  --cd "$ROOT" \
  --sandbox workspace-write \
  "$(<"$ROOT/tools/social-automation/draft-prompt.md")" \
  >"$LOG_DIR/$STAMP.log" 2>&1
