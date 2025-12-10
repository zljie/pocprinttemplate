#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$ROOT_DIR/../web"

cd "$APP_DIR"

NODE_V=$(node -v 2>/dev/null || echo "")
if [ -n "$NODE_V" ]; then
  NODE_V_CLEAN=$(echo "$NODE_V" | sed 's/^v//')
  MAJOR=${NODE_V_CLEAN%%.*}
  if [ "$MAJOR" -lt 20 ]; then
    echo "当前 Node 版本: $NODE_V_CLEAN，构建要求 >=20。"
    echo "请先切换：nvm install 20 && nvm use 20 或使用 Volta/Node@20。"
    exit 1
  fi
fi

echo "安装依赖 (CI 优先)"
npm ci || npm install

echo "执行构建"
npm run build

if ! command -v vercel >/dev/null 2>&1; then
  echo "安装 Vercel CLI"
  npm i -g vercel
fi

echo "登录并发布（首次可能需要交互登录）"
echo "提示：如要全程非交互，请设置 VERCEL_ORG_ID/VERCEL_PROJECT_ID 和 --token"

# 链接项目（若已链接会跳过）
vercel link --confirm --cwd "$APP_DIR" || true

# 部署到生产
vercel deploy --prod --confirm --cwd "$APP_DIR" || true

echo "命令已发起，登录或选择团队后将完成部署。"
