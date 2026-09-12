export function Intro({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="mono-center">
      <div style={{ fontSize: 28, letterSpacing: '0.5em', marginLeft: '0.5em' }}>СОУС</div>
      <button className="weird-btn" onClick={onEnter} autoFocus aria-label="Войти">
        [ ВОЙТИ ]
      </button>
    </div>
  );
}
