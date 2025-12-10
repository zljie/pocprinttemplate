export default function HomePage() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">打印模板概览</h1>
        <a className="btn btn-primary" href="/templates">进入模板管理</a>
      </header>
      <section className="card p-4">
        <h2 className="font-medium mb-3">项目说明</h2>
        <p className="text-sm text-slate-600">
          本项目为纯前端演示，采用 React 18 + Next.js + TailwindCSS，UI 风格遵循商务化、稳重的视觉规范。
        </p>
        <ul className="mt-3 list-disc list-inside text-sm text-slate-700">
          <li>数据源管理：支持搜索、筛选、排序、分页、状态切换、批量操作。</li>
          <li>模板管理：支持新建/，关联数据源与纸张规格。</li>
          <li>模板设计：内置 TinyMCE v4.7 编辑器进行富文本排版。</li>
        </ul>
      </section>
    </div>
  );
}
