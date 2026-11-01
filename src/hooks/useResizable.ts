import { useState, useCallback, useEffect, useRef } from "react";

interface UseResizableProp {
  initialWidth: number;
  minWidth?: number;
  maxWidth?: number;
}

export function useResizable({ initialWidth, minWidth = 320, maxWidth = 1000 }: UseResizableProp) {
  const [width, setWidth] = useState<number>(initialWidth);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(initialWidth);

  const startResize = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      isDraggingRef.current = true;
      startXRef.current = event.clientX;
      startWidthRef.current = width;
      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";
    },
    [width],
  );

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dx = event.clientX - startXRef.current;
      const newWidth = startWidthRef.current - dx;
      setWidth(Math.max(minWidth, Math.min(newWidth, maxWidth)));
    };

    const handleMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [minWidth, maxWidth]);

  return { width, startResize };
}
