import { useState } from 'react';

import { GameActions, GamePage, ResultModals, Stage } from '@/components';
import { Button, Panel } from '@/components/ui';
import { GameFish } from '@/games/game-fish';

type Answer = { label: string; state: 'success' | 'wrong' };

const QUESTIONS: { label: string; answers: Answer[]; explanation: string }[] = [
  {
    label: '¿Cuál de estos animales es un mamífero?',
    answers: [
      { label: 'Tiburón', state: 'wrong' },
      { label: 'Delfín', state: 'success' },
      { label: 'Pulpo', state: 'wrong' },
      { label: 'Cangrejo', state: 'wrong' },
      { label: 'Medusa', state: 'wrong' },
      { label: 'Atún', state: 'wrong' }
    ],
    explanation: '¡Muy bien! El delfín es un mamífero: respira aire y alimenta a sus crías con leche.'
  },
  {
    label: '¿Cuál es el animal más grande del mundo?',
    answers: [
      { label: 'Elefante', state: 'wrong' },
      { label: 'Jirafa', state: 'wrong' },
      { label: 'Ballena azul', state: 'success' },
      { label: 'Tiburón blanco', state: 'wrong' },
      { label: 'Oso polar', state: 'wrong' },
      { label: 'Hipopótamo', state: 'wrong' }
    ],
    explanation: '¡Correcto! La ballena azul es el animal más grande que existe: puede medir más de 25 metros.'
  },
  {
    label: 'Las gallinas ponen ___.',
    answers: [
      { label: 'Leche', state: 'wrong' },
      { label: 'Miel', state: 'wrong' },
      { label: 'Huevos', state: 'success' },
      { label: 'Lana', state: 'wrong' },
      { label: 'Seda', state: 'wrong' },
      { label: 'Queso', state: 'wrong' }
    ],
    explanation: '¡Excelente! Las gallinas ponen huevos, un alimento que comemos a diario.'
  }
];

type Feedback = { type: 'success' | 'wrong'; question: number } | null;

export default function GameFishPage() {
  const [feedback, setFeedback] = useState<Feedback>(null);

  const handleResult =
    (question: number) =>
    ({ result }: { result: boolean }) =>
      setFeedback({ type: result ? 'success' : 'wrong', question });

  return (
    <GamePage
      link="/juegos/pesca"
      description={
        <>
          <p>
            Una pecera con varios peces que nadan. Cada pez lleva una respuesta y el estudiante debe pescar el que tiene
            la respuesta correcta.
          </p>
          <p>
            El juego empieza con una pantalla de inicio con la instrucción y el botón «¡Empezar!». Cada pregunta tiene
            su propia pecera: el docente puede poner una o varias seguidas.
          </p>
        </>
      }
      correct={
        <ul>
          <li>El pez correcto es atrapado con una animación.</li>
          <li>Se abre el modal de acierto.</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>El pez elegido se escapa.</li>
          <li>Se abre el modal de error.</li>
          <li>Se puede volver a pescar con «Reintentar».</li>
        </ul>
      }
      recommendations={
        <ul>
          <li>
            Cada pregunta debe tener <strong>una sola respuesta correcta</strong> entre todos los peces.
          </li>
          <li>Usa entre 4 y 6 peces: con menos es muy fácil acertar al azar y con más la pecera se llena.</li>
          <li>
            Puedes formular la pregunta de forma directa (¿cuál es…?) o como una frase por completar con{' '}
            <code>___</code>.
          </li>
          <li>Escribe respuestas de una o dos palabras: el texto va dentro de cada pez.</li>
          <li>Evita respuestas casi iguales: el estudiante tiene que poder distinguirlas de un vistazo.</li>
          <li>
            Con varias preguntas, usa un <code>id</code> y un <code>name</code> distintos por pregunta; si se repiten,
            las opciones de una pecera se mezclan con las de otra.
          </li>
        </ul>
      }
    >
      <Panel>
        <Panel.Section>
          <Stage center>
            <GameFish.Init
              labelButton="¡Empezar!"
              labelInstruction="Selecciona el pez que tiene la respuesta correcta para ganar."
            />
          </Stage>
        </Panel.Section>

        {QUESTIONS.map((question, q) => (
          <Panel.Section key={question.label}>
            <Stage size="wide">
              <GameFish onResult={handleResult(q)}>
                <GameFish.Level label={question.label}>
                  {question.answers.map((answer, i) => (
                    <GameFish.Fish
                      key={answer.label}
                      id={`fish-${q + 1}-${i + 1}`}
                      name={`fish-${q + 1}`}
                      label={answer.label}
                      state={answer.state}
                    />
                  ))}
                </GameFish.Level>
                <GameActions>
                  <GameFish.Button>
                    <Button label="Comprobar" />
                  </GameFish.Button>
                  <GameFish.Button type="reset">
                    <Button label="Reintentar" />
                  </GameFish.Button>
                </GameActions>
              </GameFish>
            </Stage>
          </Panel.Section>
        ))}
      </Panel>

      <ResultModals
        open={feedback?.type ?? null}
        onClose={() => setFeedback(null)}
        success={QUESTIONS[feedback?.question ?? 0].explanation}
        wrong="Ese pez no tiene la respuesta correcta. ¡Sigue pescando!"
      />
    </GamePage>
  );
}
