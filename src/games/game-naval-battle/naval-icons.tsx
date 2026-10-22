import { type IconName, ICONS } from './lib/icons';

interface Props extends Omit<React.SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
}

export const NavalIcon: React.FC<Props> = ({ name, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    aria-hidden="true"
    focusable="false"
    strokeWidth={2.2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {ICONS[name].map(({ d, mode }) => (
      <path
        key={d}
        d={d}
        fill={mode === 'fill' ? 'currentColor' : 'none'}
        stroke={mode === 'stroke' ? 'currentColor' : 'none'}
      />
    ))}
  </svg>
);
