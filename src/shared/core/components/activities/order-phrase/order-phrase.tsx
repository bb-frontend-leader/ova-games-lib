import { useEffect, useState } from 'react';
import { Row } from 'books-ui';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';

import { useOvaContext } from '@/context/ova-context';
import { Button } from '@/shared/ui/components';

import { i18n } from './const';
import { SortableItemPhrase } from './sortable-item-phrase';

import css from './order-phrase.module.css';

type CompletePhraseProps = {
  onResult: (isCorrect: boolean | null) => void;
  phrase: string[];
  initialOrder: string[];
};

export const OrderPhrase = ({ phrase, initialOrder, onResult }: CompletePhraseProps) => {
  const { lang } = useOvaContext();
  const [items, setItems] = useState<string[]>(initialOrder);
  const [isActive, setIsActive] = useState(true);
  const [hasMoved, setHasMoved] = useState(false);
  const [validated, setValidated] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    setItems(initialOrder);
    setHasMoved(false);
    setValidated(false);
  }, [initialOrder]);

  /**
   * Handles the drag end event, updating the items state with the new order
   * @param {DragEndEvent} event - The drag end event
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    setItems((prev) => {
      const oldIndex = prev.indexOf(active.id as string);
      const newIndex = prev.indexOf(over.id as string);
      const newItems = arrayMove(prev, oldIndex, newIndex);
      if (oldIndex !== newIndex && !hasMoved) {
        setHasMoved(true);
      }
      return newItems;
    });
  };

  /**
   * Checks if the current phrase matches the initial phrase, updating the activity state accordingly
   * If the phrase is correct, sets isActive to true and hasMoved to false, and calls onResult with the result
   * If the phrase is incorrect, sets isActive to false and hasMoved to false, and calls onResult with the result
   */
  const checkPhrase = () => {
    const isPhraseCorrect = items.every((word, index) => word.toLowerCase() === phrase[index].toLowerCase());
    setIsActive(isPhraseCorrect);
    setHasMoved(false);
    setValidated(true);
    onResult?.(isPhraseCorrect);
  };

  /**
   * Resets the activity state by setting the items to the initial order,
   *  setting isActive to true, and setting hasMoved and validated to false.
   */
  const handleResetActivity = () => {
    setItems(initialOrder);
    setIsActive(true);
    setHasMoved(false);
    setValidated(false);
  };

  return (
    <div className="u-flow">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={!validated ? handleDragEnd : undefined}>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className={css['sortable-phrase-container']}>
            {items.map((id, index) => {
              const isCorrect = validated && id.toLowerCase() === phrase[index].toLowerCase();
              return <SortableItemPhrase key={id} id={id} isCorrect={isCorrect} validated={validated} />;
            })}
          </div>
        </SortableContext>
      </DndContext>

      <Row justifyContent="center" alignItems="center" style={{ gap: '1rem' }}>
        <Button disabled={!hasMoved} label={i18n[lang as keyof typeof i18n].check} onClick={checkPhrase} />
        <Button disabled={isActive} label={i18n[lang as keyof typeof i18n].reset} onClick={handleResetActivity} />
      </Row>
    </div>
  );
};
