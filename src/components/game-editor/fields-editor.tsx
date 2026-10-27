import { useRef, useState } from 'react';

import { Button, Modal } from '@/components/ui';
import type { GameEditor } from '@/hooks';

import css from './game-editor.module.css';

/** Un elemento del juego: cada campo es un texto (la pista, la carta, el par de tarjetas…). */
export type FieldsItem = Record<string, string>;

export interface FieldDef {
  key: string;
  label: string;
  hint?: string;
  optional?: boolean;
  maxLength?: number;
  multiline?: boolean;
}

export interface FieldsConfig {
  /** Cómo se llama cada elemento, en femenino y singular: «pareja», «oración», «pista». */
  noun: string;
  min: number;
  max: number;
  fields: FieldDef[];
  /** Lo que el docente debe saber antes de escribir. */
  intro: React.ReactNode;
  /** Reglas propias del juego; devuelve el aviso o `null`. */
  validate?: (items: FieldsItem[]) => string | null;
}

interface DraftItem {
  key: number;
  values: FieldsItem;
}

interface Props {
  editor: GameEditor<FieldsItem[]>;
  config: FieldsConfig;
}

const FieldsForm: React.FC<Props> = ({ editor, config }) => {
  const counter = useRef(0);
  const nextKey = () => (counter.current += 1);

  const blank = () => Object.fromEntries(config.fields.map((field) => [field.key, '']));

  const [drafts, setDrafts] = useState<DraftItem[]>(() =>
    editor.content.map((values) => ({ key: nextKey(), values: { ...blank(), ...values } }))
  );
  const [error, setError] = useState('');

  const { noun } = config;
  const single = config.max === 1;
  const fixed = config.min === config.max;

  const setValue = (key: number, field: string, value: string) =>
    setDrafts((current) =>
      current.map((draft) => (draft.key === key ? { ...draft, values: { ...draft.values, [field]: value } } : draft))
    );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const next = drafts.map((draft) =>
      Object.fromEntries(Object.entries(draft.values).map(([key, value]) => [key, value.trim()]))
    );

    const problem = config.validate?.(next);
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
        <p>{config.intro}</p>
        <p className={css.hint}>
          {fixed
            ? `Este juego usa ${config.min} ${noun}${config.min === 1 ? '' : 's'}.`
            : `Este juego admite de ${config.min} a ${config.max} ${noun}s.`}
        </p>
      </div>

      <ol className={css.list}>
        {drafts.map((draft, index) => (
          <li key={draft.key} className={css.item}>
            <fieldset className={css.fieldset}>
              <legend className={css.legend}>
                {noun[0].toUpperCase() + noun.slice(1)} {index + 1}
              </legend>

              {config.fields.map((field) => {
                const id = `editor-${draft.key}-${field.key}`;
                const Control = field.multiline ? 'textarea' : 'input';

                return (
                  <div key={field.key} className={css.field}>
                    <label htmlFor={id} className={css.label}>
                      {field.label}
                      {field.optional && ' (opcional)'}
                    </label>
                    <Control
                      id={id}
                      className={css.control}
                      required={!field.optional}
                      maxLength={field.maxLength}
                      value={draft.values[field.key]}
                      onChange={(event) => setValue(draft.key, field.key, event.target.value)}
                      {...(field.multiline ? { rows: 2 } : { type: 'text' })}
                    />
                    {field.hint && <span className={css.hint}>{field.hint}</span>}
                  </div>
                );
              })}

              {!fixed && (
                <div className={css.row}>
                  <button
                    type="button"
                    className={css.textButton}
                    data-danger
                    disabled={drafts.length <= config.min}
                    onClick={() => setDrafts((current) => current.filter((item) => item.key !== draft.key))}
                  >
                    Quitar esta {noun}
                  </button>
                </div>
              )}
            </fieldset>
          </li>
        ))}
      </ol>

      {!fixed && (
        <button
          type="button"
          className={css.textButton}
          disabled={drafts.length >= config.max}
          onClick={() => setDrafts((current) => [...current, { key: nextKey(), values: blank() }])}
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

/** Ventana del editor para los juegos cuyo contenido no es «pregunta + respuestas» (oraciones, palabras, parejas, cartas). */
export const FieldsEditor: React.FC<Props> = ({ editor, config }) => (
  <Modal isOpen={editor.isOpen} onClose={editor.close} size="md" addClass={css.modal}>
    <div>{editor.isOpen && <FieldsForm editor={editor} config={config} />}</div>
  </Modal>
);
