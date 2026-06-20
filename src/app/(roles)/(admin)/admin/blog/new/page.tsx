import BlogEditorPage from '../[id]/page';
export const dynamic = 'force-dynamic';

export default function Page() {
  return <BlogEditorPage params={Promise.resolve({ id: 'new' })} />;
}
