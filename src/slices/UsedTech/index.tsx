'use client'

import { Content, KeyTextField } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import React, { useEffect, useRef } from "react";
import { MdCircle } from "react-icons/md";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Props for `UsedTech`.
 */
export type UsedTechProps = SliceComponentProps<Content.UsedTechSlice>;

/**
 * Component for "UsedTech" Slices.
 */
const UsedTech = ({ slice }: UsedTechProps): JSX.Element => {
  const component = useRef(null);

  useEffect(() => {
    if (!component.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: component.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 5,
          markers: false, 
        },
      });

      tl.fromTo(
        ".tech-row",
        { x: (i) => (i % 2 === 0 ? gsap.utils.random(600, 400) : gsap.utils.random(-600, -400)) },
        { x: (i) => (i % 2 === 0 ? gsap.utils.random(-600, -400) : gsap.utils.random(600, 400)) }
      );

    }, component);

    return () => ctx.revert();
  }, []);

  return (
    <section data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation} ref={component} className="bg-black relative pt-[80px] pb-[80px] overflow-hidden">
      <div className="container">
        <h3 className="text-slate-200 text-center text-4xl lg:text-5xl xl:text-[64px] tracking-[-1.5px] relative before:rounded-full before:bg-primary before:block before:absolute before:top-[2px] before:left-0 before:-z-[1] before:w-[36px] lg:before:w-[48px] xl:before:w-[64px] before:h-[36px] lg:before:h-[48px] xl:before:h-[64px] mb-5">
          {slice.primary.tech_heading}
        </h3>
        {slice.primary.tech_names.map(({ tech_name, tech_color }, index) => (
          <div className="text-slate-600 tech-row flex items-center justify-center gap-5 mb-3" key={index}>
            {Array.from({ length: 16 }, (_, idx) => (
              <React.Fragment key={idx}>
                <span className="tech-name text-6xl font-bold uppercase tracking-tighter" style={{ color: idx === 7 && tech_color ? tech_color : 'inherit' }}>
                  {tech_name}
                </span>
                <span className="text-2xl">
                  <MdCircle />
                </span>
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default UsedTech;
