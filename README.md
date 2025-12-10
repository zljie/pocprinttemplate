打印模版管理 (Next.js)

快速启动
- Node 版本：建议使用 `20.x`（项目在 `web/package.json` 的 `engines.node >=20.9.0`）
- 开发：
  - `cd web`
  - `npm ci` 或 `npm install`
  - `npm run dev`（默认端口 5173，如占用可改 `-p 5174`）

部署到 Vercel（使用 npm + Node 20）
- Project Settings：
  - Root Directory：`web`
  - Node Version：`20.x`
  - Install Command：`npm ci`
  - Build Command：`npm run build`
  - Output Directory：`.next`
- 说明：仓库已提供 `web/.npmrc` 强制使用 npm registry，避免 pnpm/Corepack 触发的网络错误（如 `ERR_INVALID_THIS`）。

常见问题
- 依赖安装报 `ERR_INVALID_THIS`（Handlebars 拉取失败）：
  - 原因：在受限环境/代理下使用 pnpm/Corepack 从 npm registry 拉包失败
  - 解决：在 Vercel 项目设置中强制使用 npm（Install Command 改为 `npm ci`，Node 选 `20.x`）；同时保留 `web/.npmrc`。
- Node 版本不匹配导致构建失败：本地与 CI 统一使用 Node 20；可在本地执行 `nvm install 20 && nvm use 20`。

功能概述
- 模板管理：列表、新建表单（纸张边距预设与数值编辑）、模板编辑（TinyMCE）、示例数据渲染预览（Handlebars）
- 模版案例：到货通知单（A4 横向），支持在编辑器打开与直接预览
- 数据源管理：分组/来源筛选、搜索、拖拽排序、别名设置、集合标识

目录结构
- `web/`：Next.js 应用（源码、配置、依赖）
- `web/public/cases/arrival-notice/`：示例模板与数据
- `scripts/`：启动与部署辅助脚本（开发、Vercel CLI、TinyMCE 本地化资源）

安全与约定
- 不提交秘钥与证书，环境变量通过 Vercel 管理
- 统一 npm 包管理，避免混用 pnpm/yarn
