'use client';

import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { useEffect, useRef, useState } from "react";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createClient } from "@/prismicio";
import ProjectPost from "@/components/project-post";

export type ProjectsProps = SliceComponentProps<Content.ProjectsSlice>;

const Projects = ({ slice }: ProjectsProps): JSX.Element => {
  const client = createClient();
  const componentRefNew = useRef<HTMLDivElement>(null);
  const [projectPost, setProjectPost] = useState<Content.ProjectspostDocument[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const post = await client.getAllByType("projectspost");
        setProjectPost(post);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogPost();
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const containerMain = componentRefNew.current;
    if (!containerMain || !projectPost) return;

    const cards = gsap.utils.toArray<HTMLElement>(".stacking-cards-new .card");

    const spacer = 20;

    cards.forEach((card, index) => {
      ScrollTrigger.create({
        trigger: card,
        start: `top-=${index * spacer} top+=10px`,
        endTrigger: containerMain,
        end: `bottom top+=${200 + cards.length * spacer}`,
        pin: true,
        pinSpacing: false,
        markers: true,
        id: "card-pin",
        invalidateOnRefresh: true
      });
    });

    ScrollTrigger.create({
      trigger: ".stickyText",
      start: "top 10",
      end: (self) => {
        const previous = self.previous();
        return previous ? previous.end : 'top';
      },
      pin: true,
      markers: true
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [projectPost]);

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      ref={componentRefNew}
      className="pt-[80px] pb-[80px] bg-secondary pin-panel min-h-[700px]"
    >
      <div className="container relative">
        <div className="flex">
          <div className="flex-1">
            <div className="stickyText font-bold font-Syne text-center leading-none flex flex-wrap flex-col gap-y-2 mb-10">
              <span className="text-orange text-xl">Projects</span>
              <h3 className="text-black-800 text-4xl lg:text-5xl xl:text-[64px] tracking-[-1.5px]">
                {slice.primary.title}&nbsp;
                <span className="relative z-[1] before:rounded-full before:bg-primary before:block before:absolute before:top-[8px] before:left-[20px] before:-z-[1] before:w-[36px] lg:before:w-[48px] xl:before:w-[69px] before:h-[36px] lg:before:h-[48px] xl:before:h-[69px]">po</span>st
              </h3>
              <div>
                <PrismicRichText field={slice.primary.discription} />
              </div>
            </div>
          </div>
          <div className="flex-1 stacking-cards-new overflow-hidden">
            {loading ? (
              <p>Loading...</p>
            ) : (
              projectPost && (
                <ProjectPost slice={projectPost.map((item) => item)} fallbackImage={slice.primary.fallback_image} />
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
