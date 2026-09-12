import { useEffect, useState } from 'react';

const FILES = [
  '/assets/hand/idle.png',
  '/assets/hand/grab.png',
  '/assets/hand/dip.png',
  '/assets/hand/eat.png',
  '/assets/food/fries.png',
  '/assets/food/fries-1pcs.png',
  '/assets/food/sauce.png',
  '/assets/background/table.png',
  '/assets/release/cover.jpg',
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
