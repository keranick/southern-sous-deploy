import { motion } from 'framer-motion';
import { useEffect, useState, type ReactNode } from 'react';

// Видимые веки: две чёрные шторки с кромкой (#2e2e2e).
// Кромка видна даже на чёрном фоне — открытие считывается до появления сцены.
export function Eye({
  mode,
  blinkOn,
  children,
}: {
  mode: 'opening' | 'open' | 'closing';
  blinkOn: boolean;
  children: ReactNode;
}) {
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    if (!blinkOn || mode !== 'open') return;
    let alive = true;
    let t1: number, t2: number;
    const loop = () => {
      // ponytail: рандом 4-9с, апгрейд — кривая внимания по циклам
      t1 = window.setTimeout(() => {
        if (!alive) return;
        setBlink(true);
        t2 = window.setTimeout(() => {
          if (!alive) return;
          setBlink(false);
          loop();
        }, 160 + Math.random() * 140);
      }, 4000 + Math.random() * 5000);
    };
    loop();
    return () => {
      alive = false;
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [blinkOn, mode]);

  const target = mode === 'open' ? (blink ? '9%' : '0%') : mode === 'opening' ? '0%' : '50%';
  const initial = mode === 'opening' ? '50%' : mode === 'closing' ? '0%' : '0%';
  const duration = mode === 'open' ? 0.16 : 1.4;

  return (
    <div className="scene-lock" style={{ background: '#000' }}>
      {children}
      <motion.div
        className="lid lid-top"
        initial={{ height: initial }}
        animate={{ height: target }}
        transition={{ duration, ease: 'easeInOut' }}
      />
      <motion.div
        className="lid lid-bottom"
        initial={{ height: initial }}
        animate={{ height: target }}
        transition={{ duration, ease: 'easeInOut' }}
      />
      {/* моргание: затемнение сверху/снизу + blur */}
      <motion.div
        animate={blink ? { scaleY: 1, opacity: 1 } : { scaleY: 0.06, opacity: 0 }}
        transition={{ duration: 0.18 }}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'linear-gradient(#000 0 12%, transparent 30%, transparent 70%, #000 88% 100%)',
          filter: 'blur(2px)',
          transformOrigin: 'center',
          zIndex: 35,
        }}
      />
    </div>
  );
}
