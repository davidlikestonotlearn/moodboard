const paths = {
  logout: <><path d="M9 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" /><path d="M10 12h11m-4-4 4 4-4 4" /></>,
  back: <><path d="m14 5-7 7 7 7" /><path d="M7 12h14" /></>,
  chevronRight: <path d="m9 5 7 7-7 7" />,
  home: <><path d="m3.5 10 8.5-7 8.5 7v9a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 19Z" /><path d="M9 20.5v-7h6v7" /></>,
  moodboards: <><rect x="3" y="3" width="7" height="7" rx="1.6" /><rect x="14" y="3" width="7" height="11" rx="1.6" /><rect x="3" y="14" width="7" height="7" rx="1.6" /><rect x="14" y="18" width="7" height="3" rx="1.2" /></>,
  settings: <><path d="m9.2 3-.6 2.3-2 .9-2.1-.7-2.7 4.6 1.6 1.7v2.3l-1.6 1.7 2.7 4.6 2.1-.7 2 .9.6 2.3h5.4l.6-2.3 2-.9 2.1.7 2.7-4.6-1.6-1.7v-2.3l1.6-1.7-2.7-4.6-2.1.7-2-.9-.6-2.3Z" transform="translate(1 0) scale(.92)" /><circle cx="12" cy="12" r="3.1" /></>,
  organize: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><path d="M17.5 3v7M14 6.5h7" /></>,
  more: <><circle cx="5" cy="12" r="1.25" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.25" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1.25" fill="currentColor" stroke="none" /></>,
  moon: <path d="M20.2 15.2A8.5 8.5 0 0 1 8.8 3.8 8.5 8.5 0 1 0 20.2 15.2Z" />,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  link: <><path d="M10 13.5a4 4 0 0 0 6 .3l2.6-2.6a4 4 0 0 0-5.7-5.7l-1.5 1.5" /><path d="M14 10.5a4 4 0 0 0-6-.3l-2.6 2.6a4 4 0 0 0 5.7 5.7l1.5-1.5" /></>,
};

export function Icon({ name, className = '' }) {
  return <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
