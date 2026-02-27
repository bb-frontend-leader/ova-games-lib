// import { Link } from "react-router-dom";
import { useState } from "react";
import { Main, ProgramsSection } from "../components";
import { ActivityProvider } from "../components/context";
interface Props {
  url: string;
  title: string;
  alt: string;
  link: string;
}
export default function Home() {
  const [games, setGames] = useState<Props>({
    url: "./assets/images/logoUnad.png",
    title: "universidad nacional abierta y a distancia",
    alt: "logo unad",
    link: "./",
  });
  return (
    <ActivityProvider
      value={{
        games,
        setGames,
      }}
    >
      <div className="hero-gradient min-h-screen w-full flex flex-col">
        <Main />
        <ProgramsSection />
      </div>
    </ActivityProvider>
  );
}
