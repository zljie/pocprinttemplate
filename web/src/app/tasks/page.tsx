"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

function mdToHtml(md: string) {
  const lines = md.split(/\r?\n/);
  let html = "";
  let inList = false;
  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (inList) { html += "</ul>"; inList = false; }
      html += `<h2 class="text-lg font-semibold mb-2">${line.slice(3)}</h2>`;
      continue;
    }
    if (line.startsWith("- ")) {
      if (!inList) { html += "<ul class=\"list-disc pl-5 space-y-1\">"; inList = true; }
      html += `<li>${line.slice(2)}</li>`;
      continue;
    }
    if (line.startsWith("# ")) {
      if (inList) { html += "</ul>"; inList = false; }
      html += `<h1 class="text-xl font-bold mb-3">${line.slice(2)}</h1>`;
      continue;
    }
    if (!line.trim()) {
      continue;
    }
    html += `<p>${line}</p>`;
  }
  if (inList) html += "</ul>";
  return html;
}

export default function TasksPage() {
  const [content, setContent] = useState<string>("正在加载任务...");
  useEffect(() => {
    (async () => {
      const res = await fetch("/tasks.md");
      const md = await res.text();
      setContent(mdToHtml(md));
    })();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">项目任务</h1>
        <Link href="/templates" className="btn btn-outline">返回打印模板管理</Link>
      </div>
      <section className="card p-4">
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
      </section>
    </div>
  );
}
