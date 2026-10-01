"use client";

/**
 * RenderBackground — viewport 3D abstrata ao fundo.
 *
 * Canvas 2D puro (sem dependências): grid em perspectiva, árvore low-poly
 * em wireframe com revelação progressiva ("render pass"), partículas e
 * parallax sutil. Todo o desenho é discreto para nunca competir com o
 * conteúdo principal.
 */

import { useEffect, useRef } from "react";

const TAU = Math.PI * 2;
const ACCENT = { r: 77, g: 130, b: 255 }; // #4d82ff — azul da marca clareado para leitura no escuro
const ACCENT_DEEP = { r: 0, g: 56, b: 244 }; // #0038f4 — azul oficial do logo
const EDGE = { r: 176, g: 182, b: 196 };

interface Geo {
  verts: number[][];
  edges: [number, number][];
  faces: number[][];
}

/** Árvore low-poly estilizada (tronco + 3 camadas + copa). */
function buildTree(): Geo {
  const verts: number[][] = [];
  const edges: [number, number][] = [];
  const faces: number[][] = [];
  const SEG = 6;

  const pushRing = (y: number, r: number): number[] => {
    const start = verts.length;
    for (let i = 0; i < SEG; i++) {
      const a = (i / SEG) * TAU;
      verts.push([Math.cos(a) * r, y, Math.sin(a) * r]);
    }
    return Array.from({ length: SEG }, (_, i) => start + i);
  };

  const linkTier = (bottom: number[], top: number[]) => {
    for (let i = 0; i < SEG; i++) {
      const j = (i + 1) % SEG;
      edges.push([bottom[i], bottom[j]]);
      edges.push([bottom[i], top[i]]);
      faces.push([bottom[i], bottom[j], top[j], top[i]]);
    }
    for (let i = 0; i < SEG; i++) {
      const j = (i + 1) % SEG;
      edges.push([top[i], top[j]]);
    }
  };

  // Tronco (caixa de 4 lados)
  const trunkB: number[] = [];
  const trunkT: number[] = [];
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * TAU + Math.PI / 4;
    trunkB.push(verts.push([Math.cos(a) * 0.1, -1.06, Math.sin(a) * 0.1]) - 1);
    trunkT.push(verts.push([Math.cos(a) * 0.085, -0.8, Math.sin(a) * 0.085]) - 1);
  }
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4;
    edges.push([trunkB[i], trunkB[j]]);
    edges.push([trunkT[i], trunkT[j]]);
    edges.push([trunkB[i], trunkT[i]]);
    faces.push([trunkB[i], trunkB[j], trunkT[j], trunkT[i]]);
  }

  const t1b = pushRing(-0.8, 0.58);
  const t1t = pushRing(-0.36, 0.3);
  linkTier(t1b, t1t);

  const t2b = pushRing(-0.34, 0.44);
  const t2t = pushRing(0.04, 0.2);
  linkTier(t2b, t2t);

  const t3b = pushRing(0.06, 0.32);
  const t3t = pushRing(0.46, 0.1);
  linkTier(t3b, t3t);

  const apex = verts.push([0, 0.78, 0]) - 1;
  for (let i = 0; i < SEG; i++) {
    const j = (i + 1) % SEG;
    edges.push([t3t[i], apex]);
    faces.push([t3t[i], t3t[j], apex]);
  }

  return { verts, edges, faces };
}

const TREE = buildTree();

