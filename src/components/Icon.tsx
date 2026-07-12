export type IconName =
  | "arrow"
  | "back"
  | "calendar"
  | "check"
  | "clock"
  | "erase"
  | "grid"
  | "hint"
  | "home"
  | "info"
  | "note"
  | "pause"
  | "play"
  | "redo"
  | "settings"
  | "sound"
  | "stats"
  | "trophy"
  | "undo"
  | "volume-off";
const paths: Record<IconName, React.ReactNode> = {
  arrow: (
    <>
      <path d="M5 12h14" />
      <path d="m14 7 5 5-5 5" />
    </>
  ),
  back: (
    <>
      <path d="m15 18-6-6 6-6" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M8 3v4m8-4v4M3 10h18" />
      <path d="M8 14h.01m4 0h.01m4 0h.01M8 18h.01m4 0h.01" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  erase: (
    <>
      <path d="m4 15 7-9a2 2 0 0 1 3-.2l5 4a2 2 0 0 1 .2 3l-6 7H8l-4-3a2 2 0 0 1 0-2Z" />
      <path d="m9 9 7 6M13 20h8" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M9 3v18m6-18v18M3 9h18M3 15h18" />
    </>
  ),
  hint: (
    <>
      <path d="M12 2 9 9l-7 3 7 3 3 7 3-7 7-3-7-3-3-7Z" />
    </>
  ),
  home: (
    <>
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v10h14V10M9 20v-6h6v6" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6m0-10h.01" />
    </>
  ),
  note: (
    <>
      <path d="M4 20h4l11-11a2 2 0 0 0-4-4L4 16v4Z" />
      <path d="m13.5 6.5 4 4" />
    </>
  ),
  pause: (
    <>
      <rect x="5" y="4" width="5" height="16" rx="2" />
      <rect x="14" y="4" width="5" height="16" rx="2" />
    </>
  ),
  play: <path d="m8 5 11 7-11 7V5Z" />,
  redo: (
    <>
      <path d="M20 7v5h-5" />
      <path d="M19 12a8 8 0 1 0-2 5" />
    </>
  ),
  settings: (
    <>
      <path d="M4 7h10m4 0h2M4 17h2m4 0h10" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="8" cy="17" r="2" />
    </>
  ),
  sound: (
    <>
      <path d="M5 9H2v6h3l5 4V5L5 9Z" />
      <path d="M14 9a4 4 0 0 1 0 6m3-9a8 8 0 0 1 0 12" />
    </>
  ),
  stats: (
    <>
      <path d="M4 20V10m6 10V4m6 16v-7m4 7V7" />
    </>
  ),
  trophy: (
    <>
      <path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" />
      <path d="M8 6H4v2a4 4 0 0 0 4 4m8-6h4v2a4 4 0 0 1-4 4M12 13v4m-4 3h8" />
    </>
  ),
  undo: (
    <>
      <path d="M4 7v5h5" />
      <path d="M5 12a8 8 0 1 1 2 5" />
    </>
  ),
  "volume-off": (
    <>
      <path d="M5 9H2v6h3l5 4V5L5 9Z" />
      <path d="m15 9 6 6m0-6-6 6" />
    </>
  ),
};
export function Icon({
  name,
  size = 22,
  className,
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      className={className}
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}
