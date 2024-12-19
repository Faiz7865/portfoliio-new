'use client'

import ResumeAboutMe from "@/components/ResumeAboutMe";
import { Content, KeyTextField } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import React, { useState } from "react";

/**
 * Props for `ResmeTabs`.
 */
export type ResmeTabsProps = SliceComponentProps<Content.ResmeTabsSlice>;

/**
 * Component for "ResmeTabs" Slices.
 */
const ResmeTabs = ({ slice }: ResmeTabsProps): JSX.Element => {
  // State to manage the active tab
  const initialTabId = slice.primary.tabs && slice.primary.tabs.length > 0 
    ? slice.primary.tabs[slice.primary.tabs.length - 1].tab_id
    : undefined; 
    
  const [activeTab, setActiveTab] = useState<KeyTextField | undefined>(initialTabId);

  // Function to handle tab clicks
  const handleTabClick = (tabId: KeyTextField) => {
    setActiveTab(tabId);
  };

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="featured-properties py-[80px] lg:py-[100px]"
    >
      <div className="container">
        <div className="grid grid-cols-12 lg:gap-[60px] xl:gap-[100px] 2xl:gap-[134px]">
          <div className="col-span-12 lg:col-span-5 2xl:col-span-4" data-aos="fade-up">
            <div className="font-bold font-Syne leading-none flex flex-wrap flex-col gap-y-2 mb-4">
              <span className="text-orange text-xl">{slice.primary.sub_title}</span>
              <h3 className="text-black-800 text-4xl lg:text-5xl xl:text-[64px] tracking-[-1.5px] relative before:rounded-full before:bg-primary before:block before:absolute before:top-[2px] before:left-0 before:-z-[1] before:w-[36px] lg:before:w-[48px] xl:before:w-[64px] before:h-[36px] lg:before:h-[48px] xl:before:h-[64px]">
                {slice.primary.title}
              </h3>
            </div>
            <div className="tabs flex flex-wrap lg:flex-col gap-2 my-8 lg:my-0">
              {slice.primary.tabs.map((item) => (
                <React.Fragment key={item.tab_id}>
                  <button
                    onClick={() => handleTabClick(item.tab_id)}
                    className={`tab-btn justify-between items-center inline-flex group ${activeTab === item.tab_id ? "active" : ""}`}
                  >
                    {item.tab_name}
                    <span className="inline-block ml-3 group-hover:animate-arrow-move-up">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 17L17 7" stroke="currentColor" strokeOpacity="0.9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                        <path d="M7 7H17V17" stroke="currentColor" strokeOpacity="0.9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                      </svg>
                    </span>
                  </button>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-7 2xl:col-span-8" data-aos="fade-up" data-aos-delay="400">
            {activeTab === 'about_me_tab' && <ResumeAboutMe />}
            
            <span className="flex justify-end mt-14 -mr-3">
              <svg width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M27.5625 0C27.5625 23.1273 9.1875 28.5455 0 27.8182C16.875 31.0909 25.3125 34.3636 27 54C27 40.3636 34.875 30.5455 54 27.8182C46.125 28.3636 29.8125 24 27.5625 0Z" fill="#FFB646" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResmeTabs;
