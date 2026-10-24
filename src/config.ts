export const RELEASE_URL = 'https://band.link/emosous';
export const RELEASE_TITLE = 'ЮЖНЫЙ СОУС';
export const RELEASE_SUBTITLE = 'ЭМО КОММЬЮНИТИ';
export const RELEASE_KIND = 'МИКСТЕЙП';
export const RELEASE_DATE = '06.11.2026';
export const COVER_URL = '/assets/release/cover.jpg';

const trackModules = import.meta.glob<string>('../assets/release/preview-tracks/*.mp3', {
  eager: true,
  query: '?url',
  import: 'default',
});

export const PREVIEW_TRACKS = Object.entries(trackModules)
  .map(([path, url]) => ({
    name: decodeURIComponent(path.split('/').pop()!.replace(/\.mp3$/i, '')),
    url,
  }))
  .sort((a, b) => a.name.localeCompare(b.name, 'ru'));

export const previewTrackLabel = (name: string) => `${name} - ?????`;
