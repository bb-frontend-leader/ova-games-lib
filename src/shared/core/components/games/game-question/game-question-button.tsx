import { cloneElement } from "react";

import { useGameQuestionContext } from "./game-question-context";

interface Props {
  type?: "reset";
  children: React.ReactElement;
}

export const GameQuestionButton: React.FC<Props> = ({ type, children }) => {
  const { handleValidation, handleReset, button, validation, result } =
    useGameQuestionContext();

  return cloneElement(children, {
    ...children.props,
    disabled: type !== "reset" ? button : validation ? result : true,
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
      if (children.props.onClick) {
        children.props.onClick(event);
      }
      (type === "reset" ? handleReset : handleValidation)();
    },
  });
};
