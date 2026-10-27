import { useId, useRef, useState } from 'react';

import { Button, Modal } from '@/components/ui';
import type { GameEditor } from '@/hooks';

import type { EditableQuestion, QuestionLimits } from './use-questions-editor';

import css from './game-editor.module.css';

interface DraftQuestion {
  key: number;
  question: string;
  category: string;
  explanation: string;
  answers: { key: number; label: string }[];
  /** Posición de la respuesta correcta. */
  correct: number;
}

interface FormProps {
  editor: GameEditor<EditableQuestion[]>;
  limits: QuestionLimits;
}

const toDrafts = (questions: EditableQuestion[], nextKey: () => number): DraftQuestion[] =>
  questions.map((item) => ({
    key: nextKey(),
    question: item.question,
    category: item.category ?? '',
    explanation: item.explanation ?? '',
    answers: item.answers.map((answer) => ({ key: nextKey(), label: answer.label })),
    correct: Math.max(
      0,
      item.answers.findIndex((answer) => answer.state === 'success')
    )
  }));

const blankDraft = (limits: QuestionLimits, nextKey: () => number): DraftQuestion => ({
  key: nextKey(),
  question: '',
  category: '',
  explanation: '',
  answers: Array.from({ length: limits.minAnswers }, () => ({ key: nextKey(), label: '' })),
  correct: 0
});

