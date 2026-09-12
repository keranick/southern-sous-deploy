export type Phase =
  | 'intro'
  | 'eye-opening'
  | 'table'
  | 'no-fries'
  | 'realization'
  | 'eye-closing'
  | 'whisper'
  | 'reveal'
  | 'release';

export type FryState = 'idle' | 'holding' | 'dipped' | 'eating';

export const CYCLE_HINTS = ['возьми', 'ещё', 'ещё?', 'ЕЩЁ', 'ЕЩЁЁ', 'ЕЩЁ ЕЩЁ ЕЩЁ'];
export const TOTAL_CYCLES = 6;
