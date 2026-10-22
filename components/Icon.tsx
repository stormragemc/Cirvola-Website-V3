// 24×24 stroke icons. currentColor so they inherit text colour.
export const iconPaths: Record<string, string> = {
  linkedin: '<path d="M7 10v7M7 7v.01M11 17v-4a2.5 2.5 0 0 1 5 0v4M11 10v7"/><rect x="3" y="3" width="18" height="18" rx="4"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5v.01"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  minus: '<path d="M5 12h14"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  leaf: '<path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14Z"/><path d="M5 19 13 11"/>',
  send: '<path d="M4 12 20 4l-6 16-3-7-7-1Z"/>',
  'check-circle': '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  'arrow-left': '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  'arrow-right': '<path d="M5 12h14M13 6l6 6-6 6"/>',
  calendar: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
  pin: '<path d="M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11Z"/><circle cx="12" cy="10" r="2"/>',
  play: '<path d="M8 5v14l11-7L8 5Z"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  sparkle: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a5.5 5.5 0 0 1 3.5 6"/>',
  external: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  refresh: '<path d="M20 11a8 8 0 0 0-14.5-4.5L4 8M4 4v4h4M4 13a8 8 0 0 0 14.5 4.5L20 16M20 20v-4h-4"/>',
  flask: '<path d="M9 3h6M10 3v6L4.5 18.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3"/><path d="M7 15h10"/>',
  warning: '<path d="M12 4 2.5 20h19L12 4Z"/><path d="M12 10v4M12 17v.01"/>',
  // process icons for the lab bench
  bake: '<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 10h18M7 14h10M8 3v1M12 3v1M16 3v1"/>',
  ferment: '<path d="M8 3h8M9 3v3a4 4 0 0 0-3 3.9V19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9.9A4 4 0 0 0 15 6V3"/><circle cx="10" cy="14" r="1"/><circle cx="14" cy="16" r="1.4"/><circle cx="13" cy="11.5" r=".8"/>',
  dry: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  candy: '<rect x="5" y="9" width="10" height="10" rx="1.5"/><path d="M15 9l4-4M9 9l4-4h6v6l-4 4"/>',
  simmer: '<path d="M4 11h16v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-5ZM2 11h2M20 11h2"/><path d="M9 4c-1 1.5 1 2.5 0 4M13 4c-1 1.5 1 2.5 0 4"/>',
  crisp: '<path d="M4 15c2-6 6-9 13-10-1 7-4 11-10 13"/><path d="M4 15c1 1 2 2 3 3M8 12l3 3M12 9l2 2"/>',
  blend: '<path d="M7 3h10l-1.5 11h-7L7 3ZM8.5 14h7l.5 3H8l.5-3ZM7 21h10v-4H7v4Z"/>',
  press: '<path d="M5 3h14v4H5zM12 7v4M7 11h10v3H7zM4 18h16v3H4z"/>',
};

export function Icon({ name, size = 20, label }: { name: string; size?: number; label?: string }) {
  const aria = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true as const };
  return (
    <svg
      className={`icon icon-${name}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...aria}
      dangerouslySetInnerHTML={{ __html: iconPaths[name] || '' }}
    />
  );
}
