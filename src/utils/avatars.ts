export interface FaceCard {
  id: string;
  url: string;
}

const makeSvgUrl = (svgContent: string): string => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim())}`;
};

// Default cute blank user DP avatar (100% reliable SVG)
export const DEFAULT_BLANK_AVATAR = makeSvgUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="bg_blank" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#00a884" />
      <stop offset="100%" stop-color="#111b21" />
    </linearGradient>
  </defs>
  <circle cx="50" cy="50" r="50" fill="url(#bg_blank)" />
  <circle cx="50" cy="38" r="18" fill="#ffffff" opacity="0.9" />
  <path d="M 20 84 C 20 62, 36 56, 50 56 C 64 56, 80 62, 80 84 Z" fill="#ffffff" opacity="0.9" />
</svg>
`);

export const AVATAR_FACE_CARDS: FaceCard[] = [
  // 1. Cute Mouse (Disney Mickey style)
  {
    id: 'cute_mouse',
    url: makeSvgUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="50" fill="#fe4a49" />
      <circle cx="24" cy="24" r="18" fill="#2b2d42" />
      <circle cx="76" cy="24" r="18" fill="#2b2d42" />
      <circle cx="50" cy="56" r="32" fill="#2b2d42" />
      <ellipse cx="50" cy="62" rx="22" ry="18" fill="#fde2e4" />
      <ellipse cx="42" cy="54" rx="3" ry="6" fill="#2b2d42" />
      <ellipse cx="58" cy="54" rx="3" ry="6" fill="#2b2d42" />
      <circle cx="43" cy="52" r="1" fill="#ffffff" />
      <circle cx="59" cy="52" r="1" fill="#ffffff" />
      <ellipse cx="50" cy="62" rx="4" ry="2.5" fill="#2b2d42" />
      <path d="M 44 68 Q 50 74 56 68" stroke="#2b2d42" stroke-width="2" fill="none" stroke-linecap="round" />
      <circle cx="36" cy="64" r="3" fill="#ffb5a7" opacity="0.8" />
      <circle cx="64" cy="64" r="3" fill="#ffb5a7" opacity="0.8" />
    </svg>
    `),
  },
  // 2. Cute Yellow Electric Bunny (Pikachu/CN style)
  {
    id: 'cute_yellow_bunny',
    url: makeSvgUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="50" fill="#2a9d8f" />
      <polygon points="26,45 16,10 36,32" fill="#e9c46a" />
      <polygon points="16,10 22,14 28,30" fill="#264653" />
      <polygon points="74,45 84,10 64,32" fill="#e9c46a" />
      <polygon points="84,10 78,14 72,30" fill="#264653" />
      <circle cx="50" cy="54" r="34" fill="#e9c46a" />
      <circle cx="36" cy="50" r="5" fill="#264653" />
      <circle cx="64" cy="50" r="5" fill="#264653" />
      <circle cx="34" cy="48" r="1.8" fill="#ffffff" />
      <circle cx="62" cy="48" r="1.8" fill="#ffffff" />
      <circle cx="28" cy="60" r="6" fill="#e76f51" />
      <circle cx="72" cy="60" r="6" fill="#e76f51" />
      <path d="M 46 56 Q 50 59 54 56" stroke="#264653" stroke-width="2" fill="none" />
      <path d="M 44 60 Q 50 67 56 60 Z" fill="#e76f51" />
    </svg>
    `),
  },
  // 3. Cute Superhero Kid
  {
    id: 'cute_hero',
    url: makeSvgUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="50" fill="#3a86ff" />
      <circle cx="50" cy="50" r="32" fill="#ffdbac" />
      <path d="M 22 42 C 20 20, 80 20, 78 42 Z" fill="#5c3d2e" />
      <path d="M 22 40 C 35 48, 65 48, 78 40 C 82 58, 18 58, 22 40 Z" fill="#ff0054" />
      <ellipse cx="38" cy="48" rx="7" ry="5" fill="#ffffff" />
      <ellipse cx="62" cy="48" rx="7" ry="5" fill="#ffffff" />
      <circle cx="38" cy="48" r="3" fill="#212529" />
      <circle cx="62" cy="48" r="3" fill="#212529" />
      <path d="M 42 66 Q 50 74 58 66" stroke="#5c3d2e" stroke-width="2.5" stroke-linecap="round" fill="none" />
    </svg>
    `),
  },
  // 4. Cute Bear (Honey Bear style)
  {
    id: 'cute_bear',
    url: makeSvgUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="50" fill="#ffb703" />
      <circle cx="26" cy="26" r="14" fill="#8b5e3c" />
      <circle cx="26" cy="26" r="8" fill="#d4a373" />
      <circle cx="74" cy="26" r="14" fill="#8b5e3c" />
      <circle cx="74" cy="26" r="8" fill="#d4a373" />
      <circle cx="50" cy="54" r="34" fill="#8b5e3c" />
      <ellipse cx="50" cy="62" rx="16" ry="12" fill="#faedcd" />
      <ellipse cx="50" cy="57" rx="5" ry="3.5" fill="#4a2e18" />
      <path d="M 46 64 Q 50 68 54 64" stroke="#4a2e18" stroke-width="2" fill="none" />
      <circle cx="36" cy="50" r="4" fill="#4a2e18" />
      <circle cx="64" cy="50" r="4" fill="#4a2e18" />
      <circle cx="37" cy="48" r="1.5" fill="#ffffff" />
      <circle cx="65" cy="48" r="1.5" fill="#ffffff" />
    </svg>
    `),
  },
  // 5. Cute Blue Alien (Stitch style)
  {
    id: 'cute_blue_alien',
    url: makeSvgUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="50" fill="#7209b7" />
      <path d="M 28 45 C 5 25, 0 5, 20 20 Z" fill="#4895ef" />
      <path d="M 24 40 C 10 26, 8 15, 20 22 Z" fill="#f72585" />
      <path d="M 72 45 C 95 25, 100 5, 80 20 Z" fill="#4895ef" />
      <path d="M 76 40 C 90 26, 92 15, 80 22 Z" fill="#f72585" />
      <ellipse cx="50" cy="56" rx="34" ry="30" fill="#4895ef" />
      <ellipse cx="36" cy="52" rx="11" ry="13" fill="#bde0fe" />
      <ellipse cx="64" cy="52" rx="11" ry="13" fill="#bde0fe" />
      <ellipse cx="37" cy="53" rx="6" ry="8" fill="#03045e" />
      <ellipse cx="63" cy="53" rx="6" ry="8" fill="#03045e" />
      <circle cx="35" cy="50" r="2" fill="#ffffff" />
      <circle cx="61" cy="50" r="2" fill="#ffffff" />
      <ellipse cx="50" cy="61" rx="5" ry="3.5" fill="#f72585" />
      <path d="M 42 67 Q 50 74 58 67" stroke="#03045e" stroke-width="2" fill="none" stroke-linecap="round" />
    </svg>
    `),
  },
  // 6. Cute Princess Fairy (Disney style)
  {
    id: 'cute_princess',
    url: makeSvgUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="50" fill="#f72585" />
      <circle cx="50" cy="54" r="34" fill="#ffb703" />
      <circle cx="50" cy="52" r="28" fill="#ffe5ec" />
      <path d="M 34 26 L 40 36 L 50 22 L 60 36 L 66 26 L 64 40 L 36 40 Z" fill="#ffd166" />
      <circle cx="50" cy="27" r="2" fill="#ef476f" />
      <ellipse cx="40" cy="52" rx="3.5" ry="5" fill="#3a86ff" />
      <ellipse cx="60" cy="52" rx="3.5" ry="5" fill="#3a86ff" />
      <circle cx="39" cy="50" r="1.2" fill="#ffffff" />
      <circle cx="59" cy="50" r="1.2" fill="#ffffff" />
      <circle cx="34" cy="58" r="4" fill="#ff85a1" opacity="0.6" />
      <circle cx="66" cy="58" r="4" fill="#ff85a1" opacity="0.6" />
      <path d="M 45 61 Q 50 66 55 61" stroke="#ef476f" stroke-width="2" fill="none" stroke-linecap="round" />
    </svg>
    `),
  },
  // 7. Cute Kitty (Hello Kitty / CN Gumball style)
  {
    id: 'cute_kitty',
    url: makeSvgUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="50" fill="#4cc9f0" />
      <polygon points="20,40 16,14 40,26" fill="#ffffff" />
      <polygon points="22,38 19,19 36,28" fill="#ff85a1" />
      <polygon points="80,40 84,14 60,26" fill="#ffffff" />
      <polygon points="78,38 81,19 64,28" fill="#ff85a1" />
      <ellipse cx="50" cy="56" rx="34" ry="28" fill="#ffffff" />
      <ellipse cx="36" cy="52" rx="4" ry="6" fill="#2b2d42" />
      <ellipse cx="64" cy="52" rx="4" ry="6" fill="#2b2d42" />
      <circle cx="35" cy="50" r="1.5" fill="#ffffff" />
      <circle cx="63" cy="50" r="1.5" fill="#ffffff" />
      <ellipse cx="50" cy="58" rx="3.5" ry="2.5" fill="#ffb703" />
      <path d="M 44 63 Q 50 68 56 63" stroke="#2b2d42" stroke-width="2" fill="none" />
      <line x1="16" y1="52" x2="28" y2="54" stroke="#2b2d42" stroke-width="2" stroke-linecap="round" />
      <line x1="15" y1="60" x2="27" y2="60" stroke="#2b2d42" stroke-width="2" stroke-linecap="round" />
      <line x1="84" y1="52" x2="72" y2="54" stroke="#2b2d42" stroke-width="2" stroke-linecap="round" />
      <line x1="85" y1="60" x2="73" y2="60" stroke="#2b2d42" stroke-width="2" stroke-linecap="round" />
    </svg>
    `),
  },
  // 8. Cute Bunny (Bugs / CN style)
  {
    id: 'cute_bunny',
    url: makeSvgUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="50" fill="#b5e2fa" />
      <ellipse cx="36" cy="24" rx="8" ry="22" fill="#ffffff" />
      <ellipse cx="36" cy="24" rx="4" ry="16" fill="#ffb5a7" />
      <ellipse cx="64" cy="24" rx="8" ry="22" fill="#ffffff" />
      <ellipse cx="64" cy="24" rx="4" ry="16" fill="#ffb5a7" />
      <circle cx="50" cy="58" r="30" fill="#ffffff" />
      <ellipse cx="38" cy="54" rx="3.5" ry="5.5" fill="#2b2d42" />
      <ellipse cx="62" cy="54" rx="3.5" ry="5.5" fill="#2b2d42" />
      <circle cx="37" cy="52" r="1.2" fill="#ffffff" />
      <circle cx="61" cy="52" r="1.2" fill="#ffffff" />
      <polygon points="50,60 46,57 54,57" fill="#ffb5a7" />
      <path d="M 47 62 L 47 67 L 53 67 L 53 62 Z" fill="#ffffff" stroke="#2b2d42" stroke-width="1" />
      <circle cx="30" cy="60" r="4" fill="#ffb5a7" opacity="0.7" />
      <circle cx="70" cy="60" r="4" fill="#ffb5a7" opacity="0.7" />
    </svg>
    `),
  },
  // 9. Cute Sailor Duck (Donald style)
  {
    id: 'cute_duck',
    url: makeSvgUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="50" fill="#0077b6" />
      <circle cx="50" cy="54" r="30" fill="#ffffff" />
      <path d="M 30 34 L 70 34 L 64 22 L 36 22 Z" fill="#023e8a" />
      <path d="M 24 34 Q 50 38 76 34 L 76 38 Q 50 42 24 38 Z" fill="#ffffff" />
      <path d="M 60 26 L 74 20 L 70 30 Z" fill="#e63946" />
      <ellipse cx="50" cy="64" rx="16" ry="10" fill="#ffb703" />
      <ellipse cx="50" cy="60" rx="14" ry="4" fill="#fb8500" />
      <ellipse cx="40" cy="50" rx="4" ry="7" fill="#023e8a" />
      <ellipse cx="60" cy="50" rx="4" ry="7" fill="#023e8a" />
      <circle cx="39" cy="48" r="1.5" fill="#ffffff" />
      <circle cx="59" cy="48" r="1.5" fill="#ffffff" />
    </svg>
    `),
  },
  // 10. Cute Penguin
  {
    id: 'cute_penguin',
    url: makeSvgUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="50" fill="#ff0054" />
      <circle cx="50" cy="52" r="34" fill="#1d3557" />
      <ellipse cx="50" cy="56" rx="26" ry="24" fill="#ffffff" />
      <ellipse cx="40" cy="50" rx="4" ry="6" fill="#1d3557" />
      <ellipse cx="60" cy="50" rx="4" ry="6" fill="#1d3557" />
      <circle cx="39" cy="48" r="1.5" fill="#ffffff" />
      <circle cx="59" cy="48" r="1.5" fill="#ffffff" />
      <polygon points="50,55 42,62 58,62" fill="#ff9e00" />
      <circle cx="32" cy="60" r="4" fill="#ff70a6" opacity="0.8" />
      <circle cx="68" cy="60" r="4" fill="#ff70a6" opacity="0.8" />
    </svg>
    `),
  },
  // 11. Cute Baby Dino / Dragon
  {
    id: 'cute_dino',
    url: makeSvgUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="50" fill="#52b788" />
      <polygon points="34,26 28,14 40,22" fill="#ffb703" />
      <polygon points="66,26 72,14 60,22" fill="#ffb703" />
      <circle cx="50" cy="54" r="32" fill="#74c69d" />
      <ellipse cx="50" cy="64" rx="20" ry="14" fill="#b7e4c7" />
      <circle cx="45" cy="60" r="1.8" fill="#2d6a4f" />
      <circle cx="55" cy="60" r="1.8" fill="#2d6a4f" />
      <path d="M 42 66 Q 50 72 58 66" stroke="#2d6a4f" stroke-width="2" fill="none" stroke-linecap="round" />
      <circle cx="38" cy="48" r="5" fill="#1b4332" />
      <circle cx="62" cy="48" r="5" fill="#1b4332" />
      <circle cx="36" cy="46" r="1.8" fill="#ffffff" />
      <circle cx="60" cy="46" r="1.8" fill="#ffffff" />
    </svg>
    `),
  },
  // 12. Cute Red Panda / Fox
  {
    id: 'cute_fox',
    url: makeSvgUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="50" fill="#ff70a6" />
      <polygon points="20,40 16,14 42,28" fill="#f77f00" />
      <polygon points="22,38 19,19 36,29" fill="#eae2b7" />
      <polygon points="80,40 84,14 58,28" fill="#f77f00" />
      <polygon points="78,38 81,19 64,29" fill="#eae2b7" />
      <circle cx="50" cy="54" r="32" fill="#f77f00" />
      <polygon points="50,76 26,52 74,52" fill="#ffffff" />
      <circle cx="50" cy="66" r="3.5" fill="#003049" />
      <circle cx="36" cy="48" r="4.5" fill="#003049" />
      <circle cx="64" cy="48" r="4.5" fill="#003049" />
      <circle cx="34" cy="46" r="1.5" fill="#ffffff" />
      <circle cx="62" cy="46" r="1.5" fill="#ffffff" />
      <circle cx="28" cy="58" r="4" fill="#fcbf49" opacity="0.8" />
      <circle cx="72" cy="58" r="4" fill="#fcbf49" opacity="0.8" />
    </svg>
    `),
  },
];
