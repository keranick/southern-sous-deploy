import { useEffect, useState } from 'react';

const FILES = [
  '/assets/hand/idle.webp',
  '/assets/hand/grab.webp',
  '/assets/hand/dip.webp',
  '/assets/hand/eat.webp',
  '/assets/food/fries.webp',
  '/assets/food/fries-1pcs.webp',
  '/assets/food/sauce.webp',
  '/assets/background/table.webp',
  '/assets/release/cover.webp',
  '/assets/logo/logo.webp',
];

export function usePreload() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    let n = 0;
    if (FILES.length === 0) setDone(true);
    FILES.forEach((src) => {
      const img = new Image();
      img.onload = img.onerror = () => {
        n += 1;
        if (n >= FILES.length) setDone(true);
      };
      img.src = src;
    });
    // Страховка: не висим дольше 6с на медленной сети
    const t = setTimeout(() => setDone(true), 6000);
    return () => clearTimeout(t);
  }, []);
  return done;
}
