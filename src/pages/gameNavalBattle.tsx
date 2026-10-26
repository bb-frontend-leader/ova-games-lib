import { useState } from 'react';

import type { ResultState } from '@/components';
import { GamePage, ResultModals, Stage } from '@/components';
import { Panel } from '@/components/ui';
import type { NavalQuestion } from '@/games/game-naval-battle';
import { GameNavalBattle } from '@/games/game-naval-battle';

const QUESTIONS: NavalQuestion[] = [
  {
    id: 'naval-1',
    question: '¿Qué día viene después del martes?',
    answers: [
      { label: 'Miércoles', state: 'success' },
      { label: 'Jueves', state: 'wrong' },
      { label: 'Lunes', state: 'wrong' }
    ]
  },
  {
    id: 'naval-2',
    question: '¿Cuál es el planeta más cercano al Sol?',
    answers: [
      { label: 'Mercurio', state: 'success' },
      { label: 'Venus', state: 'wrong' },
      { label: 'Tierra', state: 'wrong' }
    ]
  },
  {
    id: 'naval-3',
    question: '¿Cuánto es 100 ÷ 4?',
    answers: [
      { label: '25', state: 'success' },
      { label: '20', state: 'wrong' },
      { label: '40', state: 'wrong' }
    ]
  },
  {
    id: 'naval-4',
    question: '¿Cuál es el ingrediente principal del pan?',
    answers: [
      { label: 'Harina', state: 'success' },
      { label: 'Azúcar', state: 'wrong' },
      { label: 'Leche', state: 'wrong' }
    ]
  },
  {
    id: 'naval-5',
    question: '¿Cuántas patas tiene una araña?',
    answers: [
      { label: 'Ocho', state: 'success' },
      { label: 'Seis', state: 'wrong' },
      { label: 'Cuatro', state: 'wrong' }
    ]
  },
  {
    id: 'naval-6',
    question: '¿Qué instrumento tiene teclas blancas y negras?',
    answers: [
      { label: 'Piano', state: 'success' },
      { label: 'Guitarra', state: 'wrong' },
      { label: 'Flauta', state: 'wrong' }
    ]
  }
];

export default function GameNavalBattlePage() {
  const [feedback, setFeedback] = useState<ResultState>(null);

  const handleResult = ({ result }: { result: boolean }) => setFeedback(result ? 'success' : 'wrong');

  return (
    <GamePage
      link="/juegos/batalla-naval"
      description={
        <>
          <p>
            Una flota enemiga se esconde en un mar cuadriculado. Cada respuesta correcta da un disparo: el estudiante
            elige una casilla del mar y dispara. Si toca un barco dispara otra vez; si es agua, pasa a la siguiente
            pregunta.
          </p>
          <p>
            Cada tres aciertos seguidos gana una carga de sonar, que dice cuántos barcos hay cerca de una casilla sin
            gastar el disparo. El juego empieza con una pantalla de inicio con las reglas.
          </p>
        </>
      }
      correct={
        <ul>
          <li>Se gana un disparo.</li>
          <li>Tocar un barco da otro disparo; hundirlo da puntos extra.</li>
          <li>Se abre el modal de acierto.</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>La respuesta elegida queda descartada.</li>
          <li>Sin acierto no hay disparo.</li>
          <li>Se abre el modal de error.</li>
        </ul>
      }
      recommendations={
        <ul>
          <li>
            <strong>Cantidad de preguntas:</strong> mínimo 5, máximo 8. Con 5 a 8 la partida dura lo justo.
          </li>
          <li>
            <strong>Cada pregunta:</strong> un enunciado corto y claro, que se pueda responder sin ayuda externa.
          </li>
          <li>
            <strong>Respuestas:</strong> 3 o 4 respuestas por pregunta, con <strong>una sola correcta</strong>{' '}
            (márcala). Escríbelas cortas, de longitud parecida y sin repetirlas.
          </li>
          <li>
            <strong>Envíanoslo así:</strong>
            <pre>{`Pregunta 1: ¿Cuál es la capital de Francia?
A) París (correcta)
B) Roma
C) Madrid

Pregunta 2: ...`}</pre>
          </li>
        </ul>
      }
    >
      <Panel>
        <Panel.Section>
          <Stage center>
            <GameNavalBattle.Init textInit="Una flota enemiga se esconde en el mar. Acierta las preguntas para ganar disparos y hundirla." />
          </Stage>
        </Panel.Section>

        <Panel.Section>
          <Stage size="wide">
            <GameNavalBattle questions={QUESTIONS} onResult={handleResult} />
          </Stage>
        </Panel.Section>
      </Panel>

      <ResultModals
        open={feedback}
        onClose={() => setFeedback(null)}
        success="¡Correcto! Ganaste un disparo: elige una casilla del mar."
        wrong="Esa no es la respuesta. La opción queda descartada: ¡inténtalo de nuevo para ganar el disparo!"
      />
    </GamePage>
  );
}
