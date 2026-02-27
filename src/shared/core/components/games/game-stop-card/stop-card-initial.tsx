import { Panel as PanelUI } from 'books-ui';

import { useOvaContext } from '@/context/ova-context';

import { background, i18n } from './const';

import css from './stop-card.module.css';

interface Props {
  textInitial: string;
  section?: number;
}

export const StopCardInitial = ({ textInitial, section = 1 }: Props) => {
  const { lang } = useOvaContext();
  return (
    <svg
      id="svg-stop-game-initial"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 790 500"
      role="img"
      aria-label="Stop game initial screen">
      <style>
        {`
          #svg-stop-game-initial .st1{fill:none}
          #svg-stop-game-initial .st2{fill:#fff}
          #svg-stop-game-initial .st11{font-size:66.4636px}
        `}
      </style>

      <image
        id="Fondo_general"
        x="0"
        y="0"
        width="100%"
        height="100%"
        xlinkHref={background}
        preserveAspectRatio="xMidYMid meet"
      />

      {/* BOTÓN */}
      <foreignObject x="290" y="190" width="200" height="72" requiredExtensions="http://www.w3.org/1999/xhtml">
        <div>
          <PanelUI.Button section={section}>
            <button className={css['stop-game-initial-button']} type="button">
              {i18n[lang]['start-button']}
            </button>
          </PanelUI.Button>
        </div>
      </foreignObject>

      {/* TEXTO */}
      <foreignObject x="70" y="345" width="650" height="150" requiredExtensions="http://www.w3.org/1999/xhtml">
        <div className={css['stop-game-container-question']}>
          <p dangerouslySetInnerHTML={{ __html: textInitial }} />
        </div>
      </foreignObject>
    </svg>
  );
};
