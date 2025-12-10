import "./globals.css";
import { Inter } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import { Menu } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "打印模版管理演示平台",
  description: "基于 Next.js + Tailwind + shadcn 风格的商务化前端演示",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <div className="min-h-screen flex bg-slate-100">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="topbar">
              <div className="flex items-center gap-2">
                <Menu className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-700">菜单</span>
              </div>
              <div className="text-sm text-slate-500">系统管理员</div>
            </div>
            <div className="bg-white rounded-xl shadow-card border border-slate-200 p-4">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
