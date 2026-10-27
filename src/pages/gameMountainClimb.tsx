import { useState } from 'react';

import type { EditableQuestion, QuestionLimits, ResultState } from '@/components';
import { GamePage, QuestionsEditor, ResultModals, Stage, useQuestionsEditor } from '@/components';
import { Panel } from '@/components/ui';
import { GameMountainClimb } from '@/games/game-mountain-climb';

const DEFAULT_QUESTIONS: EditableQuestion[] = [
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

const LIMITS: QuestionLimits = {
  minQuestions: 6,
  maxQuestions: 10,
  minAnswers: 3,
  maxAnswers: 4
};

export default function GameMountainClimbPage() {
  const editor = useQuestionsEditor(DEFAULT_QUESTIONS, 'mountain');
  const QUESTIONS = editor.questions;
  const [feedback, setFeedback] = useState<ResultState>(null);

  const handleResult = ({ result }: { result: boolean }) => setFeedback(result ? 'success' : 'wrong');

  return (
    <GamePage
      link="/juegos/escalada"
      editor={editor}
      editorDialog={<QuestionsEditor editor={editor} limits={LIMITS} />}
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
            <strong>Cantidad de preguntas:</strong> mínimo 6, máximo 10. Con menos de 6 no alcanza a haber campamentos;
            al caer se repiten preguntas, así que conviene tener un buen banco.
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
