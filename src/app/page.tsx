"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { RenderBackground } from "@/components/render-background";
import { BRAND, SITE } from "@/lib/site-config";

const pad = (n: number, len: number) =>
  String(Math.max(0, Math.floor(n))).padStart(len, "0");

/** Monograma "th" oficial da marca (PNG transparente, azul do logo). */
function THMark({ className }: { className?: string }) {
  return (
    <Image
      src="/brand/th.png"
      alt=""
      aria-hidden="true"
      width={120}
      height={150}
      priority
      draggable={false}
      className={`select-none object-contain ${className ?? ""}`}
    />
  );
}

export default function Page() {
  const [progress, setProgress] = useState(7);
  const [phase, setPhase] = useState<"rendering" | "finalizing">("rendering");
  const [tick, setTick] = useState(0);

  /**
   * Simulação de renderização: velocidade variável, travas ocasionais
   * (como passes pesados de um render real) e reinício contínuo.
   */
  useEffect(() => {
    let p = 7 + Math.random() * 6;
    let rate = 0.9;
    let nextRateChange = 0;
    let stallUntil = 0;
    let finalizeAt: number | null = null;
    let last = performance.now();

    const id = setInterval(() => {
      const now = performance.now();
      const dt = Math.min(0.4, (now - last) / 1000);
      last = now;

      if (finalizeAt !== null) {
        if (now - finalizeAt > 2800) {
          finalizeAt = null;
          p = 1 + Math.random() * 4;
          setPhase("rendering");
        }
      } else {
        if (now > nextRateChange) {
          rate = 0.35 + Math.random() * 1.05;
          nextRateChange = now + 700 + Math.random() * 1600;
        }
        if (Math.random() < 0.02) {
          stallUntil = now + 600 + Math.random() * 1900;
        }
        if (now > stallUntil) {
          p += rate * dt;
          if (p >= 100) {
            p = 100;
            finalizeAt = now;
            setPhase("finalizing");
          }
        }
      }

      setProgress(p);
      setTick((t) => t + 1);
    }, 220);

    return () => clearInterval(id);
  }, []);

  const frame = Math.min(120, Math.floor((progress / 100) * 120));
  const pass = Math.min(6, 1 + Math.floor(progress / 17));
  const samples =
    phase === "finalizing" ? 4096 : 640 + Math.floor(progress * 33.4) + (tick % 4);
  const pct = Math.floor(progress);

  const stats: [string, string][] = [
    ["FRAME", `${pad(frame, 3)} / 120`],
    ["SAMPLES", `${samples}`],
    ["PASS", pad(pass, 2)],
  ];

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-[#05060a] text-[#e8e0d5]">
      {/* Viewport 3D ao fundo */}
      <RenderBackground />

      {/* Vinheta + textura de ruído */}
      <div className="th-vignette" aria-hidden="true" />
      <div className="th-noise" aria-hidden="true" />

      {/* Render scan ocasional */}
      <div className="th-scan" aria-hidden="true" />

      <div className="relative z-10 flex min-h-dvh flex-col">
        {/* ── HUD superior ─────────────────────────────────────────── */}
        <header
          className="th-fade th-sp-header flex items-center justify-between px-6 py-4 sm:px-10 sm:py-7"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex items-center gap-3">
            <THMark className="h-6 w-[18px] sm:h-7 sm:w-[21px]" />
            <span className="text-[11px] font-medium tracking-[0.42em] text-[#e8e0d5]/85 [margin-right:-0.42em]">
              TREEHOUSE STUDIO
            </span>
          </div>
          <div className="hidden text-right font-mono text-[10px] leading-relaxed tracking-[0.18em] sm:block">
            <p className="flex items-center justify-end gap-2 text-[#e8e0d5]/45">
              <span className="th-dot" />
              RENDERING
            </p>
            <p className="mt-1 text-[#e8e0d5]/25">SCENE // NEW_SITE_V2</p>
          </div>
        </header>

        {/* ── Composição central ───────────────────────────────────── */}
        <main className="th-sp-main flex flex-1 flex-col items-center justify-center px-6 py-8 text-center">
          {/* Monograma com alças de seleção (viewport) */}
          <div
            className="th-fade th-sp-mono relative p-4 sm:p-6"
            style={{ animationDelay: "0.25s" }}
          >
            <span
              aria-hidden="true"
              className="absolute left-0 top-0 h-2.5 w-2.5 border-l border-t border-[#4d82ff]/60"
            />
            <span
              aria-hidden="true"
              className="absolute right-0 top-0 h-2.5 w-2.5 border-r border-t border-[#4d82ff]/60"
            />
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-0 h-2.5 w-2.5 border-b border-l border-[#4d82ff]/60"
            />
            <span
              aria-hidden="true"
              className="absolute bottom-0 right-0 h-2.5 w-2.5 border-b border-r border-[#4d82ff]/60"
            />
            <THMark className="h-12 w-[37px] sm:h-14 sm:w-[43px]" />
          </div>

          <h1
            className="th-fade th-sp-title font-display mt-4 font-medium sm:mt-5"
            style={{ animationDelay: "0.4s" }}
          >
            <span className="block text-[30px] leading-tight tracking-[0.14em] text-[#e8e0d5] [margin-right:-0.14em] sm:text-4xl md:text-[46px]">
              TREEHOUSE
            </span>
            <span className="mt-2 block text-[30px] leading-tight tracking-[0.5em] text-[#e8e0d5]/40 [margin-right:-0.5em] sm:mt-3 sm:text-4xl md:text-[46px]">
              STUDIO
            </span>
          </h1>

          <p
            className="th-fade th-sp-tag mt-6 font-mono text-[11px] tracking-[0.34em] sm:text-xs [margin-right:-0.34em]"
            style={{ animationDelay: "0.55s", color: BRAND.blueSoft }}
          >
            NEW EXPERIENCE RENDERING
            <span className="th-caret" aria-hidden="true">
              _
            </span>
          </p>

          <p
            className="th-fade th-sp-desc mt-4 max-w-md text-[13px] leading-relaxed text-[#e8e0d5]/50 sm:text-[15px]"
            style={{ animationDelay: "0.7s" }}
          >
            Estamos renderizando uma nova experiência. Nosso novo site estará
            disponível em breve.
          </p>

          {/* Barra de progresso de renderização */}
          <div
            className="th-fade th-sp-progress mt-8 w-full max-w-xl sm:mt-12"
            style={{ animationDelay: "0.85s" }}
          >
            <div className="flex items-baseline justify-between font-mono text-[10px] tracking-[0.22em] sm:text-[11px]">
              <span
                className="transition-colors duration-500"
                style={{
                  color:
                    phase === "finalizing"
                      ? BRAND.blueSoft
                      : "rgba(232,224,213,0.55)",
                }}
              >
                {phase === "finalizing"
                  ? "FINALIZING COMPOSITE"
                  : "RENDERING NEW EXPERIENCE"}
              </span>
              <span className="tabular-nums text-[#e8e0d5]/90">{pct}%</span>
            </div>

            <div
              role="progressbar"
              aria-label="Renderização do novo site"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={pct}
              className="relative mt-3 h-[3px] w-full overflow-hidden rounded-full bg-white/10"
            >
              <div
                className="relative h-full rounded-full bg-gradient-to-r from-[#0038f4] via-[#1d4ed8] to-[#4d82ff] shadow-[0_0_14px_rgba(0,56,244,0.5)] transition-[width] duration-300 ease-linear"
                style={{ width: `${progress}%` }}
              >
                <span className="th-bar-head" aria-hidden="true" />
              </div>
              <span className="th-ticks" aria-hidden="true" />
            </div>

            {/* Indicadores técnicos compactos (mobile) */}
            <p className="mt-4 font-mono text-[10px] tracking-[0.14em] text-[#e8e0d5]/35 md:hidden">
              FRAME {pad(frame, 3)}/120 · SAMPLES {samples} · PASS {pad(pass, 2)}
            </p>
          </div>
        </main>

        {/* ── Contato ──────────────────────────────────────────────── */}
        <section
          className="th-fade px-6 pb-2"
          style={{ animationDelay: "1s" }}
          aria-labelledby="contact-heading"
        >
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-8 bg-[#e8e0d5]/15" aria-hidden="true" />
            <h2
              id="contact-heading"
              className="font-display text-[11px] font-medium tracking-[0.34em] text-[#e8e0d5]/70 [margin-right:-0.34em] sm:text-xs"
            >
              LET&apos;S CREATE SOMETHING
            </h2>
            <span className="h-px w-8 bg-[#e8e0d5]/15" aria-hidden="true" />
          </div>

          <p className="mx-auto mt-3 max-w-sm text-center text-[13px] leading-relaxed text-[#e8e0d5]/45">
            Enquanto o novo site não fica pronto, você pode falar conosco.
          </p>

          <div className="th-sp-links mt-6 flex flex-col items-center justify-center gap-y-5 sm:flex-row sm:gap-x-10">
            <a
              href={SITE.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group min-h-[44px] text-center"
            >
              <span className="block font-mono text-[9px] tracking-[0.3em] text-[#e8e0d5]/30">
                INSTAGRAM
              </span>
              <span className="mt-1 block text-sm text-[#e8e0d5]/85 decoration-[#4d82ff]/60 underline-offset-4 transition-colors duration-300 group-hover:text-[#4d82ff] group-hover:underline">
                {SITE.instagram.handle}
              </span>
            </a>

            <span
              className="hidden h-8 w-px bg-[#e8e0d5]/10 sm:block"
              aria-hidden="true"
            />

            <a
              href={`mailto:${SITE.email}`}
              className="group min-h-[44px] text-center"
            >
              <span className="block font-mono text-[9px] tracking-[0.3em] text-[#e8e0d5]/30">
                E-MAIL
              </span>
              <span className="mt-1 block text-sm text-[#e8e0d5]/85 decoration-[#4d82ff]/60 underline-offset-4 transition-colors duration-300 group-hover:text-[#4d82ff] group-hover:underline">
                {SITE.email}
              </span>
            </a>
          </div>

          <div className="th-sp-btn mt-7 flex justify-center">
            <a
              href={SITE.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-[44px] items-center gap-3 rounded-full border border-[#e8e0d5]/15 px-7 font-mono text-[10px] tracking-[0.28em] text-[#e8e0d5]/75 transition-all duration-300 hover:border-[#4d82ff]/60 hover:bg-[#0038f4]/10 hover:text-white"
            >
              VIEW INSTAGRAM
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1.5"
              >
                →
              </span>
            </a>
          </div>
        </section>

        {/* ── Rodapé / HUD inferior ────────────────────────────────── */}
        <footer
          className="th-fade th-sp-footer mt-auto px-6 pt-8 sm:px-10 sm:pt-12"
          style={{
            animationDelay: "1.15s",
            paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))",
          }}
        >
          <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-[1fr_auto_1fr]">
            {/* Estatísticas técnicas (desktop) */}
            <div className="hidden space-y-1.5 font-mono text-[10px] tracking-[0.18em] md:block">
              {stats.map(([label, value]) => (
                <div key={label} className="flex gap-3">
                  <span className="w-[76px] text-[#e8e0d5]/30">{label}</span>
                  <span className="tabular-nums text-[#e8e0d5]/70">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* Copyright central */}
            <div className="text-center">
              <p className="text-[11px] tracking-[0.08em] text-[#e8e0d5]/45">
                © 2026 TreeHouse Studio
              </p>
              <p className="mt-1.5 text-[10px] tracking-[0.14em] text-[#e8e0d5]/25">
                3D Visualization • CGI • ArchViz
              </p>
            </div>

            {/* Engine / ETA (desktop) */}
            <div className="hidden text-right font-mono text-[10px] tracking-[0.18em] md:block">
              <p className="flex items-center justify-end gap-2 text-[#e8e0d5]/55">
                <span className="th-dot" />
                GPU / CPU PROCESSING
              </p>
              <p className="mt-1.5 text-[#e8e0d5]/30">
                ESTIMATED TIME:{" "}
                <span className="text-[#4d82ff]/90">SOON</span>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
