import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { BlogEditorClient } from './_components/BlogEditorClient';
import BlogLoading from '../loading';
import { blogService } from '@/services/admin/blog.service';
import { usersService } from '@/services/admin/users.service';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Edit Blog Post | APXTeck Admin',
  description: 'Create or edit a blog post.',
};

async function BlogEditorDataFetcher({ id }: { id: string }) {
  const isNew = id === 'new';

  // Fetch required data in parallel
  const [categories, users, post] = await Promise.all([
    blogService.getCategories(),
    usersService.getUsers(),
    !isNew ? blogService.getPostDetail(id) : Promise.resolve(null),
  ]);

  return (
    <BlogEditorClient
      initialPost={post}
      initialCategories={categories || []}
      initialUsers={users || []}
      isNew={isNew}
      postId={id}
    />
  );
}

export default async function BlogEditorPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  return (
    <Suspense fallback={<BlogLoading />}>
      <BlogEditorDataFetcher id={params.id} />
    </Suspense>
  );
}
