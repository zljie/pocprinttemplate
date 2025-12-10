"use client";
import { templates } from "@/data/mock";
import { useState } from "react";
import Link from "next/link";

import { Search, Plus } from "lucide-react";

export default function TemplateListPage() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    code: "",
    module: "采购模块",
    dataSource: "采购订单+物料信息",
    paper: "A4 - 竖纸张",
    marginPreset: "标准边距",
    margin: { top: 20, right: 15, bottom: 20, left: 15 },
  });

  const submit = () => {
    setOpen(false);
    alert(`已新建模板: ${form.name || "未命名"}\n纸张边距: 上${form.margin.top}mm 右${form.margin.right}mm 下${form.margin.bottom}mm 左${form.margin.left}mm`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">打印模板管理</h1>
        <div className="flex items-center gap-3">
          <div className="search">
            <Search className="icon w-4 h-4" />
            <input placeholder="搜索模板名称" />
          </div>
          <button className="btn btn-primary" onClick={() => setOpen(true)}>
            <Plus className="w-4 h-4" /> 新增
          </button>
        </div>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>模板名称</th>
              <th>模板编码</th>
              <th>业务模块</th>
              <th>数据源</th>
              <th>打印纸制式</th>
              <th>更新时间</th>
              <th>最后更新人</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((t) => (
              <tr key={t.id}>
                <td>{t.name}</td>
                <td>{t.code}</td>
                <td>{t.module}</td>
                <td>{t.dataSourceName}</td>
                <td>{t.paper}</td>
                <td>{t.updatedAt}</td>
                <td>{t.lastEditor}</td>
                <td>
                  <span className={`status ${t.status === "启用" ? "status-enabled" : "status-disabled"}`}>{t.status}</span>
                </td>
                <td>
                  <Link className="text-brand-700" href="/templates/design">编辑模板</Link>
                  <span className="mx-2 text-slate-300">|</span>
                  <button className="btn btn-danger">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="card w-[560px] p-6">
            <h2 className="text-lg font-medium mb-4">新建打印模板</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-[160px_1fr] items-center gap-4">
                <label>打印模版名称</label>
                <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="请输入" />
              </div>
              <div className="grid grid-cols-[160px_1fr] items-center gap-4">
                <label>打印模版编码</label>
                <input className="input" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="请输入" />
              </div>
              <div className="grid grid-cols-[160px_1fr] items-center gap-4">
                <label>业务模块</label>
                <select className="select" value={form.module} onChange={(e) => setForm({ ...form, module: e.target.value })}>
                  {['采购模块','销售模块','库存模块','财务模块','人力资源'].map(v=> <option key={v}>{v}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-[160px_1fr] items-center gap-4">
                <label>数据源</label>
                <select className="select" value={form.dataSource} onChange={(e) => setForm({ ...form, dataSource: e.target.value })}>
                  {['采购订单+物料信息','采购申请单','销售订单'].map(v=> <option key={v}>{v}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-[160px_1fr] items-center gap-4">
                <label>打印纸制式</label>
                <select className="select" value={form.paper} onChange={(e) => setForm({ ...form, paper: e.target.value })}>
                  {['A4 - 竖纸张','A4 - 横纸张','A5 - 竖纸张'].map(v=> <option key={v}>{v}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-[160px_1fr] items-start gap-4">
                <label>纸张边距</label>
                <div className="space-y-3">
                  <select
                    className="select"
                    value={form.marginPreset}
                    onChange={(e) => {
                      const v = e.target.value;
                      const presets: Record<string, { top: number; right: number; bottom: number; left: number }> = {
                        标准边距: { top: 20, right: 15, bottom: 20, left: 15 },
                        窄边距: { top: 10, right: 10, bottom: 10, left: 10 },
                      };
                      setForm({ ...form, marginPreset: v, margin: presets[v] });
                    }}
                  >
                    {['标准边距','窄边距'].map(v=> <option key={v}>{v}</option>)}
                  </select>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="field-col">
                      <div className="field-label">上</div>
                      <div className="input-suffix">
                        <input type="number" value={form.margin.top}
                          onChange={(e) => setForm({ ...form, margin: { ...form.margin, top: Number(e.target.value) } })} />
                        <span className="suffix">mm</span>
                      </div>
                    </div>
                    <div className="field-col">
                      <div className="field-label">右</div>
                      <div className="input-suffix">
                        <input type="number" value={form.margin.right}
                          onChange={(e) => setForm({ ...form, margin: { ...form.margin, right: Number(e.target.value) } })} />
                        <span className="suffix">mm</span>
                      </div>
                    </div>
                    <div className="field-col">
                      <div className="field-label">下</div>
                      <div className="input-suffix">
                        <input type="number" value={form.margin.bottom}
                          onChange={(e) => setForm({ ...form, margin: { ...form.margin, bottom: Number(e.target.value) } })} />
                        <span className="suffix">mm</span>
                      </div>
                    </div>
                    <div className="field-col">
                      <div className="field-label">左</div>
                      <div className="input-suffix">
                        <input type="number" value={form.margin.left}
                          onChange={(e) => setForm({ ...form, margin: { ...form.margin, left: Number(e.target.value) } })} />
                        <span className="suffix">mm</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button className="btn btn-outline" onClick={() => setOpen(false)}>取消</button>
                <button className="btn btn-primary" onClick={submit}>确定</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
