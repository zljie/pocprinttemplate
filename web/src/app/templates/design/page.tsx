"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import TinyEditor from "@/components/TinyEditor";

declare global { interface Window { Handlebars?: any } }

function extractContent(html: string) {
  const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  const styles = styleMatch ? styleMatch[1] : "";
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const body = bodyMatch ? bodyMatch[1] : html;
  const combined = (styles ? `<style>${styles}</style>\n` : "") + body;
  return combined;
}

export default function DesignPage() {
  const [initial, setInitial] = useState<string>("正在加载模板...");
  const [data, setData] = useState<any>(null);
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [api, setApi] = useState<{ getContent: () => string; setContent: (html: string) => void; insertContent: (html: string) => void } | null>(null);
  const [fieldCategory, setFieldCategory] = useState<"header" | "detail" | "summary">("header");
  const [showJsonModal, setShowJsonModal] = useState<boolean>(false);
  const [jsonText, setJsonText] = useState<string>("");
  const [jsonError, setJsonError] = useState<string>("");

  useEffect(() => {
    (async () => {
      const [tplRes, dataRes] = await Promise.all([
        fetch("/cases/arrival-notice/template.html"),
        fetch("/cases/arrival-notice/data.json"),
      ]);
      const [tplHtml, json] = await Promise.all([tplRes.text(), dataRes.json()]);
      setInitial(extractContent(tplHtml));
      setData(json);
      try { setJsonText(JSON.stringify(json, null, 2)); } catch {}
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

  const openCasesPreview = () => {
    setJsonError("");
    setShowJsonModal(true);
  };

  const submitPreviewJson = () => {
    try {
      const parsed = JSON.parse(jsonText || "{}");
      sessionStorage.setItem("previewData", JSON.stringify(parsed));
      const tpl = api ? api.getContent() : initial;
      if (tpl) sessionStorage.setItem("previewTemplate", tpl);
      setShowJsonModal(false);
      window.location.href = "/templates/cases/arrival-notice";
    } catch (e: any) {
      setJsonError(String(e?.message || e));
    }
  };

  const tokens = () => {
    if (!data) return [] as Array<{ label: string; token: string }>;
    if (fieldCategory === "header") {
      return Object.keys(data.header || {}).map((k) => ({ label: k, token: `{{header.${k}}}` }));
    }
    if (fieldCategory === "summary") {
      return Object.keys(data.summary || {}).map((k) => ({ label: k, token: `{{summary.${k}}}` }));
    }
    const first = (data.tables?.EMM_ArrivalNoticeDetail?.records || [])[0] || {};
    return Object.keys(first).map((k) => ({ label: k, token: `{{this.${k}}}` }));
  };

  const insertToken = (t: string) => {
    if (!api) return;
    api.insertContent(t);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">模板设计（到货通知单示例）</h1>
        <Link href="/templates" className="btn btn-outline">返回列表</Link>
      </div>
      <div className="grid grid-cols-[1fr_360px] gap-4">
        <section className="card p-4">
          <TinyEditor initial={initial} onReady={(editorApi) => setApi(editorApi)} />
          <div className="mt-3 flex justify-end gap-2">
            <button className="btn btn-outline" onClick={() => alert("已保存到本地存储")}>保存</button>
            <button className="btn btn-primary" onClick={openCasesPreview}>预览渲染当前内容</button>
          </div>
          {previewHtml && (
            <div className="mt-4">
              <h2 className="font-medium mb-3">渲染预览</h2>
              <div className="mb-3 flex justify-end gap-2">
                <button className="btn btn-outline" onClick={() => window.print()}>打印</button>
              </div>
              <div className="card p-4">
                <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
              </div>
            </div>
          )}
        </section>
        <aside className="card p-4">
          <h2 className="font-medium mb-3">数据源字段</h2>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button className={`btn ${fieldCategory === "header" ? "btn-primary" : "btn-outline"}`} onClick={() => setFieldCategory("header")}>表头 header</button>
            <button className={`btn ${fieldCategory === "summary" ? "btn-primary" : "btn-outline"}`} onClick={() => setFieldCategory("summary")}>汇总 summary</button>
            <button className={`btn ${fieldCategory === "detail" ? "btn-primary" : "btn-outline"}`} onClick={() => setFieldCategory("detail")}>明细 detail</button>
          </div>
          <div className="text-xs text-slate-500 mb-2">
            明细字段建议在 each 循环内使用：
            <code className="mx-1">{`{{#each tables.EMM_ArrivalNoticeDetail.records}}`}</code>
            ...
            <code className="mx-1">{`{{/each}}`}</code>
          </div>
          <ul className="space-y-2 max-h-[520px] overflow-auto">
            {tokens().map((f) => (
              <li key={f.token} className="flex items-center gap-2">
                <span className="flex-1 truncate" title={f.token}>{f.label}</span>
                <button className="btn btn-outline" onClick={() => insertToken(f.token)}>插入</button>
                <button className="btn btn-outline" onClick={() => navigator.clipboard.writeText(f.token)}>复制</button>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      {showJsonModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card p-4 w-[800px] max-w-[95vw] bg-white">
            <h2 className="font-medium mb-3">提交预览数据（JSON）</h2>
            <div className="text-xs text-slate-500 mb-2">默认已填充示例数据，需符合模板字段结构</div>
            <textarea className="w-full h-80 border rounded p-2 font-mono text-xs" value={jsonText} onChange={(e) => setJsonText(e.target.value)} />
            {jsonError && <div className="text-red-600 text-xs mt-2">{jsonError}</div>}
            <div className="mt-3 flex justify-end gap-2">
              <button className="btn btn-outline" onClick={() => setShowJsonModal(false)}>取消</button>
              <button className="btn btn-primary" onClick={submitPreviewJson}>提交并预览</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
