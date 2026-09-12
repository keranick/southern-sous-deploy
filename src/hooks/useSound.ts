import { useCallback, useEffect, useRef, useState } from 'react';
import { Howl, Howler } from 'howler';

type Name = 'click' | 'grab' | 'dip' | 'eat';

// Эмбиент — вне Howler: его луп/рестарт плодил визг и наложения.
// Один Audio-синглтон на модуль: второй инстанс создать не может никто.
let ambientEl: HTMLAudioElement | null = null;
let ambientStarted = false;

export function useSound(enabled: boolean) {
  const refs = useRef<Record<Name, Howl | null>>({
    click: null,
    grab: null,
    dip: null,
    eat: null,
  });
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const mk = (src: string, volume = 0.5) => new Howl({ src: [src], volume });
    refs.current = {
      click: mk('/assets/sounds/click.wav', 0.4),
      grab: mk('/assets/sounds/grab.wav', 0.5),
      dip: mk('/assets/sounds/dip.wav', 0.55),
      eat: mk('/assets/sounds/eat.wav', 0.55),
    };

    if (!ambientEl) ambientEl = new Audio('/assets/sounds/ambient.wav');
    const el = ambientEl;
    el.preload = 'auto';
    const onEnded = () => {
      try {
        el.currentTime = 0;
        el.play().catch(() => {});
      } catch {
        /* noop */
      }
    };
    el.addEventListener('ended', onEnded);
    let fadeTimer = 0;
    if (!ambientStarted) {
      ambientStarted = true;
      el.volume = 0;
      try {
        el.currentTime = 0;
      } catch {
        /* noop */
      }
      el.play()
        .then(() => {
          const t0 = performance.now();
          fadeTimer = window.setInterval(() => {
            const k = Math.min(1, (performance.now() - t0) / 2500);
            el.volume = 0.12 * k;
            if (k >= 1) window.clearInterval(fadeTimer);
          }, 100);
        })
        .catch(() => {
          ambientStarted = false;
        });
    }
    return () => {
      el.removeEventListener('ended', onEnded);
      window.clearInterval(fadeTimer);
    };
  }, [enabled]);

  useEffect(() => {
    Howler.mute(muted);
    if (ambientEl) ambientEl.muted = muted;
  }, [muted]);

  const play = useCallback((n: Name) => {
    refs.current[n]?.play();
  }, []);

  return { play, muted, toggleMute: () => setMuted((m) => !m) };
}
