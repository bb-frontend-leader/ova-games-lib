import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollToPlugin);

interface Game {
  url: string;
  title: string;
  description: string;
  alt: string;
  link: string;
}

interface Props extends Game {
  onSelect?: (game: Game) => void; // 👈 función opcional
  forMainSlider?: boolean;
}

export const Card = ({
  url,
  title,
  description,
  alt,
  link,
  onSelect,
}: Props) => {
  const handleClick = () => {
    gsap.to(window, {
      duration: 1,
      scrollTo: "#mainHeader",
      offsetY: 20,
      ease: "power2.out",
    });

    if (onSelect) {
      onSelect({ url, title, description, alt, link });
    }

  };

  return (
    <div className="hero-gradient flex-none w-72 flex flex-col bg-gray-50 rounded-3xl overflow-hidden border border-gray-100">
      <div className="h-40 w-full relative">
        <img alt={alt} className="w-full h-full object-cover" src={url} />
      </div>

      <div className="p-4 flex flex-col gap-3 bg-gray-200">
        <div>
          <h4 className="font-bold text-base">{title}</h4>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
        {!onSelect ? (
          <Link to={link} rel="noopener noreferrer">
            <button
              onClick={handleClick}
              className="bg-teal-600 text-white font-bold text-xs py-2.5 rounded-xl w-full"
            >Ver Recurso</button>
          </Link>
        ) : (
          <button
            onClick={handleClick}
            className="bg-teal-600 text-white font-bold text-xs py-2.5 rounded-xl w-full"
          >Seleccionar Recurso</button>
        )}
      </div>
    </div>
  );
};
