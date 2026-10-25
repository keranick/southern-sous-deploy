import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect } from 'react';
import type { FryState } from '../game';

const IMG: Record<string, string> = {
  idle: '/assets/hand/idle.webp',
  grabbing: '/assets/hand/grab.webp',
  holding: '/assets/hand/grab.webp',
  dipping: '/assets/hand/dip.webp',
  eating: '/assets/hand/eat.webp',
};

export function Hand({
  x,
  y,
  state,
  visible,
}: {
  x: number;
  y: number;
  state: FryState | 'grabbing' | 'dipping' | 'eating';
  visible: boolean;
}) {
  const mx = useMotionValue(x * window.innerWidth);
  const my = useMotionValue(y * window.innerHeight);
  // Лёгкое запаздывание = ощущение живой руки, не курсора
  const sx = useSpring(mx, { stiffness: 260, damping: 26 });
  const sy = useSpring(my, { stiffness: 260, damping: 26 });

  useEffect(() => {
    mx.set(x * window.innerWidth);
    my.set(y * window.innerHeight);
  }, [x, y, mx, my]);

  const src = IMG[state] ?? IMG.idle;

  return (
    <motion.img
      src={src}
      alt=""
      draggable={false}
      aria-hidden
      style={{
        x: sx,
        y: sy,
        position: 'absolute',
        left: -90,
        top: -40,
        width: 300,
        pointerEvents: 'none',
        opacity: visible ? 1 : 0,
        imageRendering: 'pixelated',
        filter: 'contrast(1.08) saturate(0.92)',
        zIndex: 30,
      }}
    />
  );
}
