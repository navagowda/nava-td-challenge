"use client";

import { PointerEvent, useMemo, useRef, useState } from "react";

export type DrawingTool =
  | "none"
  | "line"
  | "horizontal"
  | "rectangle"
  | "freehand"
  | "bos"
  | "choch"
  | "bullish-ob"
  | "bearish-ob"
  | "bullish-fvg"
  | "bearish-fvg"
  | "buy-liquidity"
  | "sell-liquidity"
  | "premium-discount";

export type Drawing =
  | { id: string; type: "line"; x1: number; y1: number; x2: number; y2: number }
  | { id: string; type: "horizontal"; y: number }
  | { id: string; type: "rectangle"; x1: number; y1: number; x2: number; y2: number }
  | { id: string; type: "freehand"; points: Array<{ x: number; y: number }> }
  | { id: string; type: "label"; x: number; y: number; label: "BOS" | "CHoCH" }
  | { id: string; type: "smc-box"; x1: number; y1: number; x2: number; y2: number; kind: "bullish-ob" | "bearish-ob" | "bullish-fvg" | "bearish-fvg" }
  | { id: string; type: "liquidity"; y: number; side: "buy" | "sell" }
  | { id: string; type: "premium-discount"; x1: number; y1: number; x2: number; y2: number };

interface Props {
  tool: DrawingTool;
  drawings: Drawing[];
  onChange: (drawings: Drawing[]) => void;
}

