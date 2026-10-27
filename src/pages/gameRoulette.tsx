import { useState } from 'react';

import type { EditableQuestion, QuestionLimits, ResultState } from '@/components';
import { GamePage, QuestionsEditor, ResultModals, Stage, useQuestionsEditor } from '@/components';
import { Panel } from '@/components/ui';
import { GameRoulette } from '@/games/game-roulette';

const DEFAULT_QUESTIONS: EditableQuestion[] = [
  {
    id: 'roulette-1',
    category: 'Geografía',
    question: '¿Cuál es el océano más grande del mundo?',
    answers: [
      { label: 'Océano Pacífico', state: 'success' },
      { label: 'Océano Atlántico', state: 'wrong' },
      { label: 'Océano Índico', state: 'wrong' }
    ]
  },
  {
    id: 'roulette-2',
    category: 'Matemáticas',
    question: '¿Cuánto es 6 × 7?',
    answers: [
      { label: '42', state: 'success' },
      { label: '36', state: 'wrong' },
      { label: '48', state: 'wrong' }
    ]
  },
  {
    id: 'roulette-3',
    category: 'Animales',
    question: '¿Cuál es el animal terrestre más alto?',
    answers: [
      { label: 'Jirafa', state: 'success' },
      { label: 'Elefante', state: 'wrong' },
      { label: 'Caballo', state: 'wrong' }
    ]
  },
  {
    id: 'roulette-4',
    category: 'Geografía',
    question: '¿En qué continente está Colombia?',
    answers: [
      { label: 'América', state: 'success' },
      { label: 'Europa', state: 'wrong' },
      { label: 'África', state: 'wrong' }
    ]
  },
  {
    id: 'roulette-5',
    category: 'Lengua',
    question: '¿Cuál de estas palabras es un sustantivo?',
    answers: [
      { label: 'Mesa', state: 'success' },
      { label: 'Correr', state: 'wrong' },
      { label: 'Rápido', state: 'wrong' }
    ]
  },
  {
    id: 'roulette-6',
    category: 'Ciencias',
    question: '¿Cuántos planetas tiene el sistema solar?',
    answers: [
      { label: 'Ocho', state: 'success' },
      { label: 'Seis', state: 'wrong' },
      { label: 'Diez', state: 'wrong' }
    ]
  }
];

const LIMITS: QuestionLimits = {
  minQuestions: 6,
  maxQuestions: 16,
  minAnswers: 3,
  maxAnswers: 4,
  category: true
};

export default function GameRoulettePage() {
  const editor = useQuestionsEditor(DEFAULT_QUESTIONS, 'roulette');
  const QUESTIONS = editor.questions;
  const [feedback, setFeedback] = useState<ResultState>(null);

  const handleResult = ({ result }: { result: boolean }) => setFeedback(result ? 'success' : 'wrong');

  return (
    <GamePage
      link="/juegos/ruleta"
      editor={editor}
      editorDialog={<QuestionsEditor editor={editor} limits={LIMITS} />}
      description={
        <>
          <p>
            Una ruleta con una casilla por cada pregunta. El estudiante la gira, la ruleta elige una casilla al azar y
            debe responder la pregunta que le toque.
          </p>
          <p>
            Hay casillas especiales: un comodín 50:50 que elimina respuestas incorrectas y un «Doble» que hace valer el
            doble la próxima pregunta. El juego empieza con una pantalla de inicio con las reglas.
          </p>
        </>
      }
      correct={
        <ul>
          <li>La casilla se cierra y suma puntos.</li>
          <li>Las rachas de aciertos seguidos dan puntos extra.</li>
          <li>Se abre el modal de acierto.</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>La casilla vuelve a la ruleta y la respuesta elegida queda descartada.</li>
          <li>La próxima vez que salga, la pregunta vale menos.</li>
          <li>Se abre el modal de error.</li>
        </ul>
      }
      recommendations={
        <ul>
          <li>
            <strong>Cantidad de preguntas:</strong> mínimo 6, máximo 16. Lo recomendado es de 6 a 10; con más de 16 el
            texto no cabe en la ruleta.
          </li>
          <li>
            <strong>Cada pregunta:</strong> un enunciado corto y claro, que se pueda responder sin ayuda externa.
          </li>
          <li>
            <strong>Respuestas:</strong> 3 o 4 respuestas por pregunta, con <strong>una sola correcta</strong>{' '}
            (márcala). Escríbelas cortas, de longitud parecida y sin repetirlas.
          </li>
          <li>
            <strong>Tema:</strong> una palabra por pregunta (ej. «Geografía»): aparece sobre su casilla en la ruleta.
          </li>
          <li>
            <strong>Envíanoslo así:</strong>
            <pre>{`Pregunta 1 — Tema: Geografía
¿Cuál es la capital de Francia?
A) París (correcta)
B) Roma
C) Madrid

Pregunta 2 — Tema: ...`}</pre>
          </li>
        </ul>
      }
    >
      <Panel>
        <Panel.Section>
          <Stage center>
            <GameRoulette.Init textInit="Gira la ruleta y responde la pregunta que te toque. ¡Los comodines y las rachas suman puntos!" />
          </Stage>
        </Panel.Section>

        <Panel.Section>
          <Stage size="wide">
            <GameRoulette questions={QUESTIONS} onResult={handleResult} />
          </Stage>
        </Panel.Section>
      </Panel>

      <ResultModals
        open={feedback}
        onClose={() => setFeedback(null)}
        success="¡Correcto! Esa casilla queda cerrada y suma puntos."
        wrong="Esa no es la respuesta. La casilla vuelve a la ruleta: ¡gira y vuelve a intentarlo!"
      />
    </GamePage>
  );
}
