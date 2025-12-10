"use client";
import { useEffect, useState } from "react";

declare global {
  interface Window { tinymce?: any }
}
type TinyEditorProps = {
  initial?: string;
  onChange?: (html: string) => void;
  onReady?: (api: { getContent: () => string; setContent: (html: string) => void; insertContent: (html: string) => void }) => void;
};

export default function TinyEditor({ initial, onChange, onReady }: TinyEditorProps) {
  const [editorId, setEditorId] = useState<string>("");

  useEffect(() => {
    const id = `editor-${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
    setEditorId(id);
    const loadScript = (srcs: string[], cb: () => void) => {
      const [src, ...rest] = srcs;
      const s = document.createElement("script");
      s.src = src;
      s.onload = cb;
      s.onerror = () => {
        if (rest.length) loadScript(rest, cb);
      };
      document.body.appendChild(s);
      return s;
    };

    const cleanupScripts: HTMLScriptElement[] = [];
    const localVendors = [
      "/vendor/tinymce/4.7.13/tinymce.min.js",
      "/vendor/tinymce/4.7.0/tinymce.min.js",
    ];
    const cdnVendors = [
      "https://cdn.jsdelivr.net/npm/tinymce@4.7.13/tinymce.min.js",
      "https://cdn.jsdelivr.net/npm/tinymce@4.7.0/tinymce.min.js",
      "https://unpkg.com/tinymce@4.7.13/tinymce.min.js",
      "https://unpkg.com/tinymce@4.7.0/tinymce.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/tinymce/4.7.13/tinymce.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/tinymce/4.7.0/tinymce.min.js",
    ];
    const script = loadScript([...localVendors, ...cdnVendors], () => {
      if (!window.tinymce) return;
      const loadedLocal = !!document.querySelector('script[src*="/vendor/tinymce/"]');
      if (loadedLocal) {
        // 默认本地 4.7.13 目录
        (window.tinymce as any).suffix = ".min";
        (window.tinymce as any).baseURL = "/vendor/tinymce/4.7.13";
      }
      window.tinymce.init({
        selector: `#${id}`,
        height: 520,
        menubar: true,
        plugins: "table lists advlist",
        toolbar:
          "undo redo | styleselect | bold italic underline | alignleft aligncenter alignright | bullist numlist | table",
        setup: (ed: any) => {
          ed.on("init", () => {
            if (initial) ed.setContent(initial);
            if (onReady) {
              onReady({
                getContent: () => ed.getContent(),
                setContent: (html: string) => ed.setContent(html),
                insertContent: (html: string) => ed.insertContent(html),
              });
            }
          });
          ed.on("keyup", () => onChange && onChange(ed.getContent()));
          ed.on("change", () => onChange && onChange(ed.getContent()));
        },
      });
    });
    cleanupScripts.push(script);
    return () => {
      if (window.tinymce) {
        const ed = window.tinymce.get(id);
        if (ed) ed.remove();
      }
      cleanupScripts.forEach((el) => el.parentNode && el.parentNode.removeChild(el));
    };
  }, [initial]);

  if (!editorId) return <div className="text-sm text-slate-500">编辑器初始化中...</div>;
  return <textarea id={editorId} />;
}
