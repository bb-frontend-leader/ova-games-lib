import css from './game-treasure-map.module.css';

/** Una isla pequeña (palmera, colina o rocas) con su bandera cuando ya está explorada. */
export const IslandArt: React.FC<{ kind: 'palm' | 'hill' | 'rocks'; visited: boolean }> = ({ kind, visited }) => (
  <svg className={css['island-art']} viewBox="0 0 80 56" aria-hidden="true" focusable="false">
    <ellipse cx="40" cy="45" rx="37" ry="9" fill="#0b3a5c" opacity="0.35" />
    <ellipse cx="40" cy="40" rx="34" ry="12.500" fill="#e7c986" />
    <ellipse cx="40" cy="38.500" rx="30" ry="10" fill="#f4dca4" />

    {kind === 'palm' && (
      <g>
        <path d="M43 38Q46 25 40 13" fill="none" stroke="#7a4a1e" strokeWidth="3.200" strokeLinecap="round" />
        {[-165, -125, -90, -55, -15].map((deg) => (
          <ellipse key={deg} cx="51" cy="13" rx="11" ry="3.400" fill="#2f9a4d" transform={`rotate(${deg} 40 13)`} />
        ))}
        <circle cx="40" cy="14" r="2" fill="#7a4a1e" />
      </g>
    )}

    {kind === 'hill' && (
      <g>
        <path d="M14 40Q40 4 66 40Z" fill="#3f9a52" />
        <path d="M22 38Q38 14 52 30Q42 22 30 38Z" fill="#6cc57a" opacity="0.8" />
        <circle cx="30" cy="34" r="2.600" fill="#d9534f" />
        <circle cx="52" cy="35" r="2.600" fill="#f2c94c" />
      </g>
    )}

    {kind === 'rocks' && (
      <g>
        <path d="M18 40 26 22 36 40Z" fill="#8a94a3" />
        <path d="M30 40 42 14 56 40Z" fill="#a4adbb" />
        <path d="M44 40 54 26 64 40Z" fill="#7a8493" />
        <path d="M42 14 47 26 38 28Z" fill="#c6ceda" opacity="0.7" />
      </g>
    )}

    {visited && (
      <g className={css.flag}>
        <path d="M60 41V14" stroke="#4a2a0c" strokeWidth="2" strokeLinecap="round" />
        <path d="M60 14h14l-4 5 4 5H60Z" fill="#e5383b" />
      </g>
    )}
  </svg>
);

/** El barco: un velero visto de lado (mira a la derecha; el juego lo voltea con `data-face`). */
export const ShipArt: React.FC = () => (
  <svg className={css['ship-art']} viewBox="0 0 72 64" aria-hidden="true" focusable="false">
    <path d="M36 4v38" stroke="#4a2a0c" strokeWidth="2.400" strokeLinecap="round" />
    <path d="M36 6 36 18 44 12Z" fill="#e5383b" />
    <path d="M38 14c14 4 20 14 22 26H38Z" fill="#fff8e6" stroke="#c9b27c" strokeWidth="1.200" />
    <path d="M34 18c-10 5-16 13-18 22h18Z" fill="#fff0cc" stroke="#c9b27c" strokeWidth="1.200" />
    <path d="M6 42h60l-9 14H15Z" fill="#8a4b22" stroke="#4a230d" strokeWidth="2" strokeLinejoin="round" />
    <path d="M10 46h52" stroke="#ffd24a" strokeWidth="2" />
    <circle cx="26" cy="50" r="2" fill="#ffd24a" />
    <circle cx="36" cy="50" r="2" fill="#ffd24a" />
    <circle cx="46" cy="50" r="2" fill="#ffd24a" />
  </svg>
);

/** El puerto: un faro a rayas y un muelle. */
export const PortArt: React.FC = () => (
  <svg className={css['port-art']} viewBox="0 0 80 64" aria-hidden="true" focusable="false">
    <ellipse cx="38" cy="54" rx="34" ry="8" fill="#0b3a5c" opacity="0.35" />
    <path d="M22 54 28 16h16l6 38Z" fill="#fff8e6" stroke="#c9b27c" strokeWidth="1.500" />
    <path d="M25 38h25l1.500 10h-28Z" fill="#e5383b" />
    <path d="M25.500 22h19l1.200 9h-21.400Z" fill="#e5383b" />
    <path d="M26 16h16l-8-9Z" fill="#4a5568" />
    <circle cx="36" cy="12" r="3" fill="#ffd24a" />
    <path d="M4 56h72v5H4Z" fill="#8a4b22" />
    <path d="M12 56v8M28 56v8M44 56v8M60 56v8" stroke="#4a230d" strokeWidth="3" />
  </svg>
);

/** La isla del tesoro: una isla grande con una X y el cofre, que se abre al final. */
export const TreasureArt: React.FC = () => (
  <svg className={css['treasure-art']} viewBox="0 0 120 88" aria-hidden="true" focusable="false">
    <ellipse cx="60" cy="76" rx="54" ry="10" fill="#0b3a5c" opacity="0.35" />
    <ellipse cx="60" cy="64" rx="52" ry="18" fill="#e7c986" />
    <ellipse cx="60" cy="61" rx="46" ry="14" fill="#f4dca4" />
    <path d="M14 58q8-26 24-18 6-18 22-14 18-8 28 16 12-2 18 16Z" fill="#3f9a52" opacity="0.9" />
    <path d="M26 54l8 8M34 54l-8 8" stroke="#c0392b" strokeWidth="3.500" strokeLinecap="round" />
    <g className={css.glow}>
      <circle cx="68" cy="56" r="18" fill="#ffd24a" opacity="0.55" />
    </g>
    <g transform="translate(54 42)">
      <rect y="10" width="28" height="16" rx="2" fill="#8a4b22" stroke="#4a230d" strokeWidth="2" />
      <rect x="12" y="14" width="4" height="7" fill="#ffd24a" />
      <g className={css.lid}>
        <path d="M0 10a14 9 0 0 1 28 0Z" fill="#a85f2a" stroke="#4a230d" strokeWidth="2" />
      </g>
      <g className={css.coins}>
        <circle cx="8" cy="9" r="3.500" fill="#ffd24a" />
        <circle cx="15" cy="7" r="3.500" fill="#ffe27a" />
        <circle cx="21" cy="9" r="3.500" fill="#ffb703" />
      </g>
    </g>
  </svg>
);

/** Rosa de los vientos decorativa. */
export const CompassRose: React.FC = () => (
  <svg className={css.rose} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
    <circle cx="50" cy="50" r="38" fill="none" stroke="#fff8e6" strokeWidth="2" opacity="0.7" />
    <circle cx="50" cy="50" r="30" fill="none" stroke="#fff8e6" strokeWidth="1" opacity="0.5" />
    <path d="M50 6 58 50 50 94 42 50Z" fill="#fff8e6" opacity="0.8" />
    <path d="M6 50 50 42 94 50 50 58Z" fill="#fff8e6" opacity="0.55" />
    <path d="M50 6 58 50H42Z" fill="#e5383b" opacity="0.9" />
    <text x="50" y="4" textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff8e6">
      N
    </text>
  </svg>
);
