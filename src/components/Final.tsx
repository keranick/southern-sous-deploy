import { motion } from 'framer-motion';
import { COVER_URL, RELEASE_DATE, RELEASE_KIND, RELEASE_SUBTITLE, RELEASE_TITLE, RELEASE_URL } from '../config';

export function Final({
  stage,
  line,
  onPresave,
  onReplay,
  showListen,
  onListen,
}: {
  stage: 'realization' | 'whisper' | 'reveal' | 'release';
  line: string;
  onPresave: () => void;
  onReplay: () => void;
  showListen?: boolean;
  onListen?: () => void;
}) {
  if (stage === 'realization' || stage === 'whisper') {
    return (
      <div className="mono-center" style={{ zIndex: 40 }}>
        <motion.div
          key={line}
          initial={{ opacity: 0, x: -2 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ fontSize: 18, letterSpacing: '0.15em', textAlign: 'center', padding: '0 24px' }}
        >
          {line}
        </motion.div>
      </div>
    );
  }
  return (
    <div className="mono-center" style={{ zIndex: 40, gap: 12 }}>
      <motion.div
        initial={{ opacity: 0, letterSpacing: '0.1em', filter: 'blur(4px)' }}
        animate={{ opacity: 1, letterSpacing: '0.3em', filter: 'blur(0px)' }}
        transition={{ duration: 0.9 }}
        style={{ fontSize: 30, marginLeft: '0.3em', textAlign: 'center' }}
      >
        {RELEASE_TITLE}
      </motion.div>
      {(stage === 'release' || line.includes('ЭМО')) && (
        <div style={{ letterSpacing: '0.4em', fontSize: 14, color: '#8a867c' }}>{RELEASE_SUBTITLE}</div>
      )}
      {stage === 'release' && (
        <>
          <div style={{ letterSpacing: '0.4em', fontSize: 14 }}>{RELEASE_KIND}</div>
          <img src={COVER_URL} alt="обложка" draggable={false} style={{ width: 'min(64vw, 300px)', marginTop: 10, filter: 'contrast(1.05)' }} />
          {showListen && (
            <button onClick={onListen} className="weird-btn" style={{ marginTop: 10 }}>
              [ СЛУШАТЬ ]
            </button>
          )}
          <div style={{ fontSize: 12, color: '#555' }}>релиз: {RELEASE_DATE}</div>
          <a
            href={RELEASE_URL}
            target="_blank"
            rel="noreferrer"
            onClick={onPresave}
            className="weird-btn"
            style={{ textDecoration: 'none', marginTop: 18, display: 'inline-block' }}
          >
            [ ПРЕСЕЙВ ]
          </a>
          <button onClick={onReplay} style={{ background: 'none', border: 'none', color: '#333', marginTop: 26, fontSize: 12, letterSpacing: '0.3em', cursor: 'pointer' }}>
            [ ЕЩЁ РАЗ ]
          </button>
        </>
      )}
    </div>
  );
}
