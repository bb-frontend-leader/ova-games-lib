/* eslint-disable @typescript-eslint/no-unused-vars */
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import css from './order-phrase.module.css';

interface SortableItemProps {
  id: string;
  isCorrect?: boolean;
  validated?: boolean;
}

export const SortableItemPhrase = ({ id, isCorrect, validated }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = validated
    ? {}
    : {
        transform: CSS.Transform.toString(transform),
        transition
      };

  const { tabIndex, ...restAttributes } = attributes;

  return (
    <div
      tabIndex={-1}
      style={style}
      ref={setNodeRef}
      {...restAttributes}
      {...(!validated && listeners)}
      className={`${css['sortable-item']} ${validated ? (isCorrect ? css['sortable-item-correct'] : css['sortable-item-incorrect']) : ''}`}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="#19578d">
        <path d="M12 2L8 6h3v5h2V6h3l-4-4zm0 20l4-4h-3v-5h-2v5H8l4 4zm10-10l-4-4v3h-5v2h5v3l4-4zM2 12l4 4v-3h5v-2H6V8l-4 4z" />
      </svg>
      <button disabled={validated} className={css['sortable-item-button']}>
        {id}
      </button>
    </div>
  );
};
