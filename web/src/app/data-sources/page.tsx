"use client";
import { dataSources } from "@/data/mock";
import Link from "next/link";
import { Search, Plus } from "lucide-react";

export default function DataSourceListPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">数据源管理</h1>
        <div className="flex items-center gap-3">
          <div className="search">
            <Search className="icon w-4 h-4" />
            <input placeholder="搜索数据源名称" />
          </div>
          <Link href="/data-sources/edit" className="btn btn-primary">
            <Plus className="w-4 h-4" /> 新增
          </Link>
        </div>
      </div>
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>数据源名称</th>
              <th>业务模块</th>
              <th>来源综述</th>
              <th>更新时间</th>
              <th>最后更新人</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {dataSources.map((ds) => (
              <tr key={ds.id}>
                <td>{ds.name}</td>
                <td>{ds.module}</td>
                <td>{ds.origin}</td>
                <td>{ds.updatedAt}</td>
                <td>{ds.lastEditor}</td>
                <td>
                  <span className={`status ${ds.status === "启用" ? "status-enabled" : "status-disabled"}`}>{ds.status}</span>
                </td>
                <td>
                  <Link href={`/data-sources/edit?id=${ds.id}`} className="text-brand-700">编辑模板</Link>
                  <span className="mx-2 text-slate-300">|</span>
                  <button className="btn btn-danger">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
