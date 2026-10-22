import css from './styles/descripcion.module.css';
interface Props {
  children: React.ReactNode;
}
export const Description = ({ children }: Props) => {
  return <figcaption className={css.description}>{children}</figcaption>;
};
