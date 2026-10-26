interface Props {
  color: string;
  className?: string;
  style?: React.CSSProperties;
}

/** Un coche de carreras visto desde arriba, mirando a la derecha. Decorativo: el nombre va siempre en texto. */
export const LanesCar: React.FC<Props> = ({ color, className, style }) => (
  <svg className={className} style={style} viewBox="0 0 64 32" aria-hidden="true" focusable="false">
    <g fill="#14181f">
      <rect x="9" y="0.5" width="13" height="6.500" rx="2" />
      <rect x="42" y="0.5" width="13" height="6.500" rx="2" />
      <rect x="9" y="25" width="13" height="6.500" rx="2" />
      <rect x="42" y="25" width="13" height="6.500" rx="2" />
    </g>
    <rect x="2" y="5" width="60" height="22" rx="10" fill={color} stroke="#14181f" strokeWidth="2" />
    <rect x="2" y="14.500" width="60" height="3" fill="#ffffff" opacity="0.75" />
    <rect x="22" y="8.500" width="22" height="15" rx="4.500" fill="#1d2a3a" stroke="#14181f" strokeWidth="1.500" />
    <rect x="25" y="10.500" width="9" height="11" rx="3" fill="#ffffff" opacity="0.25" />
    <circle cx="59.500" cy="10.500" r="2.200" fill="#fff3b0" />
    <circle cx="59.500" cy="21.500" r="2.200" fill="#fff3b0" />
  </svg>
);
