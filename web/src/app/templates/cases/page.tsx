"use client";
import Link from "next/link";

export default function CasesPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">模板案例</h1>
      </div>
      <div className="card p-4">
        <table className="table">
          <thead>
            <tr>
              <th>案例名称</th>
              <th>描述</th>
              <th>数据源</th>
              <th>纸制式</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>到货通知单（A4 横向）</td>
              <td>包含表头/条码/供应商信息/明细表/汇总/签名</td>
              <td>EMM_ArrivalNoticeDetail + Collect</td>
              <td>A4 横向</td>
              <td className="space-x-3">
                <Link className="text-brand-700" href="/templates/cases/arrival-notice">预览</Link>
                <Link className="text-brand-700" href="/templates/cases/arrival-notice/editor">在编辑器打开</Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
