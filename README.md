# 打印模版管理（Print Template Management）

一个基于 React + TypeScript + Vite 的前端项目，用于管理“业务打印模版”和“报表打印模版”。支持数据源管理、模版基本信息维护、使用 Monaco Editor 编辑 HTML 模版并预览效果，数据持久化采用浏览器 `localStorage`，无需后端即可演示完整流程。

## 功能特性
- 业务打印模版管理：新增/编辑/删除、模版内容编辑与预览（Monaco Editor）
- 报表打印模版管理：同上，支持独立的报表模版集合
- 数据源管理：支持分组筛选、来源筛选、搜索、拖拽排序、别名设置、集合标识
- 本地持久化：模版与数据源变更自动保存到 `localStorage`
- 路由与布局：`react-router-dom` 提供多页面路由，Ant Design 布局与组件

## 技术栈
- 框架：`React 18`、`TypeScript`
- 构建：`Vite 6`，使用 `@vitejs/plugin-react`
- UI：`Ant Design`、`react-beautiful-dnd`、`@monaco-editor/react`
- 样式：`Tailwind CSS`、`PostCSS`、`Autoprefixer`
- 包管理：`pnpm`

## 快速开始
1. 安装依赖（首次）
   - 如未安装 pnpm：`npm i -g pnpm`
   - 安装项目依赖：`pnpm install`
2. 启动开发环境：`pnpm dev`
   - 默认开发端口：`5173`
   - 打开浏览器访问：`http://localhost:5173/`
3. 构建生产包：`pnpm build`
   - 如需启用生产模式标识插件：`BUILD_MODE=prod pnpm build:prod`
4. 预览构建产物：`pnpm preview`（默认端口 `4173`）

## 主要脚本
- `pnpm dev`：安装依赖并启动 Vite 开发服务器
- `pnpm build`：安装依赖，清理临时目录，TypeScript 构建，打包产物
- `pnpm build:prod`：同上，并设置 `BUILD_MODE=prod` 以启用源码标识插件的生产模式
- `pnpm preview`：预览 `dist` 目录构建产物
- `pnpm lint`：运行 ESLint 进行代码检查
- `pnpm clean`：清理依赖与本地 pnpm 存储

脚本定义见 `package.json:6-13`。

## 目录结构概览
- 根目录
  - `src/` 前端源码
    - `App.tsx` 应用路由包装（`react-router-dom`）
    - `PrintTemplateManager.tsx` 主界面与页面路由、业务逻辑
    - `components/SimpleMonacoEditor.tsx` 内置 Monaco Editor 封装组件
    - `utils/storage.ts` 数据源持久化工具（`localStorage`）
    - `utils/templateStorage.ts` 模版与报表模版持久化工具
    - `types/` 类型定义
    - `main.tsx` 应用入口（挂载到 `#root`）
  - `index.html` HTML 入口
  - `vite.config.ts` Vite 配置、别名与插件
  - `tailwind.config.js`、`postcss.config.js` 样式工具链配置
  - `dist/` 构建输出目录（打包后生成）

关键入口参考：`src/main.tsx:6-10`、`src/App.tsx:6-12`。

## 运行说明
- 首次启动建议直接执行 `pnpm dev`，脚本已包含依赖安装逻辑
- 数据持久化存储键：
  - 数据源：`print_template_data_sources`（见 `src/utils/storage.ts:5`）
  - 业务模版：`print_template_templates`（见 `src/utils/templateStorage.ts:5`）
  - 报表模版：`print_template_report_templates`（见 `src/utils/templateStorage.ts:6`）
- 生产模式构建开关：环境变量 `BUILD_MODE=prod`（参见 `vite.config.ts:6-15`）

## 页面与交互
- 左侧菜单（Sider）：业务打印、报表打印、模版调用日志
- 业务打印模版管理
  - 搜索、分页、状态展示
  - 基本信息编辑（名称、模块、数据源）
  - 模版内容编辑与预览（HTML），变量示例：`${companyName}`、`${templateName}`、`${date}` 等
- 数据源管理
  - 分组/来源筛选、关键字搜索
  - 选择参数对象、设置别名、是否集合、拖拽排序
  - 启用/禁用切换

页面路由与主界面逻辑见 `src/PrintTemplateManager.tsx`。

## 常见问题
- 端口占用：更换端口可在启动命令后追加 `--port 5200`
- `localStorage` 清理：可在浏览器 DevTools 或编写清理方法（项目已提供工具函数）
- 构建失败：确保 Node.js 版本与 `pnpm` 版本兼容（建议 Node 18+）

## 开发约定
- 使用 TypeScript，保持类型完整
- 避免在代码中输出敏感信息
- 组件内保持无副作用的渲染逻辑，状态更新通过显式函数触发并持久化到 `localStorage`

## 许可证
本项目以学习与演示为目的，未附加开源许可证。如需商用或二次分发，请自行添加合适的许可证文件。
