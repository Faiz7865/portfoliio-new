'use client';

import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { useEffect, useRef, useState } from "react";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createClient } from "@/prismicio";
import BlogPost from "@/components/blog-post";

gsap.registerPlugin(ScrollTrigger);

/**
 * Props for `Blog`.
 */
export type BlogProps = SliceComponentProps<Content.BlogSlice>;

/**
 * Component for "Blog" Slices.
 */
const Blog = ({ slice }: BlogProps): JSX.Element => {

  const client = createClient();
  const componentRef = useRef<HTMLDivElement>(null);
  const [blogPost, setBlogPost] = useState<Content.BlogPostDocument[] | null>(null);

  useEffect(() => {
    const fetchBlogPost = async () => {
      const post = await client.getAllByType("blog_post");
      setBlogPost(post);
    };

    fetchBlogPost();
  }, []);

  console.log(blogPost);


  useEffect(() => {
    const container = componentRef.current;
    if (!container || !blogPost) return;

    const cards = container.querySelectorAll(".stacking-cards .card");
    const totalCards = cards.length - 1;
    if (totalCards < 0) return; // Handle no cards

    const cardWidth = (cards[0] as HTMLElement).offsetWidth;
    const containerWidth = (container as HTMLElement).offsetWidth;
    const offset = (containerWidth - cardWidth) / (totalCards - 1);
    const gap = 80;

    const animation = gsap.to(cards, {
      x: (i) => (i === 0 ? 0 : -i * cardWidth + gap * i),
      duration: (i) => 0.5 * i,
      ease: "none",
      scrollTrigger: {
        trigger: container,
        pin: true,
        markers: false,
        scrub: true,
        end: `+=${totalCards * 100}% 0px`,
      },
    });

    // Cleanup function
    return () => {
      animation.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [blogPost]);

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="relative pt-[80px] pb-[80px] overflow-hidden"
    >
      <div className="container">

        <div className="grid grid-cols-12">
          <div className="col-span-12 aos-init aos-animate" data-aos="fade-up">
            <div className="font-bold font-Syne text-center leading-none flex flex-wrap flex-col gap-y-2 mb-10">
              <span className="text-orange text-xl">Blog</span>
              <h3 className="text-black-800 text-4xl lg:text-5xl xl:text-[64px] tracking-[-1.5px]">
                {slice.primary.title}&nbsp;
                <span className="relative z-[1] before:rounded-full before:bg-primary before:block before:absolute before:top-[8px] before:left-[20px] before:-z-[1] before:w-[36px] lg:before:w-[48px] xl:before:w-[69px] before:h-[36px] lg:before:h-[48px] xl:before:h-[69px]">po</span>st
              </h3>
              <div className="">
                <PrismicRichText field={slice.primary.description} />
              </div>
            </div>
          </div>
        </div>

        <div ref={componentRef} className="pt-10">
          {blogPost && <BlogPost slice={blogPost.map((item) => item)} fallbackImage={slice.primary.fallback_image} />}
        </div>
      </div>
    </section>
  );
};

export default Blog;
