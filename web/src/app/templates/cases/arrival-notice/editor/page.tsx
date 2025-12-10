"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import TinyEditor from "@/components/TinyEditor";

function extractContent(html: string) {
  const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  const styles = styleMatch ? styleMatch[1] : "";
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const body = bodyMatch ? bodyMatch[1] : html;
  const combined = (styles ? `<style>${styles}</style>\n` : "") + body;
  return combined;
}

declare global { interface Window { Handlebars?: any } }

export default function ArrivalNoticeEditor() {
  const [initial, setInitial] = useState<string>("正在加载模板...");
  const [data, setData] = useState<any>(null);
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [api, setApi] = useState<{ getContent: () => string; setContent: (html: string) => void } | null>(null);

  useEffect(() => {
    (async () => {
      const [tplRes, dataRes] = await Promise.all([
        fetch("/cases/arrival-notice/template.html"),
        fetch("/cases/arrival-notice/data.json"),
      ]);
      const [tplHtml, json] = await Promise.all([tplRes.text(), dataRes.json()]);
      setInitial(extractContent(tplHtml));
      setData(json);
    })();
  }, []);

  const renderPreview = async () => {
    const html = api ? api.getContent() : initial;
    if (!html || !data) return;
    if (!window.Handlebars) {
      await new Promise<void>((resolve) => {
        const s = document.createElement("script");
        s.src = "/vendor/handlebars/4.7.8/handlebars.min.js";
        s.onload = () => resolve();
        document.body.appendChild(s);
      });
    }
    const hb = window.Handlebars!;
    hb.registerHelper("formatNumber", (num: any) => {
      if (num === null || num === undefined) return "";
      const n = Number(num);
      return isNaN(n) ? String(num) : n.toLocaleString("zh-CN", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
    });
    hb.registerHelper("getSpecialIdentity", (id: any) => (id ? String(id) : ""));
    const tpl = hb.compile(html);
    const out = tpl(data);
    setPreviewHtml(out);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">TinyMCE 编辑器加载示例模板</h1>
        <div className="flex items-center gap-2">
          <Link className="btn btn-outline" href="/templates/cases/arrival-notice">预览编译结果</Link>
          <Link className="btn btn-outline" href="/templates/cases">返回案例列表</Link>
        </div>
      </div>
      <section className="card p-4">
        <TinyEditor initial={initial} onReady={(editorApi) => setApi(editorApi)} />
        <div className="mt-3 flex justify-end">
          <button className="btn btn-primary" onClick={renderPreview}>预览渲染当前内容</button>
        </div>
      </section>
      {previewHtml && (
        <section className="card p-4">
          <h2 className="font-medium mb-3">渲染预览</h2>
          <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
        </section>
      )}
    </div>
  );
}
