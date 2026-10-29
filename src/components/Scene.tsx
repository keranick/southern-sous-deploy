import { motion } from 'framer-motion';
import { CYCLE_HINTS } from '../game';
import type { FryState } from '../game';
import { usePointer } from '../hooks/usePointer';
import { Hand } from './Hand';

export function Scene({
  cycle,
  fry,
  searching,
  hasFries,
  onGrab,
  onDip,
  onEat,
}: {
  cycle: number;
  fry: FryState;
  searching: boolean;
  hasFries: boolean;
  onGrab: () => void;
  onDip: () => void;
  onEat: () => void;
}) {
  const { ref, x, y, pressed } = usePointer(true);
  const hint = !hasFries ? (searching ? 'ЕЩЁ?' : 'ещё?') : fry === 'idle' ? CYCLE_HINTS[cycle] ?? 'возьми' : fry === 'holding' ? 'макни' : 'съешь ↑';

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="scene-lock" style={{ cursor: 'none' }}>
      <img
        src="/assets/background/table.webp"
        alt=""
        draggable={false}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.75) contrast(1.05)' }}
      />

      {/* зона рта — верхняя полоса */}
      <button
        aria-label="съесть"
        onPointerDown={onEat}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '32%', background: 'transparent', border: 'none', zIndex: 20 }}
      />

      {/* тарелка: остаётся, пока по сюжету не закончится */}
      {hasFries && (
        <motion.button
          aria-label="взять картошку"
          onPointerDown={onGrab}
          animate={pressed && fry === 'idle' ? { scale: 0.96, rotate: -1 } : { scale: 1 }}
          style={{
            position: 'absolute', left: '8%', bottom: '14%', width: 'min(38vw, 260px)',
            background: 'none', border: 'none', padding: 24, zIndex: 20, cursor: 'none',
          }}
        >
          <img src="/assets/food/fries.webp" alt="картошка" draggable={false} style={{ width: '100%', filter: 'contrast(1.05)' }} />
        </motion.button>
      )}

      {/* соус */}
      <button
        aria-label="макнуть в соус"
        onPointerDown={onDip}
        style={{
          position: 'absolute', right: '6%', bottom: '12%', width: 'min(42vw, 280px)',
          background: 'none', border: 'none', padding: 24, zIndex: 20, cursor: 'none',
        }}
      >
        <motion.img
          src="/assets/food/sauce.webp"
          alt="соус"
          draggable={false}
          animate={fry === 'holding' ? { scale: [1, 1.04, 1] } : {}}
          transition={{ repeat: fry === 'holding' ? Infinity : 0, duration: 1.2 }}
          style={{ width: '100%' }}
        />
      </button>

      {/* подсказка */}
      <div className="hint" style={{ position: 'absolute', top: '20%', width: '100%', textAlign: 'center', zIndex: 20 }}>
        {hint}
      </div>

      {/* один кусок в руке */}
      {(fry === 'holding' || fry === 'dipped') && (
        <img
          src="/assets/food/fries-1pcs.webp"
          alt=""
          draggable={false}
          style={{
            position: 'absolute', left: x * window.innerWidth - 40, top: y * window.innerHeight - 110,
            width: 120, zIndex: 29, pointerEvents: 'none',
            filter: fry === 'dipped' ? 'hue-rotate(-25deg) saturate(1.6)' : 'none',
            transform: `rotate(${fry === 'dipped' ? -12 : 6}deg)`,
          }}
        />
      )}

      {/* поиск при пустой тарелке: рука бродит сама */}
      {searching ? (
        <motion.img
          src="/assets/hand/grab.webp"
          alt=""
          draggable={false}
          animate={{ x: [-60, 60, -30, 40, 0], y: [0, 24, -12, 10, 0], rotate: [0, -4, 3, -2, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', left: '38%', top: '44%', width: 280,
            imageRendering: 'pixelated', zIndex: 30, pointerEvents: 'none',
          }}
        />
      ) : (
        <Hand x={x} y={y} state={fry === 'eating' ? 'eating' : pressed ? 'grabbing' : fry === 'holding' ? 'holding' : fry === 'dipped' ? 'dipping' : 'idle'} visible />
      )}
    </div>
  );
}
