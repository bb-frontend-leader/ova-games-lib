import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useActivityContext } from "../context";
import { Link } from "react-router-dom";

export const Main = () => {
  const { games } = useActivityContext();
  const { url, title, alt, link } = games;
  console.log(games);

  const imageRef = useRef<HTMLImageElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!url || !imageRef.current || !cardRef.current) return;

    const tl = gsap.timeline();

    tl.fromTo(
      cardRef.current,
      {
        scale: 0.7,
        opacity: 0,
      },
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: "back.out(1.8)",
      },
    )
      .fromTo(
        imageRef.current,
        { filter: "brightness(70%)" },
        {
          filter: "brightness(110%)",
          duration: 0.3,
        },
        "-=0.3",
      )
      .to(imageRef.current, {
        boxShadow: "0 0 35px rgba(13,148,136,.7)",
        duration: 0.25,
      })
      .to(imageRef.current, {
        boxShadow: "0 0 0 rgba(0,0,0,0)",
        duration: 0.4,
      });
  }, [url]);

  return (
    <main className="min-h-170  flex flex-col items-center justify-items-center px-8 text-center w-full pb-15 gap-5">
      <div ref={cardRef} className="mb-6 relative">
        <div className="w-60 h-50 rounded-3xl overflow-hidden shadow-2xl border-4 border-white rotate-3">
          <img
            ref={imageRef}
            alt={alt}
            src={url}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute -bottom-4 -right-4 bg-white p-3 rounded-2xl shadow-xl flex items-center gap-2">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            {title}
          </span>
        </div>
      </div>

      <h1 className="text-3xl font-extrabold text-text-main leading-tight mb-3">
        Biblioteca de
        <br />
        <span className="text-primary">Juegos</span>
      </h1>

      <p className="text-gray-500 text-sm max-w-[280px] mb-8 font-medium">
        Descubre programas virtuales especializados en la creación de juegos
        dinámicos, accesibles e intuitivos.
      </p>
      {link !== "./" ? (
        <Link to={link} rel="noopener noreferrer">
          <button className=" p-10 bg-teal-600 text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer hover:bg-teal-700 focus:outline-2 focus:outline-offset-2 focus:outline-teal-700 w-full active:scale-95">
            Ver recurso
          </button>
        </Link>
      ) : (
        <div className=" flex justify-center items-center gap-2  py-4 w-150  text-center font-semibold tracking-wide rounded-xl">
          <svg
            className="animate-bounce"
            xmlns="http://www.w3.org/2000/svg"
            height="30px"
            viewBox="0 -960 960 960"
            width="30px"
            fill="#EA3323"
          >
            <path d="M480-80L200-360l56-57 184 184v-287h80v287l184-183 56 56L480-80zm-40-520v-120h80v120h-80zm0-200v-80h80v80h-80z" />
          </svg>
          SELECCIONA UN JUEGO DE LA LISTA INFERIOR PARA COMENZAR
        </div>
      )}
    </main>
  );
};
