/** Propiedades de presentación que las hojas de estilo le dan a las formas de un SVG. */
const SHAPE_PROPS = [
  'fill',
  'fill-opacity',
  'fill-rule',
  'stroke',
  'stroke-width',
  'stroke-opacity',
  'stroke-linecap',
  'stroke-linejoin',
  'stroke-dasharray',
  'stroke-dashoffset',
  'stop-color',
  'stop-opacity',
  'opacity',
  'filter',
  'mix-blend-mode',
  'paint-order',
  'font-family',
  'font-size',
  'font-weight',
  'font-style',
  'letter-spacing',
  'text-anchor',
  'dominant-baseline'
];

/** El `<svg>` de raíz también necesita el tamaño y la posición que le da su clase. */
const ROOT_PROPS = [
  ...SHAPE_PROPS,
  'display',
  'position',
  'top',
  'right',
  'bottom',
  'left',
  'width',
  'height',
  'margin',
  'overflow',
  'z-index',
  'transform',
  'transform-origin'
];

/**
 * `html-to-image` copia los estilos calculados solo a los elementos HTML: los de un SVG (casillas, textos, degradados)
 * se pierden y salen en negro. Esta función fija esos estilos en línea y devuelve la función que deja todo como estaba.
 */
export function inlineSvgStyles(root: HTMLElement): () => void {
  const originals = new Map<Element, string | null>();

  root.querySelectorAll('svg, svg *').forEach((element) => {
    const computed = getComputedStyle(element);
    const props = element.matches('svg') ? ROOT_PROPS : SHAPE_PROPS;

    originals.set(element, element.getAttribute('style'));
    props.forEach((prop) => {
      const value = computed.getPropertyValue(prop);
      if (value) (element as SVGElement).style.setProperty(prop, value);
    });
  });

  return () =>
    originals.forEach((style, element) => {
      if (style === null) element.removeAttribute('style');
      else element.setAttribute('style', style);
    });
}