export function RenderBackground() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    let w = 0;
    let h = 0;
    let raf = 0;
    let last = performance.now();
    const par = { x: 0, y: 0, tx: 0, ty: 0 };

    type Particle = {
      x: number;
      y: number;
      r: number;
      ph: number;
      sp: number;
      acc: boolean;
    };
    let particles: Particle[] = [];

    const seedParticles = () => {
      const n = w < 640 ? 24 : 54;
      particles = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.5 + Math.random() * 1.1,
        ph: Math.random() * TAU,
        sp: 4 + Math.random() * 9,
        acc: Math.random() < 0.22,
      }));
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seedParticles();
      if (reduced) render(performance.now());
    };

    const rgba = (c: { r: number; g: number; b: number }, a: number) =>
      `rgba(${c.r},${c.g},${c.b},${a.toFixed(3)})`;

    const drawGrid = (t: number, px: number, py: number) => {
      const hy = h * 0.64 + py * 6;
      ctx.lineWidth = 1;

      // Linhas convergentes
      ctx.strokeStyle = rgba(EDGE, 0.05);
      ctx.beginPath();
      const vpx = w / 2 + px * 12;
      const spread = w * 1.7;
      const n = 15;
      for (let i = -n; i <= n; i++) {
        const xb = w / 2 + (i / n) * spread + px * 30;
        ctx.moveTo(vpx, hy);
        ctx.lineTo(xb, h + 60);
      }
      ctx.stroke();

      // Linhas horizontais com avanço extremamente lento
      const rows = 9;
      const f = ((t * 0.03) % 1 + 1) % 1;
      for (let j = 1; j <= rows; j++) {
        const nn = (j + f) / (rows + 1);
        const y = hy + (h + 60 - hy) * Math.pow(nn, 1.9);
        ctx.strokeStyle = rgba(EDGE, 0.015 + 0.05 * nn);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Brilho no horizonte
      const grad = ctx.createLinearGradient(w * 0.15, 0, w * 0.85, 0);
      grad.addColorStop(0, rgba(ACCENT, 0));
      grad.addColorStop(0.5, rgba(ACCENT, 0.1));
      grad.addColorStop(1, rgba(ACCENT, 0));
      ctx.strokeStyle = grad;
      ctx.beginPath();
      ctx.moveTo(0, hy + 0.5);
      ctx.lineTo(w, hy + 0.5);
      ctx.stroke();
    };

    const drawMarks = (px: number, py: number) => {
      const marks: [number, number][] = [
        [0.12, 0.2],
        [0.85, 0.16],
        [0.9, 0.62],
        [0.08, 0.7],
        [0.78, 0.86],
        [0.2, 0.42],
      ];
      ctx.strokeStyle = rgba(EDGE, 0.1);
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (const [mx, my] of marks) {
        const x = mx * w + px * 6;
        const y = my * h + py * 6;
        ctx.moveTo(x - 4, y);
        ctx.lineTo(x + 4, y);
        ctx.moveTo(x, y - 4);
        ctx.lineTo(x, y + 4);
      }
      ctx.stroke();
    };

    const drawTree = (t: number, px: number, py: number) => {
      const rotY = t * 0.1;
      const cY = Math.cos(rotY);
      const sY = Math.sin(rotY);
      const tilt = -0.09;
      const cX = Math.cos(tilt);
      const sX = Math.sin(tilt);
      const scale = Math.min(w, h) * (w < 640 ? 0.26 : 0.3);
      const cx = w * 0.5 - px * 16;
      const cy = h * 0.42 - py * 12;
      const fov = 3.4;

      const proj = TREE.verts.map(([x, y, z]) => {
        const rx = x * cY - z * sY;
        const rz = x * sY + z * cY;
        const ry = y * cX - rz * sX;
        const rz2 = y * sX + rz * cX;
        const p = fov / (fov + rz2);
        return { sx: cx + rx * p * scale, sy: cy - ry * p * scale, z: rz2, wy: y };
      });

      // Revelação progressiva: a "linha de render" sobe pelo objeto
      const SCAN_PERIOD = 26;
      const sp = ((((t % SCAN_PERIOD) + SCAN_PERIOD) % SCAN_PERIOD) / SCAN_PERIOD);
      const scanY = -1.15 + sp * 2.15;

      // Faces preenchidas acima da linha de render
      const order = TREE.faces
        .map((f) => ({ f, z: f.reduce((s, i) => s + proj[i].z, 0) / f.length }))
        .sort((a, b) => b.z - a.z);
      for (const { f } of order) {
        const avgY = f.reduce((s, i) => s + proj[i].wy, 0) / f.length;
        if (avgY <= scanY) continue;
        ctx.beginPath();
        ctx.moveTo(proj[f[0]].sx, proj[f[0]].sy);
        for (let k = 1; k < f.length; k++) ctx.lineTo(proj[f[k]].sx, proj[f[k]].sy);
        ctx.closePath();
        ctx.fillStyle = rgba(ACCENT_DEEP, 0.055);
        ctx.fill();
      }

      // Arestas
      ctx.lineWidth = 1;
      for (const [a, b] of TREE.edges) {
        const va = proj[a];
        const vb = proj[b];
        const depth =
          0.55 +
          0.45 * Math.min(1, Math.max(0, (fov - (va.z + vb.z) / 2) / (fov * 1.6)));
        const lit = va.wy > scanY && vb.wy > scanY;
        ctx.strokeStyle = lit ? rgba(ACCENT, 0.2 * depth) : rgba(EDGE, 0.1 * depth);
        ctx.beginPath();
        ctx.moveTo(va.sx, va.sy);
        ctx.lineTo(vb.sx, vb.sy);
        ctx.stroke();
      }

      // Vértices
      for (const v of proj) {
        ctx.fillStyle = v.wy > scanY ? rgba(ACCENT, 0.35) : rgba(EDGE, 0.16);
        ctx.beginPath();
        ctx.arc(v.sx, v.sy, 1, 0, TAU);
        ctx.fill();
      }

      // Linha de scan sobre o objeto
      if (sp > 0.005 && sp < 0.985) {
        const p0 = fov / (fov + scanY * sX);
        const sy = cy - scanY * cX * p0 * scale;
        const half = scale * 0.95;
        const grad = ctx.createLinearGradient(cx - half, 0, cx + half, 0);
        grad.addColorStop(0, rgba(ACCENT, 0));
        grad.addColorStop(0.5, rgba(ACCENT, 0.35));
        grad.addColorStop(1, rgba(ACCENT, 0));
        ctx.strokeStyle = grad;
        ctx.beginPath();
        ctx.moveTo(cx - half, sy);
        ctx.lineTo(cx + half, sy);
        ctx.stroke();
      }
    };

    const drawParticles = (t: number, dt: number, px: number, py: number) => {
      for (const p of particles) {
        p.y -= p.sp * dt;
        if (p.y < -8) {
          p.y = h + 8;
          p.x = Math.random() * w;
        }
        const tw = 0.5 + 0.5 * Math.sin(t * 0.7 + p.ph);
        const alpha = 0.05 + 0.22 * tw;
        ctx.fillStyle = p.acc ? rgba(ACCENT, alpha + 0.08) : rgba(EDGE, alpha);
        ctx.beginPath();
        ctx.arc(p.x + px * 5 * p.r, p.y + py * 4 * p.r, p.r, 0, TAU);
        ctx.fill();
      }
    };

    const render = (now: number) => {
      const t = now / 1000;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const autoX = coarse ? Math.sin(t * 0.09) * 0.5 : 0;
      const autoY = coarse ? Math.cos(t * 0.07) * 0.4 : 0;
      par.x += (par.tx + autoX - par.x) * 0.045;
      par.y += (par.ty + autoY - par.y) * 0.045;

      ctx.clearRect(0, 0, w, h);
      drawGrid(t, par.x, par.y);
      drawMarks(par.x, par.y);
      drawTree(t, par.x, par.y);
      drawParticles(t, dt, par.x, par.y);
    };

    const loop = (now: number) => {
      render(now);
      raf = requestAnimationFrame(loop);
    };

    const onMouse = (e: MouseEvent) => {
      par.tx = (e.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
      par.ty = (e.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
    };

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };

    resize();
    window.addEventListener("resize", resize);

    if (reduced) {
      render(performance.now());
    } else {
      window.addEventListener("mousemove", onMouse);
      document.addEventListener("visibilitychange", onVisibility);
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="fixed inset-0 z-0 h-full w-full"
    />
  );
}
