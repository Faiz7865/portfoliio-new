'use client'

import { createClient } from "@/prismicio";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ResumeAboutMeDocument } from "../../prismicio-types";
import { PrismicRichText } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";

export default function ResumeAboutMe() {
    const [details, setAboutDetails] = useState<ResumeAboutMeDocument | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            const client = createClient();
            try {
                const aboutMe = await client.getSingle('resume_about_me');
                setAboutDetails(aboutMe);
            } catch (error) {
                console.error("Error fetching settings:", error);
            }
        };

        fetchSettings();
    }, []);


    console.log(details, "Details");



    // console.log(setting, 'setting');
    if (!details) {
        return <nav className="bg-white border-gray-200 dark:bg-gray-900">Loading...</nav>;
    }
    const { based, description, email, experience, freelance, language, name, nationality, phone, skype_id, skype_url } = details.data;

    return (
        <div id="about_me_tab" className="tab-content relative active">
            <div className="grid grid-cols-1">
                <h4 className="text-black-800 text-2xl lg:text-[32px] font-bold font-Syne mb-6">{based}</h4>
                <div className="mb-7">
                    <PrismicRichText field={description} />
                </div>

                <ul className="flex-col gap-3 inline-flex">
                    <li className="gap-10 inline-flex items-center">
                        <span className="w-[110px] text-black-text-800 text-lg font-normal leading-none">
                            Name</span>
                        <span className="text-black-800 text-2xl font-bold font-Syne leading-8">
                            {name}</span>
                    </li>
                    <li className="gap-10 inline-flex items-center">
                        <span className="w-[110px] text-black-text-800 text-lg font-normal leading-none">
                            Nationality</span>
                        <span className="text-black-800 text-2xl font-bold font-Syne leading-8">
                            {nationality}</span>
                    </li>
                    <li className="gap-10 inline-flex items-center">
                        <span className="w-[110px] text-black-text-800 text-lg font-normal leading-none">
                            Phone</span>
                        <span className="text-black-800 text-2xl font-bold font-Syne leading-8">
                            {phone}</span>
                    </li>
                    <li className="gap-10 inline-flex items-center">
                        <span className="w-[110px] text-black-text-800 text-lg font-normal leading-none">
                            Email</span>
                        <span className="text-black-800 text-2xl font-bold font-Syne leading-8">
                            {email}</span>
                    </li>
                    <li className="gap-10 inline-flex items-center">
                        <span className="w-[110px] text-black-text-800 text-lg font-normal leading-none">
                            Experience</span>
                        <span className="text-black-800 text-2xl font-bold font-Syne leading-8">
                            {experience}</span>
                    </li>
                    <li className="gap-10 inline-flex items-center">
                        <span className="w-[110px] text-black-text-800 text-lg font-normal leading-none">
                            Freelance</span>
                        <span className="text-black-800 text-2xl font-bold font-Syne leading-8">
                            {freelance}</span>
                    </li>
                    <li className="gap-10 inline-flex items-center">
                        <span className="w-[110px] text-black-text-800 text-lg font-normal leading-none">
                            Skype</span>
                        <span className="text-black-800 text-2xl font-bold font-Syne leading-8">
                            <PrismicNextLink field={skype_url}>{skype_id}</PrismicNextLink></span>
                    </li>
                    <li className="gap-10 inline-flex items-center">
                        <span className="w-[110px] text-black-text-800 text-lg font-normal leading-none">
                            Language</span>
                        <span className="text-black-800 text-2xl font-bold font-Syne leading-8">
                            {language}</span>
                    </li>
                </ul>

            </div>
        </div>
    )
};