"use client";

import { useMemo, useRef, useState } from "react";
import { Pause, Play, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

type MusicTurntableProps = {
  src?: string;
  title: string;
  locale: "zh" | "en";
};

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export function MusicTurntable({ src, title, locale }: MusicTurntableProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(false);

  const hasTrack = Boolean(src);

  const percent = useMemo(() => {
    if (!duration) return 0;
    return (currentTime / duration) * 100;
  }, [currentTime, duration]);

  async function togglePlay() {
    if (!hasTrack || !audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }
    try {
      await audioRef.current.play();
      setIsPlaying(true);
      setError(false);
    } catch {
      setError(true);
      setIsPlaying(false);
    }
  }

  return (
    <div className="glass-card border-white/45 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-5 text-slate-100 dark:border-white/15">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime || 0)}
        onEnded={() => setIsPlaying(false)}
        onError={() => {
          setError(true);
          setIsPlaying(false);
        }}
      />

      <div className="grid gap-4 sm:grid-cols-[200px_1fr] sm:items-center">
        <button
          type="button"
          onClick={togglePlay}
          className="group relative mx-auto flex h-44 w-44 items-center justify-center rounded-full border border-white/30 bg-slate-950/80 transition-transform duration-300 hover:scale-[1.02]"
          aria-label={
            isPlaying
              ? locale === "zh"
                ? "暂停"
                : "Pause"
              : locale === "zh"
                ? "播放"
                : "Play"
          }
        >
          <div
            className={cn(
              "vinyl-disc h-36 w-36",
              isPlaying && "vinyl-spin",
            )}
          />
          <div className="absolute flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/85 text-slate-200 shadow-lg">
            {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
          </div>
        </button>

        <div className="space-y-3">
          <p className="text-sm text-slate-300">
            {locale === "zh" ? "音乐组件" : "Music Component"}
          </p>
          <h4 className="text-lg font-semibold">{title}</h4>
          <div className="relative h-2 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-200"
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <p className="inline-flex items-center gap-2 text-xs text-slate-300/90">
            <Volume2 className="size-3.5" />
            {hasTrack
              ? locale === "zh"
                ? "点击黑胶开始播放"
                : "Tap the vinyl to play"
              : locale === "zh"
                ? "请在 content/people 中配置音乐文件"
                : "Configure track in content/people"}
          </p>
          {error && (
            <p className="text-xs text-amber-300">
              {locale === "zh"
                ? "音频加载失败，请确认音乐文件路径是否存在。"
                : "Failed to load audio. Please verify the track path."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
