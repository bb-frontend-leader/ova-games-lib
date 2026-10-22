import type { PanelProps } from 'books-ui';
import { Panel as PanelUI } from 'books-ui';

import { cn } from '@/utils';

import { PanelNav } from './panel-nav';

import css from './panel.module.css';

interface Props extends PanelProps {
  addClass?: string;
}

type SubModules = {
  Section: typeof PanelUI.Section;
  Button: typeof PanelUI.Button;
};

/**
 * Panel de secciones (una visible a la vez) con navegación "atrás / siguiente" y puntos de avance.
 * Los botones de navegación llevan las clases `js-panel-next-button` y `js-panel-previous-button`, que usa
 * `SectionNavigation` para avanzar desde dentro de un juego.
 */
const Panel: React.FC<Props> & SubModules = ({ addClass, children, ...props }) => (
  <PanelUI type="carrousel" addClass={cn(css.panel, addClass)} {...props}>
    <PanelNav />
    {children}
  </PanelUI>
);

Panel.Section = PanelUI.Section;
Panel.Button = PanelUI.Button;

export { Panel };