function id() {
  return `drawing-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function ChartDrawingOverlay({ tool, drawings, onChange }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [draft, setDraft] = useState<Drawing | null>(null);
  const allDrawings = useMemo(() => (draft ? [...drawings, draft] : drawings), [drawings, draft]);

  function point(event: PointerEvent<SVGSVGElement>) {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)),
      y: Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height)),
    };
  }

  function start(event: PointerEvent<SVGSVGElement>) {
    if (tool === "none") return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const p = point(event);
    if (tool === "line") setDraft({ id: id(), type: "line", x1: p.x, y1: p.y, x2: p.x, y2: p.y });
    if (tool === "horizontal") setDraft({ id: id(), type: "horizontal", y: p.y });
    if (tool === "rectangle") setDraft({ id: id(), type: "rectangle", x1: p.x, y1: p.y, x2: p.x, y2: p.y });
    if (tool === "freehand") setDraft({ id: id(), type: "freehand", points: [p] });
    if (tool === "bos" || tool === "choch") setDraft({ id: id(), type: "label", x: p.x, y: p.y, label: tool === "bos" ? "BOS" : "CHoCH" });
    if (["bullish-ob", "bearish-ob", "bullish-fvg", "bearish-fvg"].includes(tool)) {
      setDraft({ id: id(), type: "smc-box", x1: p.x, y1: p.y, x2: p.x, y2: p.y, kind: tool as "bullish-ob" | "bearish-ob" | "bullish-fvg" | "bearish-fvg" });
    }
    if (tool === "buy-liquidity" || tool === "sell-liquidity") {
      setDraft({ id: id(), type: "liquidity", y: p.y, side: tool === "buy-liquidity" ? "buy" : "sell" });
    }
    if (tool === "premium-discount") setDraft({ id: id(), type: "premium-discount", x1: p.x, y1: p.y, x2: p.x, y2: p.y });
  }

  function move(event: PointerEvent<SVGSVGElement>) {
    if (!draft || tool === "none") return;
    const p = point(event);
    setDraft((current) => {
      if (!current) return current;
      if (current.type === "line") return { ...current, x2: p.x, y2: p.y };
      if (current.type === "rectangle" || current.type === "smc-box" || current.type === "premium-discount") return { ...current, x2: p.x, y2: p.y };
      if (current.type === "horizontal" || current.type === "liquidity") return { ...current, y: p.y };
      if (current.type === "freehand") return { ...current, points: [...current.points, p] };
      return current;
    });
  }

  function end(event: PointerEvent<SVGSVGElement>) {
    if (!draft) return;
    try { event.currentTarget.releasePointerCapture(event.pointerId); } catch { /* already released */ }
    onChange([...drawings, draft]);
    setDraft(null);
  }

  const px = (value: number) => value * 100;

  return (
    <svg
      ref={svgRef}
      className={tool === "none" ? "pointer-events-none absolute inset-0 z-20 h-full w-full" : "absolute inset-0 z-20 h-full w-full cursor-crosshair touch-none"}
      onPointerDown={start}
      onPointerMove={move}
      onPointerUp={end}
      onPointerCancel={end}
      aria-label="NAVA saved drawing and Smart Money Concepts layer"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {allDrawings.map((drawing) => {
        if (drawing.type === "line") return <line key={drawing.id} x1={px(drawing.x1)} y1={px(drawing.y1)} x2={px(drawing.x2)} y2={px(drawing.y2)} stroke="#d4af37" strokeWidth="2" vectorEffect="non-scaling-stroke" />;
        if (drawing.type === "horizontal") return <line key={drawing.id} x1={0} y1={px(drawing.y)} x2={100} y2={px(drawing.y)} stroke="#d4af37" strokeWidth="2" strokeDasharray="8 5" vectorEffect="non-scaling-stroke" />;
        if (drawing.type === "rectangle") {
          const x = Math.min(drawing.x1, drawing.x2), y = Math.min(drawing.y1, drawing.y2);
          return <rect key={drawing.id} x={px(x)} y={px(y)} width={px(Math.abs(drawing.x2 - drawing.x1))} height={px(Math.abs(drawing.y2 - drawing.y1))} fill="rgba(212,175,55,0.10)" stroke="#d4af37" strokeWidth="2" vectorEffect="non-scaling-stroke" />;
        }
        if (drawing.type === "freehand") return <polyline key={drawing.id} points={drawing.points.map((p) => `${p.x * 100},${p.y * 100}`).join(" ")} fill="none" stroke="#d4af37" strokeWidth="2" vectorEffect="non-scaling-stroke" />;
        if (drawing.type === "label") {
          const color = drawing.label === "BOS" ? "#22c55e" : "#f59e0b";
          return <g key={drawing.id}><circle cx={px(drawing.x)} cy={px(drawing.y)} r="1.2" fill={color} vectorEffect="non-scaling-stroke" /><text x={px(drawing.x) + 1.8} y={px(drawing.y) - 1} fill={color} fontSize="3.2" fontWeight="700" style={{ paintOrder: "stroke", stroke: "#09090b", strokeWidth: 0.8 }}>{drawing.label}</text></g>;
        }
        if (drawing.type === "smc-box") {
          const x = Math.min(drawing.x1, drawing.x2), y = Math.min(drawing.y1, drawing.y2);
          const bullish = drawing.kind.startsWith("bullish");
          const fvg = drawing.kind.endsWith("fvg");
          const color = bullish ? "#22c55e" : "#ef4444";
          const label = `${bullish ? "Bullish" : "Bearish"} ${fvg ? "FVG" : "OB"}`;
          return <g key={drawing.id}><rect x={px(x)} y={px(y)} width={px(Math.abs(drawing.x2 - drawing.x1))} height={px(Math.abs(drawing.y2 - drawing.y1))} fill={bullish ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)"} stroke={color} strokeWidth="1.5" strokeDasharray={fvg ? "5 3" : undefined} vectorEffect="non-scaling-stroke" /><text x={px(x) + 1} y={px(y) + 3.2} fill={color} fontSize="2.6" fontWeight="700">{label}</text></g>;
        }
        if (drawing.type === "liquidity") {
          const color = drawing.side === "buy" ? "#38bdf8" : "#fb7185";
          const label = drawing.side === "buy" ? "BSL" : "SSL";
          return <g key={drawing.id}><line x1={0} y1={px(drawing.y)} x2={100} y2={px(drawing.y)} stroke={color} strokeWidth="1.5" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" /><text x={1.2} y={px(drawing.y) - 1} fill={color} fontSize="2.8" fontWeight="700">{label} · Liquidity</text></g>;
        }
        const x = Math.min(drawing.x1, drawing.x2), y = Math.min(drawing.y1, drawing.y2);
        const w = Math.abs(drawing.x2 - drawing.x1), h = Math.abs(drawing.y2 - drawing.y1), mid = y + h / 2;
        return <g key={drawing.id}><rect x={px(x)} y={px(y)} width={px(w)} height={px(h / 2)} fill="rgba(239,68,68,0.10)" stroke="#ef4444" strokeWidth="1" vectorEffect="non-scaling-stroke" /><rect x={px(x)} y={px(mid)} width={px(w)} height={px(h / 2)} fill="rgba(34,197,94,0.10)" stroke="#22c55e" strokeWidth="1" vectorEffect="non-scaling-stroke" /><line x1={px(x)} y1={px(mid)} x2={px(x + w)} y2={px(mid)} stroke="#d4af37" strokeDasharray="4 3" strokeWidth="1.5" vectorEffect="non-scaling-stroke" /><text x={px(x) + 1} y={px(y) + 3} fill="#ef4444" fontSize="2.6" fontWeight="700">PREMIUM</text><text x={px(x) + 1} y={px(mid) + 3} fill="#22c55e" fontSize="2.6" fontWeight="700">DISCOUNT</text><text x={px(x + w) - 10} y={px(mid) - 1} fill="#d4af37" fontSize="2.3">EQ 50%</text></g>;
      })}
    </svg>
  );
}
