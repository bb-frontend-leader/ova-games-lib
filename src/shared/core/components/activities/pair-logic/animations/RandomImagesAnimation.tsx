import { useEffect } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
gsap.registerPlugin(SplitText);

type PropsSplit = {
  mode: 'chars' | 'words' | 'lines';
};
export const RandomImagesAnimation = () => {
  useEffect(() => {
    const items = gsap.utils.toArray<HTMLElement>('.gsap-item');

    if (!items.length) return;

    gsap.fromTo(
      items,
      {
        scale: 0,
        transformOrigin: '50% 50%'
      },
      {
        scale: 1,
        duration: 0.6,
        ease: 'back.out(1.7)',
        stagger: {
          each: 0.12,
          from: 'start'
        }
      }
    );
  }, []);
  return null;
};
export const RamdomSplitAnimation = ({ mode }: PropsSplit) => {
  useEffect(() => {
    const texts = gsap.utils.toArray<HTMLElement>('.gsap-text p');
    if (!texts.length) return;

    const splits: SplitText[] = [];

    texts.forEach((el) => {
      const split = new SplitText(el, {
        type: 'chars,words,lines'
      });

      splits.push(split);

      if (mode === 'chars') {
        gsap.from(split.chars!, {
          x: 150,
          opacity: 0,
          duration: 0.7,
          ease: 'power4.out',
          stagger: 0.04
        });
      }

      if (mode === 'words') {
        gsap.from(split.words!, {
          y: -100,
          opacity: 0,
          rotation: () => gsap.utils.random(-80, 80),
          duration: 0.7,
          ease: 'back.out(1.7)',
          stagger: 0.15
        });
      }

      if (mode === 'lines') {
        gsap.from(split.lines!, {
          rotationX: -100,
          transformOrigin: '50% 50% -160px',
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.25
        });
      }
    });
    return () => {
      splits.forEach((s) => s.revert());
    };
  }, [mode]);

  return null;
};
