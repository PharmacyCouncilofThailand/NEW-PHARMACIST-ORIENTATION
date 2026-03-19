"use client";

import { useCallback, useState, useEffect } from "react";
import ScrollReveal from "../scroll/ScrollReveal";
import { useLang } from "../../contexts/LangContext";

interface JobPoster {
  id: string;
  title: string;
  driveFileId: string;
}

// Proxy through our API route to bypass Google Drive cross-origin restrictions
function getDriveThumbnail(fileId: string): string {
  return `/api/drive-image?id=${fileId}`;
}

interface PosterCardProps {
  poster: JobPoster;
  onOpen: (poster: JobPoster) => void;
  index: number;
}

function PosterCard({ poster, onOpen, index }: PosterCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="group relative cursor-pointer rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-violet-200/30 transition-all duration-500 hover:-translate-y-2"
      onClick={() => onOpen(poster)}
      role="button"
      tabIndex={0}
      aria-label={`ดูโปสเตอร์ ${poster.title}`}
      onKeyDown={(e) => e.key === "Enter" && onOpen(poster)}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* รูปโปสเตอร์เต็มการ์ด — สัดส่วน 3:4 */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-slate-800">
        {imgError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-400 text-xs p-4 text-center">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>โหลดรูปไม่ได้</span>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={getDriveThumbnail(poster.driveFileId)}
            alt={poster.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300" />

        {/* ไอคอนแว่นขยาย */}
        {!imgError && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
            <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-md border border-white/50 flex items-center justify-center">
              <svg className="w-5 h-5 text-white drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface LightboxProps {
  poster: JobPoster | null;
  onClose: () => void;
}

function Lightbox({ poster, onClose }: LightboxProps) {
  const { t } = useLang();
  if (!poster) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={`โปสเตอร์ ${poster.title}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Lightbox content */}
      <div className="relative z-10 w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl bg-white animate-in fade-in zoom-in-90 duration-300">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-slate-100 bg-white shrink-0">
          <h2 className="font-bold text-slate-800 text-lg leading-tight">{poster.title}</h2>
          <div className="flex items-center gap-2 ml-4">
            {/* Open in Drive button */}
            <a
              href={`https://drive.google.com/file/d/${poster.driveFileId}/view`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors duration-200"
              aria-label={t("jobPosters.openDrive")}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 19H5V5h7V3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
              </svg>
              {t("jobPosters.openDrive")}
            </a>
            {/* Close button */}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors duration-200"
              aria-label={t("jobPosters.close")}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Image area */}
        <div className="relative flex-1 bg-slate-100 flex items-center justify-center p-4 sm:p-8 min-h-[400px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getDriveThumbnail(poster.driveFileId)}
            alt={poster.title}
            className="w-auto h-auto max-w-full max-h-[70vh] object-contain rounded-lg drop-shadow-xl"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}

// Loading skeleton
function PosterSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden">
      <div className="w-full aspect-[3/4] bg-slate-200 dark:bg-slate-700 animate-pulse rounded-2xl" />
    </div>
  );
}

export default function JobPostersSection() {
  const { t } = useLang();
  const [activePoster, setActivePoster] = useState<JobPoster | null>(null);
  const [posters, setPosters] = useState<JobPoster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/drive-folder")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          const mapped: JobPoster[] = (data.files || []).map(
            (f: { id: string; name: string }) => ({
              id: f.id,
              driveFileId: f.id,
              title: f.name.replace(/\.[^.]+$/, ""), // strip extension
            })
          );
          setPosters(mapped);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("ไม่สามารถโหลดโปสเตอร์ได้");
        setLoading(false);
      });
  }, []);

  const openLightbox = useCallback((poster: JobPoster) => {
    setActivePoster(poster);
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setActivePoster(null);
    document.body.style.overflow = "";
  }, []);

  return (
    <>
      <section
        id="job-posters"
        className="relative py-32 z-10 overflow-hidden"
      >
        {/* Background */}
        <div className="absolute inset-0 aurora-bg opacity-15 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-300/40 to-transparent" />

        {/* Floating decoration */}
        <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-gradient-to-br from-violet-200/20 to-blue-200/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-48 h-48 rounded-full bg-gradient-to-br from-blue-200/20 to-emerald-200/20 blur-3xl pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-6 relative z-10">
          {/* Section header */}
          <ScrollReveal variant="blur">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-8 text-center md:text-left">
              <div className="max-w-xl">
                <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-black leading-[0.9] tracking-tight text-slate-900 dark:text-white">
                  {t("jobPosters.title1")}
                  <br />
                  <span className="gradient-text-anim">{t("jobPosters.title2")}</span>
                </h2>
              </div>

              {/* Count badge */}
              <div className="shrink-0 text-right">
                <div className="inline-flex flex-col items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-500 to-blue-600 text-white shadow-xl shadow-violet-300/30">
                  <span className="text-3xl font-black leading-none">
                    {loading ? "·" : posters.length}
                  </span>
                  <span className="text-xs font-semibold opacity-80 mt-0.5">{t("jobPosters.count")}</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Error state */}
          {error && (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              <p className="text-sm">{error}</p>
              {error.includes("API_KEY") && (
                <p className="text-xs mt-2 opacity-60">กรุณาตั้งค่า GOOGLE_DRIVE_API_KEY ใน .env.local</p>
              )}
            </div>
          )}

          {/* Poster grid */}
          {!error && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-6">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <PosterSkeleton key={i} />
                  ))
                : posters.map((poster, index) => (
                    <ScrollReveal key={poster.id} variant="fade-up" delay={index * 80}>
                      <PosterCard poster={poster} onOpen={openLightbox} index={index} />
                    </ScrollReveal>
                  ))}
            </div>
          )}

          {/* Hint text */}
          {!loading && !error && posters.length > 0 && (
            <ScrollReveal variant="blur" delay={400}>
              <p className="text-center text-slate-400 text-sm mt-10 flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {t("jobPosters.hint")}
              </p>
            </ScrollReveal>
          )}
        </div>
      </section>

      {/* Lightbox overlay */}
      {activePoster && <Lightbox poster={activePoster} onClose={closeLightbox} />}
    </>
  );
}
