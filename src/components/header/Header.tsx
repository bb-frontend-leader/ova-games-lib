// import { Image } from "books-ui";

// import { useActivityContext } from "../context";
export const Header = () => {
  // const {} = useActivityContext();
  return (
    <header
      id="header"
      className="hero-gradient flex items-center justify-between px-6 w-full   bg-transparent"
    >
      <div className="flex items-center gap-2">
        <img src="assets/images/logoUnad.png" alt="Logo" className="w-64" />
      </div>
    </header>
  );
};
