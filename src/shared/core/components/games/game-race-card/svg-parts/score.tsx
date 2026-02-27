import { useOvaContext } from '@/context/ova-context';

import { i18n } from '../const';
import { useGameContext } from '../race-card-context';
import { DriversType } from '../types/types';

interface ScoreProps {
  drivers?: DriversType;
}

export const Score: React.FC<ScoreProps> = ({ drivers }) => {
  const { lang } = useOvaContext();
  const { game } = useGameContext();

  return (
    <g id="Puntaje">
      <g>
        <path
          className="st48"
          d="M241.2,465.6H57.4c-3,0-5.5-2.5-5.5-5.5v-30.6c0-3,2.5-5.5,5.5-5.5h183.9c3,0,5.5,2.5,5.5,5.5V460 C246.8,463.1,244.3,465.6,241.2,465.6z"
        />
        <g transform="translate(22, 0)">
          <path className="st49" d="M114.4,448.4l6.9-16.3h6.1l-10.9,22.5h-5.9l-3.8-22.5h5.7L114.4,448.4z" />
          <path
            className="st49"
            d="M137.6,448.5c0.2-1.2-0.4-2.1-1.9-2.7l-2.5-1.1c-3.6-1.6-5.2-3.8-5.1-6.5c0.1-1.3,0.5-2.4,1.3-3.4 s1.9-1.7,3.3-2.3c1.4-0.5,2.9-0.8,4.6-0.8c2.2,0,4,0.7,5.4,1.9c1.4,1.3,2,2.9,2,5.1h-5.3c0-0.9-0.2-1.6-0.5-2.1 c-0.4-0.5-1-0.8-2-0.8c-0.9,0-1.7,0.2-2.4,0.6s-1.1,1-1.2,1.7c-0.2,1,0.6,1.9,2.3,2.5c1.7,0.7,3,1.2,3.8,1.7 c2.5,1.5,3.6,3.5,3.5,6c-0.1,1.3-0.5,2.4-1.3,3.4s-1.8,1.7-3.1,2.3c-1.3,0.5-2.8,0.8-4.5,0.8c-1.2,0-2.3-0.2-3.4-0.6 c-1-0.4-1.9-0.9-2.7-1.6c-1.5-1.4-2.2-3.2-2.2-5.5h5.3c-0.1,1.2,0.2,2,0.7,2.6s1.4,0.9,2.6,0.9c0.9,0,1.6-0.2,2.2-0.6 C137.1,449.8,137.5,449.2,137.6,448.5z"
          />
        </g>
      </g>
      <text x="80" y="442" fill="white" style={{ fontWeight: 'bolder', fontSize: '0.7rem' }}>
        {drivers?.player || i18n[lang]['racing-driver-user']}
      </text>
      <text x="85" y="458" fill="white" style={{ fontWeight: 'bolder', fontSize: '0.7rem' }}>
        {game.pointplayer1}
      </text>
      <text x="175" y="442" fill="white" style={{ fontWeight: 'bolder', fontSize: '0.7rem' }}>
        {drivers?.machine || i18n[lang]['racing-driver-bot']}
      </text>
      <text x="195" y="458" fill="white" style={{ fontWeight: 'bolder', fontSize: '0.7rem' }}>
        {game.pointplayer2}
      </text>
    </g>
  );
};
