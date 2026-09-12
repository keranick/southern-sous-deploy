import { useEffect, useRef, useState } from 'react';

// Нормализованные координаты 0..1, одна система для mouse + touch.
export function usePointer(active: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (!active) return;
    const el = ref.current ?? window;
    const move = (e: PointerEvent) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      // Клиентские координаты -> 0..1 (сцена на весь экран)
      setPos({
        x: Math.min(1, Math.max(0, e.clientX / w)),
        y: Math.min(1, Math.max(0, e.clientY / h)),
      });
    };
    const down = (e: PointerEvent) => {
      setPressed(true);
      move(e);
    };
    const up = () => setPressed(false);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', down, { passive: true });
    window.addEventListener('pointerup', up, { passive: true });
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
    };
  }, [active]);

  return { ref, ...pos, pressed };
}
