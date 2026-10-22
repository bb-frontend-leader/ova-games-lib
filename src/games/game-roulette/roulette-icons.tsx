import { ICON_PATHS, type IconName } from './lib/icons';

const STROKED: IconName[] = ['card', 'check', 'cross'];

interface Props extends Omit<React.SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
}

export const RouletteIcon: React.FC<Props> = ({ name, ...props }) => {
  const stroked = STROKED.includes(name);

  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
      fill={stroked ? 'none' : 'currentColor'}
      stroke={stroked ? 'currentColor' : 'none'}
      strokeWidth={stroked ? 2.4 : 0}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d={ICON_PATHS[name]} />
    </svg>
  );
};
