import { useState } from 'react';

import type { ResultState } from '@/components';
import { GameActions, GamePage, ResultModals, Stage } from '@/components';
import { Button, Panel } from '@/components/ui';
import { GameMoney } from '@/games/game-money';

export default function GameMoneyPage() {
  const [feedback, setFeedback] = useState<ResultState>(null);

  const handleResult = ({ result }: { result: boolean }) => setFeedback(result ? 'success' : 'wrong');

  return (
    <GamePage
      link="/juegos/elige-y-gana"
      description={
        <>
          <p>
            Un banquero avaro guarda su dinero en una caja fuerte. El estudiante debe convencerlo respondiendo bien la
            pregunta para que abra la caja.
          </p>
          <p>El juego empieza con una pantalla de inicio y después muestra la pregunta con sus opciones.</p>
        </>
      }
      correct={
        <ul>
          <li>El banquero reacciona y abre la caja fuerte.</li>
          <li>Cae una lluvia de monedas y billetes.</li>
          <li>Se muestra la pantalla final con la opción «Jugar de nuevo».</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>El banquero se burla y la caja sigue cerrada.</li>
          <li>Se abre el modal de error.</li>
          <li>Se puede intentar de nuevo con «Reintentar».</li>
        </ul>
      }
      recommendations={
        <ul>
          <li>Cada juego contiene una sola pregunta: para varias, usa varias instancias en secciones distintas.</li>
          <li>Usa 3 opciones, con una sola correcta y respuestas cortas.</li>
          <li>
            Escribe un texto de inicio breve en <code>textInit</code>: dice al estudiante qué se espera de él.
          </li>
          <li>La pregunta debe poder responderse sin ayuda externa: el juego no ofrece pistas.</li>
        </ul>
      }
    >
      <Panel>
        <Panel.Section>
          <Stage center>
            <p className="u-font-bold">Bienvenido a la caja fuerte. Convence al banquero de soltar su dinero.</p>
            <GameMoney.Init textInit="Responde bien y el banquero avaro abrirá su caja fuerte." />
          </Stage>
        </Panel.Section>

        <Panel.Section>
          <Stage center>
            <p className="u-font-bold">Selecciona la respuesta correcta.</p>
            <GameMoney onResult={handleResult}>
              <GameMoney.Level label="¿Cuál es la capital de Francia?">
                <GameMoney.Radio label="París" state="success" id="money-1" name="money" />
                <GameMoney.Radio label="Roma" state="wrong" id="money-2" name="money" />
                <GameMoney.Radio label="Madrid" state="wrong" id="money-3" name="money" />
              </GameMoney.Level>
              <GameActions>
                <GameMoney.Button>
                  <Button label="Comprobar" />
                </GameMoney.Button>
                <GameMoney.Button type="reset">
                  <Button label="Reintentar" />
                </GameMoney.Button>
              </GameActions>
            </GameMoney>
          </Stage>
        </Panel.Section>
      </Panel>

      <ResultModals
        open={feedback}
        onClose={() => setFeedback(null)}
        success="¡Muy bien! París es la capital de Francia y el banquero abre la caja fuerte."
        wrong="Esa no es la respuesta correcta. ¡Inténtalo otra vez!"
      />
    </GamePage>
  );
}
