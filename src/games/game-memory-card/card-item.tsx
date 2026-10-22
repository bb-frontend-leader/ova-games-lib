import { Children, useEffect } from 'react';

import { useMemoryActivityContext } from './memory-card-context';

// Definimos los componentes por separado para poder usarlos como tipos de referencia
export const CardFront = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const CardBack = ({ children }: { children: React.ReactNode }) => <>{children}</>;

interface Props {
  id: number;
  children: React.ReactNode;
}

export const CardItem = ({ id, children }: Props) => {
  const { registerCard } = useMemoryActivityContext();

  useEffect(() => {
    const childrenArray = Children.toArray(children) as React.ReactElement[];

    // Ahora buscamos específicamente por el tipo de componente CardFront y CardBack
    const front = childrenArray.find((child) => child.type === CardFront);
    const back = childrenArray.find((child) => child.type === CardBack);

    if (front && back) {
      registerCard({
        id,
        frontContent: front,
        backContent: back
      });
    }
  }, [id, children, registerCard]);

  return null;
};

// Mantenemos las referencias antiguas por compatibilidad si fuera necesario
CardItem.Front = CardFront;
CardItem.Back = CardBack;
