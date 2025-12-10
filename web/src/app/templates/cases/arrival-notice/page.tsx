"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

declare global { interface Window { Handlebars?: any } }

export default function ArrivalNoticeCase() {
  const [html, setHtml] = useState<string>("正在加载模板...");

  useEffect(() => {
    const load = async () => {
      const [tplRes, dataRes] = await Promise.all([
        fetch("/cases/arrival-notice/template.html"),
        fetch("/cases/arrival-notice/data.json"),
      ]);
      const [tpl, data] = await Promise.all([tplRes.text(), dataRes.json()]);

      const s = document.createElement("script");
      s.src = "/vendor/handlebars/4.7.8/handlebars.min.js";
      s.onload = () => {
        if (!window.Handlebars) return;
        const hb = window.Handlebars;
        hb.registerHelper("formatNumber", (num: any) => {
          if (num === null || num === undefined) return "";
          const n = Number(num);
          return isNaN(n) ? String(num) : n.toLocaleString("zh-CN", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
        });
        hb.registerHelper("getSpecialIdentity", (id: any) => (id ? String(id) : ""));
        const template = hb.compile(tpl);
        const out = template(data);
        setHtml(out);
      };
      document.body.appendChild(s);
      return () => { document.body.removeChild(s); };
    };
    load();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">模板案例预览：到货通知单</h1>
        <Link href="/templates/cases" className="btn btn-outline">返回列表</Link>
      </div>
      <div className="card p-4">
        <div className="mb-3 flex justify-end gap-2">
          <button className="btn btn-outline" onClick={() => window.print()}>打印</button>
        </div>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}
