import { MathJax, MathJaxContext } from 'better-react-mathjax';

import { cn } from '@/utils';

interface MathContainerProps {
  children: React.ReactNode;
  className?: string;
}

const config = {
  loader: { load: ['[tex]/color'] },
  tex: { packages: { '[+]': ['color'] } }
};

/** Muestra una fórmula en LaTeX con MathJax. Si `children` es texto, lo envuelve como fórmula en línea. */
export const MathContainer: React.FC<MathContainerProps> = ({ children, className }) => (
  <MathJaxContext config={config}>
    <MathJax className={cn(className)} style={{ display: 'initial !important' }}>
      {typeof children === 'string' ? `\\(${children}\\)` : children}
    </MathJax>
  </MathJaxContext>
);
