// pages/blog/[uid].tsx
'use client'; // Ensure this is a client component

import { useEffect, useRef, useState } from 'react';
import { createClient } from "@/prismicio";
import { Content } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import { PrismicNextImage } from '@prismicio/next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BlogPost from '@/components/blog-post';

type Params = { uid: string }

gsap.registerPlugin(ScrollTrigger);

const BlogPostSingle = ({ params }: { params: Params; }) => {

    const client = createClient();

    const componentRef = useRef<HTMLDivElement>(null);
    const [blogPost, setBlogPost] = useState<Content.BlogPostDocument[] | null>(null);

    useEffect(() => {
        const fetchBlogPost = async () => {
            const post = await client.getAllByType("blog_post");
            const sortedPosts = post.sort((a, b) => {
                const dateA = new Date(a.data.publication_date || '1970-01-01');
                const dateB = new Date(b.data.publication_date || '1970-01-01');
                return dateB.getTime() - dateA.getTime();
            });

            setBlogPost(sortedPosts.slice(0, 8));
        };

        fetchBlogPost();
    }, []);

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

    const uid = params.uid;

    const [post, setPost] = useState<Content.BlogPostDocument<string> | null>(null); // Initialize state

    useEffect(() => {
        const fetchBlogPost = async () => {
            if (uid) {
                const client = createClient();
                const fetchedPost = await client.getByUID('blog_post', uid);
                setPost(fetchedPost);
            }
        };

        fetchBlogPost();
    }, [uid]);

    console.log(post, "Post fetched");

    if (!post) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <section className="bg-secondary pt-20">
                <div className="max-w-[1075px] mx-auto px-4 xl:px-0 aos-init aos-animate" data-aos="flip-down" data-aos-delay="300">
                    <div className="grid grid-cols-1">
                        <h4 className="text-black-800 font-bold font-Syne leading-snug text-[23px] sm:text-[32px] md:text-[44px] max-w-[950px] mb-12">
                            {post.data.title}
                        </h4>
                        <PrismicNextImage
                            className='w-full rounded-[20px] mb-9'
                            alt={post.data.feature_image.alt ? post.data.feature_image.alt : "Image"}
                            field={post.data.feature_image}
                        />
                    </div>

                </div>
            </section>
            <section className="bg-white pb-[120px] mt-[-280px] pt-[280px]">
                <div className="max-w-[1075px] mx-auto px-4 xl:px-0">

                    <div className="grid grid-cols-1 mb-12">

                        <ul className="flex flex-wrap gap-x-[80px] gap-y-6 pb-8 border-b border-black-800 border-opacity-10">
                            <li className="flex flex-wrap flex-col gap-3">
                                <span className="text-black-text-800 text-sm font-normal font-Inter leading-tight">Category</span>
                                <h4 className="text-black-800 text-[15px] font-bold font-sans leading-none">{post.tags.join(' ,')}
                                </h4>
                            </li>
                            <li className="flex flex-wrap flex-col gap-3">
                                <span className="text-black-text-800 text-sm font-normal font-Inter leading-tight">Date</span>
                                <h4 className="text-black-800 text-[15px] font-bold font-sans leading-none">{new Date(post.data.publication_date ? post.data.publication_date : 'Unknown Date').toLocaleDateString()}</h4>
                            </li>
                        </ul>
                    </div>
                    <div className="grid grid-cols-1 font-Syne leading-10 gap-3">
                        <PrismicRichText field={post.data.discription} />
                    </div>
                </div>
            </section>
            <section className="relative pt-[80px] pb-[80px] overflow-hidden bg-secondary"
            >
                <div className="container">

                    <div className="grid grid-cols-12">
                        <div className="col-span-12 aos-init aos-animate" data-aos="fade-up">
                            <div className="font-bold font-Syne text-center leading-none flex flex-wrap flex-col gap-y-2 mb-10">
                                <span className="text-orange text-xl">Blog</span>
                                <h3 className="text-black-800 text-4xl lg:text-5xl xl:text-[64px] tracking-[-1.5px]">
                                    Our Latest&nbsp;
                                    <span className="relative z-[1] before:rounded-full before:bg-primary before:block before:absolute before:top-[8px] before:left-[20px] before:-z-[1] before:w-[36px] lg:before:w-[48px] xl:before:w-[69px] before:h-[36px] lg:before:h-[48px] xl:before:h-[69px]">po</span>st
                                </h3>
                                <div className="">
                                    <p className='paragraph mb-6'>Latest Post Description</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div ref={componentRef} className="pt-10">
                        {blogPost && <BlogPost slice={blogPost.map((item) => item)} />}
                    </div>
                </div>
            </section>
        </>
    );
};

export default BlogPostSingle;
