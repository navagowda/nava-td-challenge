"use client";

import { PointerEvent, useMemo, useRef, useState } from "react";

export type DrawingTool = "none" | "line" | "horizontal" | "rectangle" | "freehand";

export type Drawing =
  | { id: string; type: "line"; x1: number; y1: number; x2: number; y2: number }
  | { id: string; type: "horizontal"; y: number }
  | { id: string; type: "rectangle"; x1: number; y1: number; x2: number; y2: number }
  | { id: string; type: "freehand"; points: Array<{ x: number; y: number }> };

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
  }

  function move(event: PointerEvent<SVGSVGElement>) {
    if (!draft || tool === "none") return;
    const p = point(event);
    setDraft((current) => {
      if (!current) return current;
      if (current.type === "line") return { ...current, x2: p.x, y2: p.y };
      if (current.type === "rectangle") return { ...current, x2: p.x, y2: p.y };
      if (current.type === "horizontal") return { ...current, y: p.y };
      return { ...current, points: [...current.points, p] };
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
      aria-label="NAVA saved drawing layer"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {allDrawings.map((drawing) => {
        if (drawing.type === "line") {
          return <line key={drawing.id} x1={px(drawing.x1)} y1={px(drawing.y1)} x2={px(drawing.x2)} y2={px(drawing.y2)} stroke="currentColor" strokeWidth="2" className="text-gold" vectorEffect="non-scaling-stroke" />;
        }
        if (drawing.type === "horizontal") {
          return <line key={drawing.id} x1={0} y1={px(drawing.y)} x2={100} y2={px(drawing.y)} stroke="currentColor" strokeWidth="2" strokeDasharray="8 5" className="text-gold" vectorEffect="non-scaling-stroke" />;
        }
        if (drawing.type === "rectangle") {
          const x = Math.min(drawing.x1, drawing.x2);
          const y = Math.min(drawing.y1, drawing.y2);
          const width = Math.abs(drawing.x2 - drawing.x1);
          const height = Math.abs(drawing.y2 - drawing.y1);
          return <rect key={drawing.id} x={px(x)} y={px(y)} width={px(width)} height={px(height)} fill="rgba(212,175,55,0.10)" stroke="currentColor" strokeWidth="2" className="text-gold" vectorEffect="non-scaling-stroke" />;
        }
        const points = drawing.points.map((p) => `${p.x * 100},${p.y * 100}`).join(" ");
        return <polyline key={drawing.id} points={points} fill="none" stroke="currentColor" strokeWidth="2" className="text-gold" vectorEffect="non-scaling-stroke" transform="scale(1)" />;
      })}
    </svg>
  );
}
