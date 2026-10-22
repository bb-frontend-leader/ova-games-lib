import { useState } from 'react';

import { Inputs } from '@/activities/input-activity';
import type { ResultState } from '@/components';
import { GameActions, GamePage, ResultModals, Stage } from '@/components';
import { Button } from '@/components/ui';

export default function ActivityInputPage() {
  const [feedback, setFeedback] = useState<ResultState>(null);

  const handleResult = ({ result }: { result: boolean }) => setFeedback(result ? 'success' : 'wrong');

  return (
    <GamePage
      link="/actividades/completar-con-texto"
      description={
        <>
          <p>
            Campos de texto para completar. El estudiante escribe la respuesta, ya sea dentro de una frase o en un campo
            con su pregunta, y la actividad la compara con las respuestas válidas.
          </p>
        </>
      }
      correct={
        <ul>
          <li>Todos los campos coinciden con alguna respuesta válida.</li>
          <li>Los campos se marcan como correctos y se abre el modal de acierto.</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>Los campos con error se marcan para que el estudiante los revise.</li>
          <li>Se abre el modal de error.</li>
          <li>Se puede volver a escribir con «Reintentar».</li>
        </ul>
      }
      recommendations={
        <ul>
          <li>
            Cada campo acepta varias respuestas válidas (<code>correctAnswers</code>): inclúyelas con y sin tilde y los
            sinónimos más comunes.
          </li>
          <li>Prefiere respuestas de una o dos palabras: son más fáciles de escribir y de validar.</li>
          <li>
            Usa <code>maxLength</code> para limitar el largo y <code>hint</code> para decir qué formato se espera.
          </li>
          <li>Entre 2 y 4 campos por actividad.</li>
        </ul>
      }
    >
      <Stage>
        <p className="u-font-bold u-text-center">Completa los campos con la respuesta correcta.</p>
        <Inputs onResult={handleResult}>
          <p>
            La capital de Colombia es{' '}
            <Inputs.Input
              name="capital"
              label="Capital de Colombia"
              isLabelVisible={false}
              inline
              correctAnswers={['Bogotá', 'Bogota']}
            />{' '}
            y el río más largo del país es el{' '}
            <Inputs.Input
              name="rio"
              label="Río más largo de Colombia"
              isLabelVisible={false}
              inline
              correctAnswers={['Magdalena']}
            />
            .
          </p>
          <Inputs.Input
            name="planeta"
            label="¿Cómo se llama el planeta en el que vivimos?"
            hint="Escribe solo el nombre"
            correctAnswers={['Tierra', 'La Tierra']}
            maxLength={12}
          />
          <GameActions>
            <Inputs.Button>
              <Button label="Comprobar" />
            </Inputs.Button>
            <Inputs.Button type="reset">
              <Button label="Reintentar" />
            </Inputs.Button>
          </GameActions>
        </Inputs>
      </Stage>

      <ResultModals
        open={feedback}
        onClose={() => setFeedback(null)}
        success="¡Muy bien! Bogotá, el río Magdalena y la Tierra: todas tus respuestas son correctas."
        wrong="Algún campo no es correcto. Revisa los campos marcados e inténtalo otra vez."
      />
    </GamePage>
  );
}
