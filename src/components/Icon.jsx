// Ikon garis orisinal bertema fiskal & machine learning.
// Sengaja tidak memakai logo lembaga (IMF/WEF/World Bank); ini seharusnya
// tidak mengesankan dukungan resmi dari lembaga manapun.

export const IkonNeraca = (p) => (
  <svg className="ikon" viewBox="0 0 24 24" {...p}>
    <path d="M12 3v18M5 7l-3 6a4 4 0 0 0 6 0zM19 7l-3 6a4 4 0 0 0 6 0zM3 21h18M5 7h14" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IkonSimpul = (p) => (
  <svg className="ikon" viewBox="0 0 24 24" {...p}>
    <circle cx="5" cy="6" r="2.2" />
    <circle cx="19" cy="6" r="2.2" />
    <circle cx="12" cy="13" r="2.2" />
    <circle cx="5" cy="20" r="2.2" />
    <circle cx="19" cy="20" r="2.2" />
    <path d="M7 7l3.5 4.5M17 7l-3.5 4.5M10.5 15L7 18.5M13.5 15L17 18.5" strokeLinecap="round" />
  </svg>
);

export const IkonGlobe = (p) => (
  <svg className="ikon" viewBox="0 0 24 24" {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" strokeLinecap="round" />
  </svg>
);

export const IkonSinyal = (p) => (
  <svg className="ikon" viewBox="0 0 24 24" {...p}>
    <path d="M3 17l5-6 4 3 5-8 4 5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="21" cy="6" r="1.6" fill="currentColor" stroke="none" />
  </svg>
);

export const IkonCap = (p) => (
  <svg className="ikon" viewBox="0 0 24 24" {...p}>
    <rect x="4" y="6" width="16" height="12" rx="1" />
    <path d="M4 9h16M8 13h3M8 15.5h5" strokeLinecap="round" />
  </svg>
);
