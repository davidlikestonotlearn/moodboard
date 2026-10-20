const paths = {
  home: <><path d="m3.5 10 8.5-7 8.5 7v9a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 19Z" /><path d="M9 20.5v-7h6v7" /></>,
  moodboards: <><rect x="3" y="3" width="7" height="7" rx="1.6" /><rect x="14" y="3" width="7" height="11" rx="1.6" /><rect x="3" y="14" width="7" height="7" rx="1.6" /><rect x="14" y="18" width="7" height="3" rx="1.2" /></>,
  settings: <><path d="m9.2 3-.6 2.3-2 .9-2.1-.7-2.7 4.6 1.6 1.7v2.3l-1.6 1.7 2.7 4.6 2.1-.7 2 .9.6 2.3h5.4l.6-2.3 2-.9 2.1.7 2.7-4.6-1.6-1.7v-2.3l1.6-1.7-2.7-4.6-2.1.7-2-.9-.6-2.3Z" transform="translate(1 0) scale(.92)" /><circle cx="12" cy="12" r="3.1" /></>,
  organize: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><path d="M17.5 3v7M14 6.5h7" /></>,
  more: <><circle cx="5" cy="12" r="1.25" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.25" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1.25" fill="currentColor" stroke="none" /></>,
};

export function Icon({ name, className = '' }) {
  return <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
