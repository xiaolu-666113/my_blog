import Link from "next/link";
import { ArrowUpRight, Network, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Locale } from "@/lib/i18n/locales";

export function FeaturedTutorialCard({ locale }: { locale: Locale }) {
  return (
    <Link
      href={`/${locale}/projects/security-course-map`}
      className="group relative overflow-hidden rounded-2xl border border-violet-300/60 bg-[linear-gradient(135deg,#4c1d95,#7c3aed_48%,#a855f7)] p-5 text-white shadow-[0_22px_55px_rgba(88,28,135,0.26)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(88,28,135,0.34)]"
    >
      <div className="absolute right-0 top-0 h-28 w-28 bg-white/10 blur-2xl" />
      <div className="relative flex min-h-[250px] flex-col justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-white text-violet-800">
              <Sparkles className="size-3.5" />
              Featured Tutorial
            </Badge>
            <Badge variant="outline" className="border-white/35 text-white">
              交互式图谱
            </Badge>
          </div>
          <div className="mt-6 flex items-start gap-4">
            <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/14">
              <Network className="size-7" />
            </span>
            <div>
              <h2 className="text-2xl font-semibold leading-tight">计算机安全课程知识图谱</h2>
              <p className="mt-2 text-sm leading-6 text-violet-50/86">
                第18章：权限提升与 Shellcode。支持拖拽、缩放、搜索、节点详情和课程目录，适合复习 Linux 权限、汇编、系统调用、栈与 Shellcode 防御。
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-white/18 pt-4 text-sm font-medium">
          <span>打开学习图谱</span>
          <span className="inline-flex size-9 items-center justify-center rounded-full bg-white text-violet-800 transition group-hover:translate-x-1">
            <ArrowUpRight className="size-5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
