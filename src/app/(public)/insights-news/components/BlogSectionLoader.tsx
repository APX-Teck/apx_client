import { api } from '@/lib/axios';
import { BlogPost } from '@/app/types/blog.types';
import dynamic from 'next/dynamic';

const BlogListingSection = dynamic(
  () => import('@/components/sections/BlogListingSection').then((mod) => mod.BlogListingSection),
  { ssr: true }
);

export async function BlogSectionLoader() {
  let initialBlogs: BlogPost[] = [];
  let initialCategories: any[] = [];
  try {
    const [blogs, categories] = await Promise.all([
      api.fetchBlogs(),
      api.fetchCategories()
    ]);
    initialBlogs = blogs;
    initialCategories = categories;
  } catch (err) {
    console.error('Failed to load blogs for serverside render', err);
  }

  return (
    <BlogListingSection 
      initialBlogs={Array.isArray(initialBlogs) ? initialBlogs : []} 
      initialCategories={Array.isArray(initialCategories) ? initialCategories : []} 
    />
  );
}
