import { Metadata } from "next";
import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";

export default async function BlogPage() {
  const client = createClient();
  const blogPage = await client.getSingle("projects");

  return <SliceZone slices={blogPage.data.slices} components={components} />;
}

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const blogPage = await client.getSingle("projects");

  return {
    title: blogPage.data.meta_title,
    description: blogPage.data.meta_description,
  };
} 