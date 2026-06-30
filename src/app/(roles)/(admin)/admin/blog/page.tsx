import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { BlogManager } from './_components/BlogManager';
import BlogLoading from './loading';
import { blogService } from '@/services/admin/blog.service';
import { AdminBlogPost as BlogPost } from '@/app/types/admin-blog.types';

export const metadata: Metadata = {
  title: 'Blog Management | APXTeck Admin',
  description: 'Manage articles, AI drafts, categories, and publications.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function BlogDataFetcher() {
  let initialPosts: BlogPost[] = [];
  try {
    const data = await blogService.getPosts({ limit: 10000 });
    initialPosts = data || [];
  } catch (error) {
    console.error('Failed to fetch initial blog posts:', error);
  }
  return <BlogManager initialPosts={initialPosts} />;
}

export default function BlogManagementPage() {
  return (
    <Suspense fallback={<BlogLoading />}>
      <BlogDataFetcher />
    </Suspense>
  );
}
