import { useEffect, useId, useMemo } from "react";

import { RadioStates } from "./types/types";
import { BALL, RED } from "./const";
import { useRadioBasketActivityContext } from "./game-basketball-context";

import css from "./game-basketball.module.css";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  addClass?: string;
  label: string;
  state: RadioStates;
}

export const GameBasketballRadio: React.FC<Props> = ({
  id,
  addClass,
  state,
  label,
  name,
  ...props
}) => {
  const reactId = useId();
  const { validation, addRadioElementsId, addRadiosValues, result, options } =
    useRadioBasketActivityContext();

  const uid = id || reactId;
  const radioName = `radio-group-basket-${name}`;

  const safeSrc = (rawSrc: string): string => rawSrc.replace(/\s/g, ""); // Elimina espacios en blanco accidentales
  const letter = label.split(".")[0].toUpperCase();
  const option = label.split(".")[1].trim();

  // ✅ seleccionado sale del CONTEXTO
  const isSelected = useMemo(() => {
    return options?.some((opt) => opt.name === radioName && opt.id === uid);
  }, [options, radioName, uid]);

  /**
   * Maneja el evento onChange.
   */
  const handleChange = () => {
    addRadiosValues({ id: uid, name: radioName, state });
  };

  useEffect(() => {
    addRadioElementsId(uid); // Agrega este grupo de radios al contexto
  }, [uid, addRadioElementsId]);

  const getLabelClass = (state: "success" | "wrong") => {
    if (!validation || !isSelected) return css.button;
    return `${css.button} ${state === "success" ? css.success : css.wrong}`;
  };

  return (
    <div
      className={`${css.radio__option} ${validation ? css.disabled : ""} ${addClass ?? ""}`}
    >
      <div className={css.radio_red}>
        <img src={safeSrc(RED)} alt="Red para encestar" />
        <span>{letter}</span>

        {validation && isSelected && (
          <img
            src={safeSrc(BALL)}
            className={`${css.ball} ${result ? css.ball__success : css.ball__fail}`}
            alt="Balón"
          />
        )}
      </div>
      <div className={css.radio_button}>
        <input
          id={uid}
          type="radio"
          name={radioName}
          value={uid}
          disabled={validation}
          className={css.radioButton}
          checked={isSelected}
          onChange={handleChange}
          {...props}
        />
        <label
          htmlFor={uid}
          className={getLabelClass(state)}
          dangerouslySetInnerHTML={{ __html: option }}
        />
      </div>
    </div>
  );
};
