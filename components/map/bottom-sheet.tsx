"use client";

import { useRef, useState, useCallback, useEffect } from "react";

type SheetPosition = "peek" | "half" | "full";

export type { SheetPosition };

interface BottomSheetProps {
  children: React.ReactNode;
  peekContent?: React.ReactNode;
  className?: string;
  onPositionChange?: (position: SheetPosition) => void;
}

const PEEK_HEIGHT = 140;
const HALF_RATIO = 0.5;
const FULL_RATIO = 0.92;

export function BottomSheet({ children, peekContent, className = "", onPositionChange }: BottomSheetProps) {
  const [position, setPosition] = useState<SheetPosition>("peek");
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ startY: 0, startTranslate: 0, dragging: false });
  const [translateY, setTranslateY] = useState(0);
  const [viewportH, setViewportH] = useState(0);

  useEffect(() => {
    const update = () => setViewportH(window.innerHeight);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const getTargetY = useCallback(
    (pos: SheetPosition) => {
      if (!viewportH) return 0;
      switch (pos) {
        case "peek":
          return viewportH - PEEK_HEIGHT;
        case "half":
          return viewportH * (1 - HALF_RATIO);
        case "full":
          return viewportH * (1 - FULL_RATIO);
      }
    },
    [viewportH]
  );

  // Snap to position and notify parent
  useEffect(() => {
    setTranslateY(getTargetY(position));
    onPositionChange?.(position);
  }, [position, getTargetY, onPositionChange]);

  const handleTouchStart = (e: React.TouchEvent) => {
    dragRef.current = {
      startY: e.touches[0].clientY,
      startTranslate: translateY,
      dragging: true,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragRef.current.dragging) return;
    const diff = e.touches[0].clientY - dragRef.current.startY;
    const newY = Math.max(
      getTargetY("full"),
      Math.min(viewportH - 60, dragRef.current.startTranslate + diff)
    );
    setTranslateY(newY);
  };

  const handleTouchEnd = () => {
    if (!dragRef.current.dragging) return;
    dragRef.current.dragging = false;

    // Snap to nearest position
    const peekY = getTargetY("peek");
    const halfY = getTargetY("half");
    const fullY = getTargetY("full");

    const distances = [
      { pos: "peek" as const, d: Math.abs(translateY - peekY) },
      { pos: "half" as const, d: Math.abs(translateY - halfY) },
      { pos: "full" as const, d: Math.abs(translateY - fullY) },
    ];
    distances.sort((a, b) => a.d - b.d);
    setPosition(distances[0].pos);
  };

  if (!viewportH) return null;

  return (
    <div
      ref={sheetRef}
      className={`fixed left-0 right-0 bg-background rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.15)] z-40 ${className}`}
      style={{
        transform: `translateY(${translateY}px)`,
        transition: dragRef.current.dragging ? "none" : "transform 300ms cubic-bezier(0.4, 0, 0.2, 1)",
        height: `${viewportH}px`,
        top: 0,
      }}
    >
      {/* Drag Handle */}
      <div
        className="flex justify-center pt-2 pb-3 cursor-grab active:cursor-grabbing touch-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => setPosition(position === "peek" ? "half" : "peek")}
      >
        <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
      </div>

      {/* Peek Content (always visible) */}
      {peekContent && <div className="px-4 pb-2">{peekContent}</div>}

      {/* Scrollable Content */}
      <div
        className="overflow-y-auto px-4 pb-safe"
        style={{ height: `calc(100% - ${PEEK_HEIGHT}px)` }}
      >
        {children}
      </div>
    </div>
  );
}