const QuestionsForm: React.FC<FormProps> = ({ editor, limits }) => {
  const counter = useRef(0);
  const nextKey = () => (counter.current += 1);

  const [drafts, setDrafts] = useState(() => toDrafts(editor.content, nextKey));
  const [error, setError] = useState('');

  const noun = limits.noun ?? 'pregunta';
  const listId = useId();
  const categories = [...new Set(drafts.map((draft) => draft.category.trim()).filter(Boolean))];
  const single = limits.maxQuestions === 1;

  const patch = (key: number, change: Partial<DraftQuestion>) =>
    setDrafts((current) => current.map((draft) => (draft.key === key ? { ...draft, ...change } : draft)));

  const setAnswer = (draft: DraftQuestion, answerKey: number, label: string) =>
    patch(draft.key, {
      answers: draft.answers.map((answer) => (answer.key === answerKey ? { ...answer, label } : answer))
    });

  const addAnswer = (draft: DraftQuestion) =>
    patch(draft.key, { answers: [...draft.answers, { key: nextKey(), label: '' }] });

  const removeAnswer = (draft: DraftQuestion, index: number) => {
    const answers = draft.answers.filter((_, i) => i !== index);
    // Si se quita la correcta, la marcada pasa a ser la primera.
    const correct = index === draft.correct ? 0 : index < draft.correct ? draft.correct - 1 : draft.correct;
    patch(draft.key, { answers, correct });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    for (const [index, draft] of drafts.entries()) {
      const labels = draft.answers.map((answer) => answer.label.trim().toLowerCase());
      if (new Set(labels).size !== labels.length) {
        setError(`En la ${noun} ${index + 1} hay respuestas repetidas: cada una debe ser distinta.`);
        return;
      }
    }

    const next: EditableQuestion[] = drafts.map((draft) => ({
      question: draft.question.trim(),
      ...(limits.category && { category: draft.category.trim() }),
      ...(limits.explanation && { explanation: draft.explanation.trim() }),
      answers: draft.answers.map((answer, index) => ({
        label: answer.label.trim(),
        state: index === draft.correct ? 'success' : 'wrong'
      }))
    }));

    const problem = limits.validate?.(next);
    if (problem) {
      setError(problem);
      return;
    }

    setError('');
    editor.apply(next);
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.intro}>
        <h2 className={css.title}>{single ? `Escribe tu ${noun}` : `Escribe tus ${noun}s`}</h2>
        <p>
          Marca con el círculo la respuesta <strong>correcta</strong> de cada {noun}. Al pulsar «Ver en el juego» el
          juego se reinicia con lo que escribiste, para que veas cómo se ven {single ? `tu ${noun}` : `tus ${noun}s`} y
          sus opciones.
        </p>
        <p className={css.hint}>
          {limits.note ??
            `${
              single
                ? `Este juego usa 1 ${noun}`
                : `Este juego admite de ${limits.minQuestions} a ${limits.maxQuestions} ${noun}s`
            } y de ${limits.minAnswers} a ${limits.maxAnswers} respuestas por ${noun}.`}
        </p>
      </div>

      {limits.category && (
        <datalist id={`${listId}-categories`}>
          {categories.map((category) => (
            <option key={category} value={category} />
          ))}
        </datalist>
      )}

      <ol className={css.list}>
        {drafts.map((draft, index) => {
          const idBase = `editor-${draft.key}`;

          return (
            <li key={draft.key} className={css.item}>
              <fieldset className={css.fieldset}>
                <legend className={css.legend}>
                  {noun[0].toUpperCase() + noun.slice(1)} {index + 1}
                </legend>

                <div className={css.field}>
                  <label htmlFor={`${idBase}-question`} className={css.label}>
                    Enunciado
                  </label>
                  <textarea
                    id={`${idBase}-question`}
                    className={css.control}
                    rows={2}
                    required
                    value={draft.question}
                    onChange={(event) => patch(draft.key, { question: event.target.value })}
                  />
                </div>

                {limits.category && (
                  <div className={css.field}>
                    <label htmlFor={`${idBase}-category`} className={css.label}>
                      {limits.categoryLabel ?? 'Tema (una palabra)'}
                    </label>
                    <input
                      id={`${idBase}-category`}
                      className={css.control}
                      type="text"
                      required={Boolean(limits.categoryLabel)}
                      maxLength={limits.categoryMaxLength ?? 16}
                      list={`${listId}-categories`}
                      value={draft.category}
                      onChange={(event) => patch(draft.key, { category: event.target.value })}
                    />
                  </div>
                )}

                {limits.explanation && (
                  <div className={css.field}>
                    <label htmlFor={`${idBase}-explanation`} className={css.label}>
                      Explicación al acertar (opcional)
                    </label>
                    <textarea
                      id={`${idBase}-explanation`}
                      className={css.control}
                      rows={2}
                      value={draft.explanation}
                      onChange={(event) => patch(draft.key, { explanation: event.target.value })}
                    />
                  </div>
                )}

                <div className={css.answers} role="radiogroup" aria-label={`Respuestas de la ${noun} ${index + 1}`}>
                  {draft.answers.map((answer, answerIndex) => (
                    <div key={answer.key} className={css.answer}>
                      <input
                        type="radio"
                        className={css.radio}
                        name={`${idBase}-correct`}
                        checked={draft.correct === answerIndex}
                        onChange={() => patch(draft.key, { correct: answerIndex })}
                        aria-label={`Marcar la respuesta ${answerIndex + 1} como correcta`}
                      />
                      <input
                        type="text"
                        className={css.control}
                        required
                        value={answer.label}
                        placeholder={`Respuesta ${answerIndex + 1}`}
                        aria-label={`Respuesta ${answerIndex + 1}`}
                        onChange={(event) => setAnswer(draft, answer.key, event.target.value)}
                      />
                      <button
                        type="button"
                        className={css.iconButton}
                        disabled={draft.answers.length <= limits.minAnswers}
                        aria-label={`Quitar la respuesta ${answerIndex + 1}`}
                        onClick={() => removeAnswer(draft, answerIndex)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <div className={css.row}>
                  <button
                    type="button"
                    className={css.textButton}
                    disabled={draft.answers.length >= limits.maxAnswers}
                    onClick={() => addAnswer(draft)}
                  >
                    + Agregar respuesta
                  </button>
                  {!single && (
                    <button
                      type="button"
                      className={css.textButton}
                      data-danger
                      disabled={drafts.length <= limits.minQuestions}
                      onClick={() => setDrafts((current) => current.filter((item) => item.key !== draft.key))}
                    >
                      Quitar esta {noun}
                    </button>
                  )}
                </div>
              </fieldset>
            </li>
          );
        })}
      </ol>

      {!single && (
        <button
          type="button"
          className={css.textButton}
          disabled={drafts.length >= limits.maxQuestions}
          onClick={() => setDrafts((current) => [...current, blankDraft(limits, nextKey)])}
        >
          + Agregar {noun}
        </button>
      )}

      {error && (
        <p className={css.error} role="alert">
          {error}
        </p>
      )}

      <div className={css.footer}>
        <Button label="Ver en el juego" type="submit" />
        <Button label="Cancelar" variant="outline" onClick={editor.close} />
        {editor.customized && <Button label="Volver al ejemplo" variant="outline" onClick={editor.reset} />}
      </div>
    </form>
  );
};

interface Props {
  editor: GameEditor<EditableQuestion[]>;
  limits: QuestionLimits;
}

/** Ventana donde el docente escribe sus preguntas y respuestas para verlas dentro del juego. */
export const QuestionsEditor: React.FC<Props> = ({ editor, limits }) => (
  <Modal isOpen={editor.isOpen} onClose={editor.close} size="md" addClass={css.modal}>
    <div>{editor.isOpen && <QuestionsForm editor={editor} limits={limits} />}</div>
  </Modal>
);
