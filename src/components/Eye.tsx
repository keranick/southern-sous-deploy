import { motion } from 'framer-motion';
import { useEffect, useState, type ReactNode } from 'react';

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
    if (!blinkOn || mode !== 'open') {
      setBlink(false);
      return;
    }
    let alive = true;
    let closeTimer = 0;
    let openTimer = 0;
    const loop = () => {
      // ponytail: рандом 4-9с, апгрейд — кривая внимания по циклам
      closeTimer = window.setTimeout(() => {
        if (!alive) return;
        setBlink(true);
        openTimer = window.setTimeout(() => {
          if (!alive) return;
          setBlink(false);
          loop();
        }, 160 + Math.random() * 140);
      }, 4000 + Math.random() * 5000);
    };
    loop();
    return () => {
      alive = false;
      clearTimeout(closeTimer);
      clearTimeout(openTimer);
    };
  }, [blinkOn, mode]);

  const closed = mode === 'closing' || (mode === 'open' && blink);
  const target = closed ? 1 : 0;
  const initial = mode === 'opening' ? 1 : 0;
  const duration = mode === 'opening' || mode === 'closing' ? 1.4 : blink ? 0.1 : 0.15;
  const transition = { duration, ease: 'easeInOut' as const };

  return (
    <div className="scene-lock" style={{ background: '#000' }}>
      {children}
      <motion.div
        className="lid lid-top"
        initial={{ scaleY: initial }}
        animate={{ scaleY: target }}
        transition={transition}
      />
      <motion.div
        className="lid lid-bottom"
        initial={{ scaleY: initial }}
        animate={{ scaleY: target }}
        transition={transition}
      />
    </div>
  );
}
