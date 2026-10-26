import { useState } from 'react';

import type { ResultState } from '@/components';
import { GamePage, ResultModals, Stage } from '@/components';
import { Panel } from '@/components/ui';
import type { ParquesQuestion } from '@/games/game-parques';
import { GameParques } from '@/games/game-parques';

const QUESTIONS: ParquesQuestion[] = [
  {
    id: 'parques-1',
    question: '¿Qué necesitan las plantas para crecer?',
    answers: [
      { label: 'Agua y luz', state: 'success' },
      { label: 'Solo oscuridad', state: 'wrong' },
      { label: 'Plástico', state: 'wrong' }
    ]
  },
  {
    id: 'parques-2',
    question: '¿Cuántas patas tiene una araña?',
    answers: [
      { label: 'Ocho', state: 'success' },
      { label: 'Seis', state: 'wrong' },
      { label: 'Cuatro', state: 'wrong' }
    ]
  },
  {
    id: 'parques-3',
    question: '¿En qué continente está Colombia?',
    answers: [
      { label: 'América', state: 'success' },
      { label: 'Europa', state: 'wrong' },
      { label: 'Asia', state: 'wrong' }
    ]
  },
  {
    id: 'parques-4',
    question: '¿Cuál es el océano más grande del mundo?',
    answers: [
      { label: 'Pacífico', state: 'success' },
      { label: 'Atlántico', state: 'wrong' },
      { label: 'Índico', state: 'wrong' }
    ]
  },
  {
    id: 'parques-5',
    question: '¿Cuánto es 5 + 3?',
    answers: [
      { label: '8', state: 'success' },
      { label: '7', state: 'wrong' },
      { label: '9', state: 'wrong' }
    ]
  }
];

export default function GameParquesPage() {
  const [feedback, setFeedback] = useState<ResultState>(null);

  const handleResult = ({ result }: { result: boolean }) => setFeedback(result ? 'success' : 'wrong');

  return (
    <GamePage
      link="/juegos/parques"
      description={
        <>
          <p>
            Un parqués donde el estudiante juega con las fichas amarillas contra un rival que mueve solo (las rojas).
            Cada pregunta acertada da una tirada de dos dados.
          </p>
          <p>
            Las fichas empiezan en la cárcel: un 5 deja salir una. Caer sobre una ficha rival fuera de un seguro la
            captura, y un par da otra tirada sin pregunta.
          </p>
        </>
      }
      correct={
        <ul>
          <li>Se gana una tirada de dos dados.</li>
          <li>El estudiante mueve una ficha por el circuito.</li>
          <li>Se abre el modal de acierto.</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>La respuesta elegida queda descartada.</li>
          <li>Sin acierto no hay tirada: hay que reintentar.</li>
          <li>Se abre el modal de error.</li>
        </ul>
      }
      recommendations={
        <ul>
          <li>
            La partida termina cuando <strong>todas las preguntas están acertadas</strong>: gana quien tenga sus fichas
            más cerca del cielo.
          </li>
          <li>Es un juego largo: usa 5 a 8 preguntas.</li>
          <li>
            Un estudiante que aún no conoce el parqués necesita leer con calma las reglas de la pantalla de inicio.
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
            <GameParques.Init textInit="Responde bien para lanzar los dados y llevar tus fichas hasta el cielo antes que tu rival." />
          </Stage>
        </Panel.Section>

        <Panel.Section>
          <Stage size="wide">
            <GameParques questions={QUESTIONS} onResult={handleResult} />
          </Stage>
        </Panel.Section>
      </Panel>

      <ResultModals
        open={feedback}
        onClose={() => setFeedback(null)}
        success="¡Correcto! Ganaste una tirada de dados: ¡mueve tus fichas!"
        wrong="Esa no es la respuesta. La opción queda descartada: ¡inténtalo de nuevo para ganar la tirada!"
      />
    </GamePage>
  );
}
