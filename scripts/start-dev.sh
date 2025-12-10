#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$ROOT_DIR/../web"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js 未安装"
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm 未安装"
  exit 1
fi

cd "$APP_DIR"

# 提示 Node 版本
NODE_V=$(node -v 2>/dev/null || echo "")
if [ -n "$NODE_V" ]; then
  NODE_V_CLEAN=$(echo "$NODE_V" | sed 's/^v//')
  MAJOR=${NODE_V_CLEAN%%.*}
  case "$MAJOR" in
    '' ) ;;
    * )
      if [ "$MAJOR" -lt 20 ]; then
        echo "当前 Node 版本: $NODE_V_CLEAN，建议切换到 >=20.9.0 以保证 build 兼容。"
        echo "如果使用 nvm: nvm install 20 && nvm use 20 （项目内置 .nvmrc: 20.18.0）"
      fi
    ;;
  esac
fi

if [ ! -d node_modules ]; then
  echo "安装依赖"
  npm install
fi

if lsof -i tcp:5173 >/dev/null 2>&1; then
  PID=$(lsof -ti tcp:5173)
  echo "释放端口 5173: $PID"
  kill -9 $PID || true
fi

echo "启动开发服务: http://localhost:5173/"
npm run dev
