const paths: Record<string, string> = {
  home: 'M3 10 12 3l9 7v10a1 1 0 0 1-1 1h-6v-7h-4v7H4a1 1 0 0 1-1-1z',
  book: 'M4 3h12a3 3 0 0 1 3 3v15H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3M3 17h16M8 7h7M8 11h7',
  library: 'M4 3v18M8 3v18M12 3v18M16 4l4 16',
  calendar: 'M4 5h16v16H4zM7 2v6M17 2v6M4 10h16M8 14h2M14 14h2M8 18h2',
  heart: 'M20 5c-2-2-5-2-8 1-3-3-6-3-8-1-3 3-1 7 2 10l6 6 6-6c3-3 5-7 2-10z',
  message: 'M3 4h18v13H8l-5 4zM7 8h10M7 12h6',
  chart: 'M4 3v18h17M8 16v-5M13 16V7M18 16V4',
  image: 'M3 3h18v18H3zM3 17l5-5 5 5 3-3 5 5M15 7h.01',
  quiz: 'M9 7a3 3 0 1 1 4 3c-1 1-1 1-1 3M12 17h.01M3 3h18v18H3z',
  spark: 'M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3z',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  plus: 'M12 5v14M5 12h14',
  search: 'M15 15l6 6M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0',
  refresh: 'M20 7v5h-5M4 17v-5h5M5 8a8 8 0 0 1 13-3l2 7M19 16a8 8 0 0 1-13 3l-2-7',
  logout: 'M10 3H3v18h7M8 12h13M17 8l4 4-4 4',
  check: 'M5 12l4 4L19 6',
  close: 'M6 6l12 12M18 6 6 18',
  download: 'M12 3v12M7 10l5 5 5-5M4 17v4h16v-4',
  shield: 'M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6zM8 12l3 3 5-6',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
  menu: 'M4 6h16M4 12h16M4 18h16',
}
export default function AdminIcon({ name, size = 20 }: { name: string; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name] || paths.book} /></svg>
}
