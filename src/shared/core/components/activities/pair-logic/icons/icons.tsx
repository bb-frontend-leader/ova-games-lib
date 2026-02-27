import { useEffect } from 'react';
import { gsap } from 'gsap/dist/gsap';

import css from '../pair-logic.module.css';

interface Props {
  idIcon: string;
}
export const IconArrow = ({ idIcon }: Props) => {
  useEffect(() => {
    const path = document.querySelector(`#${idIcon}`) as SVGPathElement;
    if (!path) return;
    const length = path.getTotalLength();
    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length
    });

    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 2,
      ease: 'power2.out',
      fill: '#2b2929'
    });
  }, [idIcon]);
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="48" height="48">
      <path
        id={idIcon}
        d="m440-200 153-250H90v-60h503L440-760l440 280-440 280Z"
        fill="none"
        stroke="#000000"
        strokeWidth="40"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export const IconImage = () => {
  useEffect(() => {
    const iconImage = document.querySelector('.box1');
    if (!iconImage) return;
    gsap.set(iconImage, {
      transformOrigin: '50% 50%'
    });
    const animation = gsap.to(iconImage, {
      scale: 1.3,
      duration: 0.6,
      ease: 'power2.out',
      repeat: -1,
      yoyo: true,
      repeatDelay: 0.4
    });
    return () => {
      animation.kill();
    };
  }, []);

  return (
    <div className={`${css.box} box1`}>
      <svg
        className="icon-image"
        xmlns="http://www.w3.org/2000/svg"
        height="48px"
        viewBox="0 -960 960 960"
        width="48px"
        fill="#FFF">
        <path d="M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180zm0-60h600v-600H180v600zm56-97h489L578-473 446-302l-93-127-117 152zm-56 97v-600 600z" />
      </svg>
    </div>
  );
};
export const IconText = () => {
  useEffect(() => {
    const iconImage = document.querySelector('.box2');
    if (!iconImage) return;
    gsap.set(iconImage, {
      transformOrigin: '50% 50%'
    });
    const animation = gsap.to(iconImage, {
      scale: 1.3,
      duration: 0.6,
      ease: 'power2.out',
      repeat: -1,
      yoyo: true,
      repeatDelay: 0.4
    });
    return () => {
      animation.kill();
    };
  }, []);
  return (
    <div className={`${css.box} box2`}>
      <svg
        id="icon-text"
        xmlns="http://www.w3.org/2000/svg"
        height="48px"
        viewBox="0 -960 960 960"
        width="48px"
        fill="#FFFFFF">
        <path id="path" d="M290-160v-540H80v-100h520v100H390v540H290Zm360 0v-340H520v-100h360v100H750v340H650Z" />
      </svg>
    </div>
  );
};
