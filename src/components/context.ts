import { createContext } from "books-ui";

interface ContexType {
  setGames: (game: {
    url: string;
    title: string;
    description: string;
    alt: string;
    link: string;
  }) => void;
  games: {
    url: string;
    title: string;
    description?: string;
    alt: string;
    link: string;
  };
}
export const [ActivityProvider, useActivityContext] = createContext<ContexType>(
  {
    name: "ActivityContext",
  },
);
