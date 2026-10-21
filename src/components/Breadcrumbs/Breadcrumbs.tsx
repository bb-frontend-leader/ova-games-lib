
import { Link, useLocation } from "react-router-dom";

import { games } from "../../data/dataGames";
export function Breadcrumbs() {
  const location = useLocation();
const pathname = location.pathname;
 const currentGame = games.find((game) => game.link === pathname);

  return (
    <nav className="flex items-center gap-2 hero-gradient px-8 py-2 font-semibold h-12 text-lg">
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-blue-600  capitalize"
      >
        🏠 Inicio
      </Link>

      {currentGame && (
        <>
          <span className="text-gray-400">/</span>

          <span className=" transition-colors capitalize ">
            {currentGame.title}
          </span>
        </>
      )}
    </nav>
  );
}
