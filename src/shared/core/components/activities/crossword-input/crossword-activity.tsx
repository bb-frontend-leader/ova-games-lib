import { FullScreenAlert, /*FullScreenButton*/ } from "@core/components";

import { ImgContainer } from "@/shared/ui/components";

import css from "./crossword-input.module.css";

interface Props {
  children: React.ReactNode;
  title: JSX.Element;
  background: string;
  addClass?: string;
}

type Subcomponent = {
  Button: typeof CrosswordButton;
};

export const CrosswordActivity: React.FC<Props> & Subcomponent = ({
  children,
  title,
  background,
  addClass,
}: Props) => {
  return (
    <div id="crossword">
      <FullScreenAlert />
      {/* <FullScreenButton elementid="crossword" /> */}
      <ImgContainer
        background={background}
        padding="20px"
        backgroundSize="70px"
      >
        <div className={`${css["crossword-wrapper"]} ${addClass}`}>
          {children}
        </div>
      </ImgContainer>
      <p className="u-text-center u-font-italic">{title}</p>
    </div>
  );
};

const CrosswordButton = ({ children }: { children: React.ReactNode }) => {
  return <div className={css["crossword-buttons"]}>{children}</div>;
};

CrosswordActivity.Button = CrosswordButton;
