import type { FC } from 'react';
import { useEffect, useReducer, useRef } from 'react';

import { useLang } from '@/hooks';

import { i18n } from './lib/constant';
import { findLink, freeSlot, getOptionName, slotLetter } from './lib/utils';
import { RelationConceptActivityProvider } from './relation-concept-activity-context';
import { RelationConceptButton } from './relation-concept-button';
import { RelationConceptCard } from './relation-concept-card';
import { RelationConceptFeedback } from './relation-concept-feedback';

import type { InitialState, OnResultData, Option, ResolvedOption } from './types/types';

const INITIAL_STATE: InitialState = {
  validation: false,
  result: false,
  pending: null,
  links: [],
  locked: [],
  announcement: ''
};

interface Props {
  children: JSX.Element | JSX.Element[];
  onResult?: (data: OnResultData) => void;
  /** Dos tarjetas forman una pareja cuando comparten el mismo `pair`. */
  pairs: Option[];
}

type SubComponents = {
  Card: typeof RelationConceptCard;
  Button: typeof RelationConceptButton;
  Feedback: typeof RelationConceptFeedback;
};

/**
 * Relaciona tarjetas de dos en dos. Vincular es un borrador: dos clics unen dos tarjetas (se puede deshacer con
 * otro clic) y el veredicto llega solo con "Comprobar", cuando todas están vinculadas. Al reintentar se conservan
 * las parejas correctas y se sueltan las incorrectas.
 */
const RelationConcept: FC<Props> & SubComponents = ({ children, onResult, pairs }) => {
  const lang = useLang();
  const t = i18n[lang];

  const [activity, updateActivity] = useReducer(
    (prev: InitialState, next: Partial<InitialState>) => ({ ...prev, ...next }),
    INITIAL_STATE
  );

  // Tarjeta que recibe el foco tras reintentar: Reintentar se deshabilita y, sin esto, el foco se perdería.
  const focusAfterRetry = useRef<string | null>(null);

  useEffect(() => {
    if (activity.validation || !focusAfterRetry.current) return;

    document.getElementById(focusAfterRetry.current)?.focus();
    focusAfterRetry.current = null;
  }, [activity.validation, activity.locked]);

  const total = pairs.length / 2;
  const allLinked = pairs.length > 0 && activity.links.length * 2 + activity.locked.length >= pairs.length;
  const button = activity.validation || !allLinked;

  const nameOf = (option: Option) => getOptionName(option, t.image);

  /**
   * Un clic sobre una tarjeta:
   * - vinculada → deshace su vínculo;
   * - sin nada seleccionado → la selecciona;
   * - la misma que está seleccionada → cancela la selección;
   * - otra → forma un vínculo con la seleccionada.
   * @param option - Tarjeta pulsada.
   */
  const selectCard = (option: Option) => {
    const { pending, links, locked, validation } = activity;

    if (validation || locked.some(({ id }) => id === option.id)) return;

    const link = findLink(links, option.id);

    if (link) {
      updateActivity({
        links: links.filter((item) => item !== link),
        announcement: t.unlinked(slotLetter(link.slot))
      });
      return;
    }

    if (!pending) {
      updateActivity({ pending: option, announcement: t.selected(nameOf(option)) });
      return;
    }

    if (pending.id === option.id) {
      updateActivity({ pending: null, announcement: t.cancelled });
      return;
    }

    const newLink = { slot: freeSlot(links), first: pending, second: option };
    const nextLinks = [...links, newLink];
    const ready = nextLinks.length * 2 + locked.length >= pairs.length;
    const linked = t.linked(nameOf(pending), nameOf(option), slotLetter(newLink.slot));

    updateActivity({ pending: null, links: nextLinks, announcement: ready ? `${linked} ${t.ready}` : linked });
  };

  const cancelSelection = () => {
    if (activity.pending) updateActivity({ pending: null, announcement: t.cancelled });
  };

  /**
   * Comprueba todos los vínculos a la vez y llama a `onResult`.
   */
  const handleValidation = () => {
    const links = activity.links.map((link) => ({ ...link, correct: link.first.pair === link.second.pair }));
    const correctCount = links.filter(({ correct }) => correct).length + activity.locked.length / 2;
    const result = correctCount === total;

    const options: ResolvedOption[] = [
      ...activity.locked,
      ...links.flatMap(({ first, second, correct }) =>
        [first, second].map((option) => (correct ? option : { ...option, isIncorrect: true }))
      )
    ];

    updateActivity({ validation: true, result, links, announcement: t.summary(correctCount, total) });

    onResult?.({ result, options, correctCount, total });
  };

  /**
   * Reintentar: las parejas correctas se conservan (bloqueadas) y se sueltan las incorrectas.
   */
  const handleReset = () => {
    const kept = activity.links.filter(({ correct }) => correct).flatMap(({ first, second }) => [first, second]);
    const locked = [...activity.locked, ...kept];

    focusAfterRetry.current = pairs.find(({ id }) => !locked.some((card) => card.id === id))?.id ?? null;

    updateActivity({
      validation: false,
      result: false,
      pending: null,
      links: [],
      locked,
      announcement: t.retry(pairs.length - locked.length)
    });
  };

  return (
    <RelationConceptActivityProvider
      value={{
        selectCard,
        cancelSelection,
        handleValidation,
        handleReset,
        pending: activity.pending,
        links: activity.links,
        locked: activity.locked,
        validation: activity.validation,
        button,
        result: activity.result,
        announcement: activity.announcement,
        pairs
      }}
    >
      {children}
    </RelationConceptActivityProvider>
  );
};

RelationConcept.Card = RelationConceptCard;
RelationConcept.Button = RelationConceptButton;
RelationConcept.Feedback = RelationConceptFeedback;

export { RelationConcept };
