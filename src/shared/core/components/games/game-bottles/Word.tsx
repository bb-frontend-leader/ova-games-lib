

import { CorrectIcon, WrongIcon } from './icons_/icons';
import { useGameBottle } from './useGameBottle';

import css from './styles/level.module.css';

export const Word = () => {
  const { spaces, removeLetter, setSelectIndex, selectIndex, openModal, PARCIAL_WORD } = useGameBottle();
  return (
    <div className={`${css.container_word} `}>
      <p aria-live="assertive" className="u-sr-only">
        {`palabra armada ${PARCIAL_WORD}`}
      </p>
      {openModal ? (
        openModal === "wrong" ? (
          <WrongIcon />
        ) : (
          <CorrectIcon />
        )
      ) : null}

      {spaces[selectIndex] && openModal === null && (
        <button
          className={css.cancel_button}
          onClick={removeLetter}
          aria-label="eliminar palabra seleccionada"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#EA3323"
          >
            <path d="M296-270h75l107-164 108 164h78L519-488l133-202h-75l-98 152-98-152h-77l135 203-143 217zm28 158.5Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5zM480-160q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160zm0-320z" />
          </svg>
        </button>
      )}
      {spaces.map((obj, i) => (
        <button
          key={obj?.index || i}
          disabled={!!openModal}
          className={selectIndex === i ? css.select : undefined}
          onClick={() => setSelectIndex(i)}
        >
          {obj?.letter || "_"}
        </button>
      ))}
    </div>
  );
};
