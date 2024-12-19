'use client';
import { SliceZone } from '@prismicio/react';
import { Content, ImageField } from "@prismicio/client";
import { ProjectspostDocument } from '../../prismicio-types';
import { PrismicNextLink } from '@prismicio/next';
import React from 'react';

interface ProjectPostProps {
    slice: ProjectspostDocument[];
    fallbackImage?: ImageField;
}

export default function ProjectPost({ slice, fallbackImage }: ProjectPostProps) {

    return (
        <>
            {slice.map((item, index) => {
                console.log(item, "project post");

                return (
                    <div key={index} className="card rounded-[8px] bg-white p-2 col-span-12 md:col-span-6 aos-init aos-animate" data-aos="fade-up" data-aos-delay="300">
                        <div className="rounded-[8px] overflow-hidden mb-6">
                            <img
                                className="w-full"
                                src={item.data.feature_image.url ? item.data.feature_image.url : (fallbackImage?.url ? fallbackImage?.url : '')}
                                alt={item.data.feature_image.alt ? (fallbackImage?.alt ? fallbackImage.alt : '') : ''}
                            />
                        </div>
                        <div className="flex flex-wrap flex-col gap-3">
                            <div className="flex flex-wrap gap-2">
                                {item.tags.map((tag, index) => (
                                    <React.Fragment key={index}>
                                        <a className="text-xs text-black-text-800 uppercase font-medium font-Inter leading-none py-[6px] px-4 rounded-[40px] border border-black-text-400 transition-all hover:bg-active hover:border-active hover:text-white" href="projects.html">
                                            {tag}
                                        </a>
                                    </React.Fragment>
                                ))}
                            </div>
                            <div className="flex flex-wrap items-center justify-between text-black-800 hover:text-orange group">
                                <h4 className="font-bold font-Syne text-left leading-10 line-clamp-1 w-[60%] text-[20px] lg:text-[24px] xl:text-[32px] capitalize">
                                    <a className="transition-all" href={item.url ? item.url : '#'}>{item.data.title || "Blog Title"}</a>
                                </h4>
                                <a className="group-hover:animate-arrow-move-up" href={item.url ? item.url : '#'}>
                                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M30.8839 9.11612C31.372 9.60427 31.372 10.3957 30.8839 10.8839L10.8839 30.8839C10.3957 31.372 9.60427 31.372 9.11612 30.8839C8.62796 30.3957 8.62796 29.6043 9.11612 29.1161L29.1161 9.11612C29.6043 8.62796 30.3957 8.62796 30.8839 9.11612Z" fill="currentColor" fillOpacity="0.9"></path>
                                        <path fillRule="evenodd" clipRule="evenodd" d="M12.5 10C12.5 9.30964 13.0596 8.75 13.75 8.75H30C30.6904 8.75 31.25 9.30964 31.25 10V26.25C31.25 26.9404 30.6904 27.5 30 27.5C29.3096 27.5 28.75 26.9404 28.75 26.25V11.25H13.75C13.0596 11.25 12.5 10.6904 12.5 10Z" fill="currentColor" fillOpacity="0.9"></path>
                                    </svg>

                                </a>
                            </div>
                        </div>
                    </div>
                )
            })}
        </>
    );
}
