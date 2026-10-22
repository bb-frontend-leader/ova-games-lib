import { useLang } from '@/hooks';
import { cn } from '@/utils';

import { useCrosswordActivityContext } from './crossword-activity-context';
import { i18n } from './lib/constant';

import type { Direction } from './types/types';

import css from './crossword.module.css';

interface Props {
  addClass?: string;
  /** Nivel del encabezado "Pistas" (los subtítulos usan el siguiente). Por defecto 2: las páginas solo tienen h1. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
}

/** Etiqueta de encabezado para un nivel (limitado a h2-h6). */
const tag = (level: number) => `h${Math.min(Math.max(level, 2), 6)}` as 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export const CrosswordClues: React.FC<Props> = ({ addClass, headingLevel = 2 }) => {
  const lang = useLang();
  const t = i18n[lang];
  const { layout, activeWord, validation, wordResults, selectWord } = useCrosswordActivityContext();

  const Heading = tag(headingLevel);
  const SubHeading = tag(headingLevel + 1);

  const groups: { direction: Direction; title: string }[] = [
    { direction: 'across', title: t.acrossPlural },
    { direction: 'down', title: t.downPlural }
  ];

  return (
    <div className={cn(css['clues'], addClass)}>
      <Heading className={css['clues__title']}>{t.clues}</Heading>

      {groups.map(({ direction, title }) => {
        const words = layout.words.filter((word) => word.direction === direction);
        if (!words.length) return null;

        return (
          <div key={direction}>
            <SubHeading className={css['clues__subtitle']}>{title}</SubHeading>
            <ul role="list" className={css['clues__list']}>
              {words.map((word) => {
                const mark = validation ? (wordResults[word.id] ? 'right' : 'wrong') : undefined;

                return (
                  <li key={word.id}>
                    <button
                      type="button"
                      className={css['clue']}
                      aria-current={activeWord?.id === word.id ? 'true' : undefined}
                      data-state={mark}
                      onClick={() => selectWord(word.id)}
                    >
                      <span className={css['clue__number']}>{word.number}</span>
                      <span className={css['clue__text']}>
                        {word.clue} <span aria-hidden="true">({word.lengthHint})</span>
                        <span className="u-sr-only">
                          , {word.lengthHint} {t.letters}
                        </span>
                      </span>
                      {mark ? (
                        <>
                          <span className={css['clue__mark']} aria-hidden="true">
                            {mark === 'right' ? '✔' : '✖'}
                          </span>
                          <span className="u-sr-only">, {t[mark]}</span>
                        </>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
};
