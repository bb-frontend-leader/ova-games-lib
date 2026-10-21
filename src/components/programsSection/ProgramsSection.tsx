import { useEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { /*Autoplay, FreeMode, */ Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { games } from "../../data/dataGames";
import { Card } from "../card/Card";
import { useActivityContext } from "../context";

import "swiper/swiper.css";
import "swiper/swiper-bundle.css";
gsap.registerPlugin();

export const ProgramsSection = () => {
  useEffect(() => {
    const card = document.querySelector(".js-containerCards");
    if (!card) return;
    gsap.set(card, {
      yPercent: 60,
    });

    const enter = () => {
      gsap.to(card, {
        yPercent: 0,
        duration: 0.4,
        ease: "power2.out",
        zIndex: 100,
      });
    };

    const leave = () => {
      gsap.to(card, {
        yPercent: 60,
        duration: 0.4,
        ease: "power2.out",
      });
    };
    card.addEventListener("click", enter);
    card.addEventListener("mouseenter", enter);
    card.addEventListener("mouseleave", leave);

    return () => {
      card.removeEventListener("mouseenter", enter);
      card.removeEventListener("mouseleave", leave);
      card.addEventListener("click", enter);
    };
  }, []);

const { setGames } = useActivityContext();
  return (
    <section className="js-containerCards containerCards flex-1 bg-white rounded-t-[2.5rem]   px-6 pt-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-extrabold text-text-main">Lista de Juegos</h3>
          <p className="text-xs text-gray-400 font-medium">
            selecciona un Juego
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/allGames">
            <button
              title="Ver todos los juegos"
              className=" flex items-center justify-center bg-teal-600 text-white font-bold text-xs py-2.5  w-12  h-12 rounded-full cursor-pointer hover:bg-teal-700 hover:scale-105 focus:outline-2 focus:outline-offset-2 focus:outline-teal-700  active:scale-95"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#F3F4F6"
              >
                <path d="M440-320h80v-168l64 64 56-56-160-160-160 160 56 56 64-64v168zm40 240q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93zm0-320z" />
              </svg>
            </button>
          </Link>
        </div>
      </div>

      <Swiper
        navigation={true}
        className="w-full mySwiper"
        modules={[Navigation]}
        slidesPerView={5}
        spaceBetween={50}
        loop
        // freeMode={true}
        // speed={6000}
        // autoplay={{
        //   delay: 0,
        //   disableOnInteraction: false,
        //   pauseOnMouseEnter: true,
        // }}
      >
        {games.map((game, index) => (
          <SwiperSlide style={{ minWidth: "290px" }} key={index}>
            <Card
              key={index}
              {...game}
              onSelect={(gameData) => setGames(gameData)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};
