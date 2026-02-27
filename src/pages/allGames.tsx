import { useState, useMemo, useEffect } from "react";
import { Breadcrumbs, Card } from "@/components";
import { games } from "@/data/dataGames";

const AllGames = () => {
  const [search, setSearch] = useState("");
   const [show, setShow] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShow(true);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  // Filtrado optimizado
  const filteredGames = useMemo(() => {
    return games.filter((game) =>{
      const text = search.toLowerCase();
      return (
        game.title.toLowerCase().includes(text) ||
        game.description.toLowerCase().includes(text)
      )

  });
  }, [search]);

  return (
    <>
      <Breadcrumbs />
      <div
        className={`containerPageAll flex flex-col w-full hero-gradient  transition-all duration-100 ease-out transform
         ${show ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}
        `}
      >
        {/* Barra de búsqueda */}
        <div className="w-full px-6 py-6 flex justify-center ">
          <div className="w-full max-w-md relative">
            <input
              type="text"
              placeholder="Buscar juego..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>
        </div>

        {/*Listado de juegos */}
        <div className=" w-full px-6 flex justify-center items-center flex-wrap gap-8">
          {filteredGames.length > 0 ? (
            filteredGames.map((game, index) => <Card key={index} {...game} />)
          ) : (
            <p className="text-gray-500 text-lg">No se encontraron juegos</p>
          )}
        </div>
      </div>
    </>
  );
};

export default AllGames;
