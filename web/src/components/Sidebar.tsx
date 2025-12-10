"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderKanban, Database, ListChecks } from "lucide-react";

const items = [
  { href: "/templates", label: "打印模板管理", icon: FolderKanban },
  { href: "/data-sources", label: "数据源管理", icon: Database },
  { href: "/tasks", label: "项目任务", icon: ListChecks },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="text-lg font-semibold text-white">打印模版管理平台</div>
        <div className="text-xs text-white/60">Business styled demo</div>
      </div>
      <nav className="p-3 space-y-1">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} className={`nav-item ${active ? "nav-item-active" : ""}`}>
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
