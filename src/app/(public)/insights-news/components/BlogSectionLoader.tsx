import { api } from '@/lib/axios';
import { BlogPost } from '@/app/types/blog.types';
import dynamic from 'next/dynamic';

const BlogListingSection = dynamic(() => import('@/components/sections/BlogListingSection').then(mod => mod.BlogListingSection), { ssr: true });

export async function BlogSectionLoader() {
  let initialBlogs: BlogPost[] = [];
  try {
    initialBlogs = await api.fetchBlogs();
  } catch (err) {
    console.error('Failed to load blogs for serverside render', err);
  }

  return <BlogListingSection initialBlogs={initialBlogs} />;
}
