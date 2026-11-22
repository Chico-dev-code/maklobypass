#!/usr/bin/env bash
# Pakai: bash run.sh "pesan commit"         -> commit + push
#        bash run.sh "pesan commit" --cli   -> push + vercel --prod
#        FORCE=1 bash run.sh "pesan"        -> paksa push (menimpa isi repo GitHub)
set -eo pipefail
cd "$(dirname "$0")"
if [ -f .env ]; then set -a; . ./.env; set +a; fi

MSG="${1:-update}"
BRANCH="main"
# Hanya file project ini yang ikut. Repo lain di folder ini diabaikan.
FILES="server run.sh README.md .gitignore .env.example"

[ -d .git ] || git init -q -b "$BRANCH"
git config user.name  >/dev/null || git config user.name  "${GIT_USERNAME:-bot}"
git config user.email >/dev/null || git config user.email "${GIT_USERNAME:-bot}@users.noreply.github.com"

git reset -q 2>/dev/null || true
for f in $FILES; do
  if [ -e "$f" ]; then git add -- "$f"; fi
done

if git diff --cached --quiet; then
  echo "(tidak ada perubahan untuk di-commit)"
else
  git commit -q -m "$MSG"
fi

git branch -M "$BRANCH"
FORCE_FLAG=""; [ -n "$FORCE" ] && FORCE_FLAG="--force"

if [ -n "$GIT_USERNAME" ] && [ -n "$GIT_TOKEN" ] && [ -n "$GIT_REPO" ]; then
  git push $FORCE_FLAG "https://${GIT_USERNAME}:${GIT_TOKEN}@${GIT_REPO#https://}" "HEAD:$BRANCH" 2>&1 | sed "s#${GIT_TOKEN}#***#g"
else
  git remote get-url origin >/dev/null 2>&1 || { echo "Isi GIT_USERNAME, GIT_TOKEN, GIT_REPO di file .env"; exit 1; }
  git push $FORCE_FLAG -u origin "$BRANCH"
fi

if [ "$2" = "--cli" ]; then
  (cd server && vercel --prod --yes)
fi
echo "✅ selesai"
