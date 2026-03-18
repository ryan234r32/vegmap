"use client";

import { useRef, useState, useCallback, useEffect } from "react";

type SheetPosition = "peek" | "half" | "full";

export type { SheetPosition };

interface BottomSheetProps {
  children: React.ReactNode;
  peekContent?: React.ReactNode;
  peekHeight?: number;
  className?: string;
  onPositionChange?: (position: SheetPosition) => void;
  onDismiss?: () => void;
  resetKey?: string;
}

const DEFAULT_PEEK_HEIGHT = 180;
const HALF_RATIO = 0.5;
const FULL_RATIO = 0.92;
const VELOCITY_THRESHOLD = 0.3;

export function BottomSheet({
  children,
  peekContent,
  peekHeight = DEFAULT_PEEK_HEIGHT,
  className = "",
  onPositionChange,
  onDismiss,
  resetKey,
}: BottomSheetProps) {
  const [position, setPosition] = useState<SheetPosition>("peek");
  const [translateY, setTranslateY] = useState(0);
  const [viewportH, setViewportH] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const prevResetKey = useRef(resetKey);
  const sheetRef = useRef<HTMLDivElement>(null);

  const drag = useRef({
    active: false,
    startY: 0,
    startTranslate: 0,
    currentY: 0,
    startTime: 0,
    lastY: 0,
  });

  useEffect(() => {
    const update = () => setViewportH(window.innerHeight);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Reset to peek when resetKey changes (e.g. switching list↔detail)
  useEffect(() => {
    if (resetKey !== prevResetKey.current) {
      prevResetKey.current = resetKey;
      setPosition("peek");
    }
  }, [resetKey]);

  const getTargetY = useCallback(
    (pos: SheetPosition) => {
      if (!viewportH) return 0;
      switch (pos) {
        case "peek":
          return viewportH - peekHeight;
        case "half":
          return viewportH * (1 - HALF_RATIO);
        case "full":
          return viewportH * (1 - FULL_RATIO);
      }
    },
    [viewportH, peekHeight]
  );

  // Snap to position when not dragging
  useEffect(() => {
    if (!isDragging) {
      setTranslateY(getTargetY(position));
    }
    onPositionChange?.(position);
  }, [position, getTargetY, onPositionChange, isDragging]);

  // --- Pointer-based drag (unified touch + mouse) ---
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      drag.current = {
        active: true,
        startY: e.clientY,
        startTranslate: translateY,
        currentY: e.clientY,
        startTime: Date.now(),
        lastY: translateY,
      };
      setIsDragging(true);
    },
    [translateY]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!drag.current.active) return;
      drag.current.currentY = e.clientY;
      const diff = e.clientY - drag.current.startY;
      const newY = Math.max(
        getTargetY("full"),
        Math.min(viewportH - 40, drag.current.startTranslate + diff)
      );
      // Write directly to DOM — skip React re-render during drag
      drag.current.lastY = newY;
      if (sheetRef.current) {
        sheetRef.current.style.transform = `translateY(${newY}px)`;
      }
    },
    [getTargetY, viewportH]
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      const d = drag.current;
      if (!d.active) return;
      d.active = false;
      setIsDragging(false);

      const totalMove = Math.abs(d.currentY - d.startY);

      // Tap → toggle peek↔half
      if (totalMove < 5) {
        setPosition((prev) => (prev === "peek" ? "half" : "peek"));
        return;
      }

      // Flick detection
      const elapsed = Date.now() - d.startTime;
      const velocity = elapsed > 0 ? (d.currentY - d.startY) / elapsed : 0;

      // Flick down from peek → dismiss (return to list mode)
      if (velocity > VELOCITY_THRESHOLD && position === "peek" && onDismiss) {
        onDismiss();
        return;
      }

      if (Math.abs(velocity) > VELOCITY_THRESHOLD) {
        if (velocity > 0) {
          setPosition((prev) => (prev === "full" ? "half" : "peek"));
        } else {
          setPosition((prev) => (prev === "peek" ? "half" : "full"));
        }
        return;
      }

      // Snap to nearest — use lastY from drag ref (not React state)
      const currentY = d.lastY;

      // Dragged below peek → dismiss
      if (currentY > getTargetY("peek") + 50 && onDismiss) {
        onDismiss();
        return;
      }

      const positions: { pos: SheetPosition; y: number }[] = [
        { pos: "peek", y: getTargetY("peek") },
        { pos: "half", y: getTargetY("half") },
        { pos: "full", y: getTargetY("full") },
      ];
      positions.sort(
        (a, b) => Math.abs(currentY - a.y) - Math.abs(currentY - b.y)
      );
      setPosition(positions[0].pos);
    },
    [getTargetY, viewportH, position, onDismiss]
  );

  if (!viewportH) return null;

  return (
    <div
      ref={sheetRef}
      className="fixed left-0 right-0 z-40"
      style={{
        transform: `translateY(${translateY}px)`,
        transition: isDragging
          ? "none"
          : "transform 300ms cubic-bezier(0.4, 0, 0.2, 1)",
        height: `${viewportH}px`,
        top: 0,
        pointerEvents: "none",
        willChange: "transform",
      }}
    >
      {/* Inner content — only this area receives pointer events */}
      <div
        className={`bg-background rounded-t-2xl shadow-[0_-2px_8px_rgba(0,0,0,0.1)] h-full ${className}`}
        style={{ pointerEvents: "auto", contain: "layout style paint" }}
      >
        {/* Drag Handle — 46px touch target */}
        <div
          className="touch-none select-none cursor-grab active:cursor-grabbing"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          <div className="flex justify-center py-5">
            <div className="w-10 h-1.5 rounded-full bg-muted-foreground/30" />
          </div>
        </div>

        {/* Peek Content */}
        {peekContent && (
          <div className="px-4 pb-3">{peekContent}</div>
        )}

        {/* Scrollable Content */}
        <div
          className="overflow-y-auto px-4 pb-safe overscroll-contain"
          style={{
            height: `calc(100% - ${peekHeight}px)`,
            WebkitOverflowScrolling: "touch",
            contentVisibility: "auto",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
