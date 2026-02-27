import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { FullScreenAlert } from '../../ui';

import { BACKGROUND, CHARACTER, MONEY } from './const';
import { useGameMoneyActivityContext } from './game-money-context';

import css from './game-money.module.css';

interface Props {
  children: React.ReactNode;
  addClass?: string;
  label: string;
}

export const GameMoneyLevel: React.FC<Props> = ({ children, label, addClass, ...props }) => {
  const { validation, options, result } = useGameMoneyActivityContext();

  const safeSrc = (rawSrc: string): string => rawSrc.replace(/\s/g, ''); // Elimina espacios en blanco accidentales
  const bg = safeSrc(BACKGROUND); // Fondo de pantalla

  const optionsRef = useRef<HTMLDivElement>(null);
  const [characterLeftPx, setCharacterLeftPx] = useState<number | null>(null);

  // Si solo hay un grupo, basta con el primer seleccionado
  const selectedId = useMemo(() => options[0]?.id ?? null, [options]);

  /**
   * Calcula la coordenada x relativa ao contenedor do elemento com o id passado como par metro.
   *
   * @param {string} optionId - Id do elemento.
   * @returns {number | null} Coordenada x relativa ao contenedor ou null se o elemento nao for encontrado.
   */
  const computeCenterX = (optionId: string): number | null => {
    const container = optionsRef.current;
    if (!container) return null;

    const containerRect = container.getBoundingClientRect();
    const el = container.querySelector(`[data-option-id="${optionId}"]`) as HTMLElement | null;
    if (!el) return null;

    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    return centerX - containerRect.left; // px relativo al contenedor
  };

  /**
   * Recalcula a coordenada x do personagem para o centro do container
   * com base na op o selecionada.
   * Se n o houver nenhuma op o selecionada, retorna null.
   * @returns {number | null} Coordenada x relativa ao contenedor ou null se n o houver nenhuma op o selecionada.
   */
  const recalc = () => {
    const container = optionsRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();

    // Si el contenedor aún no tiene ancho real, no calcules (reintenta luego)
    if (!containerRect.width) return;

    const fallbackCenter = containerRect.width / 2;

    if (!selectedId) {
      setCharacterLeftPx(fallbackCenter);
      return;
    }

    const x = computeCenterX(selectedId);

    // Si x es null, NaN o 0 (layout aún no listo), usa fallback centro
    if (x == null || Number.isNaN(x) || x <= 1) {
      setCharacterLeftPx(fallbackCenter);
      return;
    }

    setCharacterLeftPx(x);
  };

  /**
   * Recalcula a coordenada x do personagem para o centro do container
   */
  useLayoutEffect(() => {
    let raf1 = 0;
    let raf2 = 0;

    raf1 = requestAnimationFrame(() => {
      recalc();
      raf2 = requestAnimationFrame(() => recalc());
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, children, validation, result]);

  /**
   * Recalcula a coordenada x do personagem para o centro do container
   */
  useEffect(() => {
    const onResize = () => recalc();
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const characterImage = validation ? (result ? CHARACTER.success : CHARACTER.wrong) : CHARACTER.normal;

  return (
    <div className="u-flow">
      <FullScreenAlert />
      <div
        className={` ${css['background']} u-flow ${addClass ? addClass : ''}`}
        {...props}
        role="group"
        id="fullscreen_money"
        aria-labelledby="question-text"
        style={{ '--bg-image': `url("${bg}")` } as React.CSSProperties}>
        {/* <FullScreenButton elementId="fullscreen_money" addClass={css.fullScreen__button} /> */}
        <div className={css['options-container']} ref={optionsRef}>
          {children}
        </div>
        <div className={css['character-container']} aria-hidden="true">
          <img
            src={safeSrc(characterImage)}
            alt="Personaje"
            className={css['character']}
            style={characterLeftPx !== null ? { left: `${characterLeftPx}px`, transform: 'translateX(-50%)' } : {}}
          />
          {result && (
            <img
              key={`money-${validation}-${result}`} // fuerza remount si cambian flags
              src={safeSrc(MONEY)}
              alt="Billetes"
              className={`${css.money} ${css.moneyFall}`}
              style={{
                left: characterLeftPx !== null ? `${characterLeftPx}px` : '50%' // o donde lo quieras
              }}
            />
          )}
        </div>
        <p className={`${css['question-text']}`}>{label}</p>
      </div>
    </div>
  );
};
