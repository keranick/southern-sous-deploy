import { useCallback, useEffect, useRef, useState } from 'react';
import { PREVIEW_TRACKS, previewTrackLabel } from '../config';

export function usePreviewPlayer(active: boolean, muted: boolean) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startedRef = useRef(false);
  const mutedRef = useRef(muted);
  mutedRef.current = muted;
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const track = PREVIEW_TRACKS[index];
    if (!active || !track) return;

    const audio = new Audio(track.url);
    audio.preload = 'auto';
    audio.muted = mutedRef.current;
    audioRef.current = audio;

    const onPlay = () => {
      setPlaying(true);
      setBlocked(false);
    };
    const onPause = () => setPlaying(false);
    const onEnded = () => setIndex((i) => (i + 1) % PREVIEW_TRACKS.length);

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    if (startedRef.current) {
      audio.play().catch(() => {
        if (audioRef.current === audio) setBlocked(true);
      });
    }

    return () => {
      audioRef.current = null;
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.pause();
      setPlaying(false);
    };
  }, [active, index]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
  }, [muted, index, active]);

  const play = useCallback(() => {
    startedRef.current = true;
    audioRef.current?.play().catch(() => setBlocked(true));
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().catch(() => setBlocked(true));
    else audio.pause();
  }, []);

  const step = useCallback((delta: number) => {
    setIndex((i) => (i + delta + PREVIEW_TRACKS.length) % PREVIEW_TRACKS.length);
  }, []);

  const prev = useCallback(() => step(-1), [step]);
  const next = useCallback(() => step(1), [step]);
  const reset = useCallback(() => {
    startedRef.current = false;
    setIndex(0);
  }, []);

  return {
    label: PREVIEW_TRACKS[index] ? previewTrackLabel(PREVIEW_TRACKS[index].name) : '',
    playing,
    blocked,
    play,
    toggle,
    prev,
    next,
    reset,
  };
}
