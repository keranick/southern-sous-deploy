import { useCallback, useEffect, useRef, useState } from 'react';
import { TOTAL_CYCLES, type FryState, type Phase } from './game';
import { usePreload } from './hooks/usePreload';
import { useSound } from './hooks/useSound';
import { Intro } from './components/Intro';
import { Eye } from './components/Eye';
import { Scene } from './components/Scene';
import { Final } from './components/Final';
import { usePreviewPlayer } from './hooks/usePreviewPlayer';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function App() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [cycle, setCycle] = useState(0);
  const [fry, setFry] = useState<FryState>('idle');
  const [line, setLine] = useState('');
  const [entered, setEntered] = useState(false);
  const alive = useRef(true);
  const preloaded = usePreload();
  const { play, muted, toggleMute } = useSound(entered);
  const preview = usePreviewPlayer(
    phase === 'play' || phase === 'reveal' || phase === 'release',
    muted,
  );

  useEffect(() => {
    alive.current = true;
    return () => { alive.current = false; };
  }, []);

  const enter = useCallback(() => {
    setEntered(true);
    setTimeout(() => play('click'), 50);
    setPhase('eye-opening');
    // Раскрытие глаз ~1.4с: не ждём лишнего, иначе клики по картошке глотаются
    setTimeout(() => { if (alive.current) setPhase('table'); }, 1500);
  }, [play]);

  const runEnding = useCallback(async () => {
    setPhase('no-fries');
    await sleep(2000); if (!alive.current) return;
    setPhase('realization'); setLine('картошка кончилась.');
    await sleep(1800); if (!alive.current) return;
    setLine('а соус остался.');
    await sleep(1600); if (!alive.current) return;
    setPhase('eye-closing');
    await sleep(1600); if (!alive.current) return;
    setPhase('whisper'); setLine('ты тоже не смог остановиться');
    await sleep(1400); if (!alive.current) return;
    for (let i = 0; i < 3; i++) { setLine('ещё.'); await sleep(900); if (!alive.current) return; }
    setLine('');
    setPhase('play');
  }, []);

  const startReveal = useCallback(async () => {
    setPhase('reveal'); setLine('ЮЖНЫЙ СОУС');
    await sleep(1200); if (!alive.current) return;
    setLine('ЮЖНЫЙ СОУС / ЭМО КОММЬЮНИТИ');
    setPhase('release');
  }, []);

  const grab = useCallback(() => {
    if (phase !== 'table' || fry !== 'idle') return;
    play('grab');
    setFry('holding');
  }, [phase, fry, play]);

  const dip = useCallback(() => {
    if (phase !== 'table' || fry !== 'holding') return;
    play('dip');
    setFry('dipped');
  }, [phase, fry, play]);

  const eat = useCallback(async () => {
    if (phase !== 'table' || fry !== 'dipped') return;
    play('eat');
    setFry('eating');
    await sleep(450);
    if (!alive.current) return;
    setFry('idle');
    const next = cycle + 1;
    if (next >= TOTAL_CYCLES) { setCycle(next); runEnding(); }
    else setCycle(next);
  }, [phase, fry, cycle, play, runEnding]);

  const replay = useCallback(() => {
    preview.reset();
    setCycle(0); setFry('idle'); setLine(''); setPhase('intro');
  }, [preview.reset]);

  return (
    <>
      {phase === 'intro' && <Intro onEnter={enter} />}
      {!preloaded && phase === 'intro' && (
        <div style={{ position: 'fixed', bottom: 24, width: '100%', textAlign: 'center', color: '#333' }}>...</div>
      )}

      {(phase === 'eye-opening' || phase === 'table' || phase === 'no-fries' || phase === 'realization' || phase === 'eye-closing') && (
        <Eye
          mode={phase === 'eye-opening' ? 'opening' : phase === 'eye-closing' ? 'closing' : 'open'}
          blinkOn={fry === 'idle' && (phase === 'table' || phase === 'no-fries')}
        >
          {(phase === 'eye-opening' || phase === 'table' || phase === 'no-fries') && (
            <Scene cycle={Math.min(cycle, TOTAL_CYCLES - 1)} fry={fry} searching={phase === 'no-fries'} hasFries={phase !== 'no-fries'} onGrab={grab} onDip={dip} onEat={eat} />
          )}
          {(phase === 'realization' || phase === 'eye-closing') && <Final stage="realization" line={line} onPresave={() => {}} onReplay={replay} />}
        </Eye>
      )}

      {(phase === 'whisper' || phase === 'play' || phase === 'reveal' || phase === 'release') && (
        <Final
          stage={phase}
          line={line}
          onPresave={() => {}}
          onReplay={replay}
          onPlay={() => { preview.play(); startReveal(); }}
          showListen={phase === 'release' && preview.blocked}
          onListen={preview.play}
          trackLabel={preview.label}
          playing={preview.playing}
          onToggle={preview.toggle}
          onPrev={preview.prev}
          onNext={preview.next}
        />
      )}

      {entered && (
        <button className="tiny-mute" onClick={toggleMute} aria-label="звук">
          {muted ? 'звук: выкл' : 'звук: вкл'}
        </button>
      )}
    </>
  );
}
