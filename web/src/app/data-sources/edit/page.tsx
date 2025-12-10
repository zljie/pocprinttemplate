"use client";
import { useMemo, useState } from "react";
import { paramObjects } from "@/data/mock";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import Link from "next/link";
import { Search } from "lucide-react";

type SelectedItem = { id: string; alias: string; isCollection: boolean };

export default function DataSourceEditPage() {
  const [dsName, setDsName] = useState<string>("");
  const [dsModule, setDsModule] = useState<string>("采购模块");
  const [groupFilter, setGroupFilter] = useState<string>("全部分组");
  const [originFilter, setOriginFilter] = useState<string>("全部来源");
  const [keyword, setKeyword] = useState("");
  const [selected, setSelected] = useState<SelectedItem[]>([
    { id: "po", alias: "po", isCollection: true },
    { id: "pr", alias: "pr", isCollection: false },
    { id: "materialInfo", alias: "materialInfo", isCollection: true },
  ]);

  const list = useMemo(() => {
    return paramObjects.filter((o) => {
      const groupOk = groupFilter === "全部分组" || o.group === groupFilter;
      const originOk = originFilter === "全部来源" || o.origin === originFilter;
      const kw = keyword.trim().toLowerCase();
      const kwOk = !kw || o.code.toLowerCase().includes(kw) || o.name.toLowerCase().includes(kw);
      return groupOk && originOk && kwOk;
    });
  }, [groupFilter, originFilter, keyword]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const from = result.source.index;
    const to = result.destination.index;
    setSelected((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  const toggleCollection = (id: string) => {
    setSelected((prev) => prev.map((it) => (it.id === id ? { ...it, isCollection: !it.isCollection } : it)));
  };

  const removeSelected = (id: string) => setSelected((prev) => prev.filter((it) => it.id !== id));

  const setAlias = (id: string, alias: string) => setSelected((prev) => prev.map((it) => (it.id === id ? { ...it, alias } : it)));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">编辑数据源</h1>
        <Link href="/data-sources" className="btn btn-outline">返回列表</Link>
      </div>

      {/* 基础信息表单 */}
      <section className="card p-4">
        <h2 className="font-medium mb-3">基础信息</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-[160px_1fr] items-center gap-4">
            <label>数据源名称</label>
            <input className="input" value={dsName} onChange={(e) => setDsName(e.target.value)} placeholder="请输入" />
          </div>
          <div className="grid grid-cols-[160px_1fr] items-center gap-4">
            <label>业务模块</label>
            <select className="select" value={dsModule} onChange={(e) => setDsModule(e.target.value)}>
              {["采购模块","销售模块","库存模块","财务模块","人力资源"].map(v => <option key={v}>{v}</option>)}
            </select>
          </div>
        </div>
      </section>

      <div className="space-y-4">
        {/* 参数对象选择区 */}
        <section className="card p-4">
          <h2 className="font-medium mb-3">参数对象筛选</h2>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <select className="select" value={groupFilter} onChange={(e) => setGroupFilter(e.target.value)}>
              {[
                "全部分组",
                "采购管理",
                "销售管理",
                "库存管理",
                "财务管理",
                "人力资源",
              ].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
            <select className="select" value={originFilter} onChange={(e) => setOriginFilter(e.target.value)}>
              {["全部来源", "ERP标准产品", "CRM系统", "财务系统", "第三方集成"].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
            <div className="input-suffix">
              <input placeholder="请输入编码或名称" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
              <Search className="suffix w-4 h-4" />
            </div>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>序号</th>
                <th>所属分组</th>
                <th>编码</th>
                <th>名称</th>
                <th>来源</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {list.map((o, idx) => {
                const added = selected.some((it) => it.id === o.id);
                return (
                  <tr key={o.id}>
                    <td>{idx + 1}</td>
                    <td>{o.group}</td>
                    <td>{o.code}</td>
                    <td>{o.name}</td>
                    <td>{o.origin}</td>
                    <td>
                      <button className="btn btn-outline" onClick={() => !added && setSelected((prev) => [...prev, { id: o.id, alias: o.id, isCollection: false }])} disabled={added}>
                        选择
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        {/* 已选参数对象配置区 */}
        <section className="card p-4">
          <h2 className="font-medium mb-3">已选参数对象</h2>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="selected-list">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>参数对象名称</th>
                        <th>编码</th>
                        <th>是否集合</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selected.map((it, idx) => {
                        const obj = paramObjects.find((p) => p.id === it.id)!;
                        return (
                          <Draggable key={it.id} draggableId={it.id} index={idx}>
                            {(drag) => (
                              <tr ref={drag.innerRef} {...drag.draggableProps} {...drag.dragHandleProps}>
                                <td>{obj.name}</td>
                                <td>
                                  <input className="input" value={it.alias} onChange={(e) => setAlias(it.id, e.target.value)} />
                                </td>
                                <td>
                                  <label className="inline-flex items-center gap-2">
                                    <input type="checkbox" checked={it.isCollection} onChange={() => toggleCollection(it.id)} />
                                    <span>{it.isCollection ? "是" : "否"}</span>
                                  </label>
                                </td>
                                <td>
                                  <button className="text-brand-700" onClick={() => removeSelected(it.id)}>
                                    移除
                                  </button>
                                </td>
                              </tr>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </tbody>
                  </table>
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </section>
      </div>

      {/* 对象详情编辑器（暂时隐藏） */}
      <section className="card p-4 hidden">
        <h2 className="font-medium mb-3">对象详情</h2>
      </section>
    </div>
  );
}
