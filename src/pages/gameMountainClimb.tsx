import { useState } from 'react';

import type { ResultState } from '@/components';
import { GamePage, ResultModals, Stage } from '@/components';
import { Panel } from '@/components/ui';
import type { MountainQuestion } from '@/games/game-mountain-climb';
import { GameMountainClimb } from '@/games/game-mountain-climb';

const QUESTIONS: MountainQuestion[] = [
  {
    id: 'mountain-1',
    question: '¿De qué color es el cielo en un día despejado?',
    answers: [
      { label: 'Azul', state: 'success' },
      { label: 'Verde', state: 'wrong' },
      { label: 'Rojo', state: 'wrong' }
    ]
  },
  {
    id: 'mountain-2',
    question: '¿Cuántos meses tiene un año?',
    answers: [
      { label: 'Doce', state: 'success' },
      { label: 'Diez', state: 'wrong' },
      { label: 'Catorce', state: 'wrong' }
    ]
  },
  {
    id: 'mountain-3',
    question: '¿Qué necesitan las plantas para crecer?',
    answers: [
      { label: 'Agua y luz', state: 'success' },
      { label: 'Solo oscuridad', state: 'wrong' },
      { label: 'Plástico', state: 'wrong' }
    ]
  },
  {
    id: 'mountain-4',
    question: '¿Cuántas patas tiene una araña?',
    answers: [
      { label: 'Ocho', state: 'success' },
      { label: 'Seis', state: 'wrong' },
      { label: 'Cuatro', state: 'wrong' }
    ]
  },
  {
    id: 'mountain-5',
    question: '¿En qué continente está Colombia?',
    answers: [
      { label: 'América', state: 'success' },
      { label: 'Europa', state: 'wrong' },
      { label: 'Asia', state: 'wrong' }
    ]
  },
  {
    id: 'mountain-6',
    question: '¿Cuál es el océano más grande del mundo?',
    answers: [
      { label: 'Pacífico', state: 'success' },
      { label: 'Atlántico', state: 'wrong' },
      { label: 'Índico', state: 'wrong' }
    ]
  }
];

export default function GameMountainClimbPage() {
  const [feedback, setFeedback] = useState<ResultState>(null);

  const handleResult = ({ result }: { result: boolean }) => setFeedback(result ? 'success' : 'wrong');

  return (
    <GamePage
      link="/juegos/escalada"
      description={
        <>
          <p>
            Un sendero que sube por una montaña hasta la cumbre. Cada pregunta acertada sube un tramo y cada tres tramos
            hay un campamento para recuperar fuerzas y ganar un bonus.
          </p>
          <p>
            El estudiante tiene tres fuerzas: cada fallo gasta una. Si se quedan en cero, se cae hasta el último
            campamento y debe contestar de nuevo las preguntas de los tramos perdidos.
          </p>
        </>
      }
      correct={
        <ul>
          <li>El escalador sube un tramo.</li>
          <li>Cada tres tramos llega a un campamento: recupera las fuerzas y gana un bonus.</li>
          <li>Se abre el modal de acierto.</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>La respuesta elegida queda descartada y se gasta una fuerza.</li>
          <li>Sin fuerzas, se cae hasta el último campamento.</li>
          <li>Se abre el modal de error.</li>
        </ul>
      }
      recommendations={
        <ul>
          <li>
            Termina al <strong>llegar a la cumbre</strong>, es decir, cuando todas las preguntas están acertadas.
          </li>
          <li>Usa 6 o más preguntas: con menos no alcanza a haber campamentos.</li>
          <li>Cada tres aciertos seguidos se recupera una fuerza.</li>
          <li>
            Las preguntas de los tramos perdidos en una caída se repiten: conviene tener un buen banco de preguntas.
          </li>
          <li>
            Usa 3 o 4 opciones por pregunta, con un <code>id</code> único y estable.
          </li>
        </ul>
      }
    >
      <Panel>
        <Panel.Section>
          <Stage center>
            <GameMountainClimb.Init textInit="Responde bien para subir el sendero, descansa en los campamentos y llega a la cumbre." />
          </Stage>
        </Panel.Section>

        <Panel.Section>
          <Stage size="wide">
            <GameMountainClimb questions={QUESTIONS} onResult={handleResult} />
          </Stage>
        </Panel.Section>
      </Panel>

      <ResultModals
        open={feedback}
        onClose={() => setFeedback(null)}
        success="¡Correcto! Subes un tramo del sendero: ¡sigue hacia la cumbre!"
        wrong="Esa no es la respuesta. Pierdes una fuerza y la opción queda descartada: ¡inténtalo de nuevo!"
      />
    </GamePage>
  );
}
