'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { blogService, BlogPostDetail, BlogCategory } from '@/services/admin/blog.service';
import { usersService, User } from '@/services/admin/users.service';
import {
  ArrowLeft,
  Save,
  Image as ImageIcon,
  Sparkles,
  AlertCircle,
  Settings,
  Type,
  Link as LinkIcon,
  List,
  Heading,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  Code,
  Eye,
  Search,
  ChevronDown,
  Check,
} from 'lucide-react';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('@/components/ui/RichTextEditor'), {
  ssr: false,
  loading: () => <div className="animate-pulse w-full min-h-[300px] bg-gray-100/50 dark:bg-white/5 rounded-2xl" />
});

function SearchableAuthorSelect({
  value,
  onChange,
  users,
}: {
  value: string;
  onChange: (value: string) => void;
  users: User[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Show all users that have Employee or Admin related roles
  // Handling case and spacing variations for robustness
  const validUsers = users.filter(u => {
    if (!u.isActive && u.id.toString() !== value) return false; // Show inactive only if they are currently selected
    const roleName = u.role?.name?.toUpperCase()?.replace(/\s+/g, '_') || '';
    return ['EMPLOYEE', 'ADMIN', 'SUPER_ADMIN'].includes(roleName);
  });

  const filteredUsers = validUsers.filter(u =>
    u.fullName?.toLowerCase().includes(search.toLowerCase()) || 
    (u.fullName === 'APX Blog Bot' && 'apx teck'.includes(search.toLowerCase()))
  );

  const selectedUser = users.find(u => u.id.toString() === value);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white dark:bg-[#151515] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-[15px] font-bold rounded-xl px-4 py-2.5 min-h-[48px] focus-within:ring-4 focus-within:ring-indigo-500/20 outline-none transition-all flex items-center justify-between cursor-pointer"
      >
        <span>
          {value === ''
            ? 'Current User (Default)'
            : selectedUser?.fullName === 'APX Blog Bot'
            ? 'APX Teck'
            : selectedUser?.fullName || 'Unknown User'}
        </span>
        <ChevronDown size={18} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl max-h-[300px] flex flex-col overflow-hidden">
          <div className="p-3 border-b border-gray-100 dark:border-white/10 flex items-center gap-2 sticky top-0 bg-white dark:bg-[#1a1a1a] z-10">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search author..."
              className="w-full bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400 font-medium"
              autoFocus
            />
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-1">
            <div
              onClick={() => {
                onChange('');
                setIsOpen(false);
                setSearch('');
              }}
              className={`px-3 py-2.5 rounded-lg cursor-pointer flex items-center justify-between text-sm font-bold transition-colors ${
                value === ''
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
              }`}
            >
              Current User (Default)
              {value === '' && <Check size={16} />}
            </div>
            {filteredUsers.length === 0 ? (
              <div className="p-3 text-center text-sm text-gray-500 font-medium">No authors found</div>
            ) : (
              filteredUsers.map(u => (
                <div
                  key={u.id}
                  onClick={() => {
                    onChange(u.id.toString());
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={`px-3 py-2.5 rounded-lg cursor-pointer flex items-center justify-between text-sm font-bold transition-colors ${
                    value === u.id.toString()
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
                >
                  {u.fullName === 'APX Blog Bot' ? 'APX Teck' : u.fullName}
                  {value === u.id.toString() && <Check size={16} />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: 'success' | 'error' | 'loading';
  onClose: () => void;
}) {
  useEffect(() => {
    if (type !== 'loading') {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [type, onClose]);

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg border text-sm font-bold flex items-center gap-2 ${
        type === 'success'
          ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
          : type === 'error'
            ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
            : 'bg-white text-gray-700 border-gray-200 dark:bg-[#151515] dark:text-gray-300 dark:border-white/10'
      }`}
    >
      {type === 'loading' && (
        <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
      )}
      {message}
    </div>
  );
}

export function BlogEditorClient({
  initialPost,
  initialCategories,
  initialUsers,
  isNew,
  postId,
}: {
  initialPost: BlogPostDetail | null;
  initialCategories: BlogCategory[];
  initialUsers: User[];
  isNew: boolean;
  postId: string;
}) {
  const router = useRouter();

  // SSR Fallback State
  const [categories, setCategories] = useState<BlogCategory[]>(initialCategories || []);
  const [users, setUsers] = useState<User[]>(initialUsers || []);

  useEffect(() => {
    const fetchFallbackData = async () => {
      try {
        if (!categories || categories.length === 0) {
          const fetchedCats = await blogService.getCategories();
          setCategories(fetchedCats || []);
        }
        if (!users || users.length === 0) {
          const fetchedUsers = await usersService.getUsers();
          setUsers(fetchedUsers || []);
        }
      } catch (err) {
        console.error('Failed to load fallback blog data', err);
      }
    };
    fetchFallbackData();
  }, [categories.length, users.length]);

  // Form State
  const [postData, setPostData] = useState<BlogPostDetail | null>(initialPost);
  const [isLoadingData, setIsLoadingData] = useState(!isNew && !initialPost);

  const [title, setTitle] = useState(initialPost?.title || '');
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt || '');
  const [content, setContent] = useState(initialPost?.content || '');
  const [status, setStatus] = useState(initialPost?.status || 'DRAFT');
  const [tags, setTags] = useState(initialPost?.tags?.join(', ') || '');
  const [metaDescription, setMetaDescription] = useState(initialPost?.metaDescription || '');
  const [categoryId, setCategoryId] = useState<string>(initialPost?.categoryId?.toString() || '');
  const [authorId, setAuthorId] = useState<string>(
    initialPost?.author?.id?.toString() || (initialPost as any)?.authorId?.toString() || ''
  );
  const [authorDesignation, setAuthorDesignation] = useState<string>(
    initialPost?.authorDesignation || ''
  );
  const [authorBio, setAuthorBio] = useState<string>(initialPost?.authorBio || '');

  const [showPreview, setShowPreview] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'loading';
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<{ title?: string; content?: string; categoryId?: string }>({});

  useEffect(() => {
    const fetchPostData = async () => {
      if (!isNew && !initialPost) {
        try {
          setIsLoadingData(true);
          const post = await blogService.getPostDetail(postId);
          if (post) {
            setPostData(post);
            setTitle(post.title || '');
            setExcerpt(post.excerpt || '');
            setContent(post.content || '');
            setStatus(post.status || 'DRAFT');
            setTags(post.tags?.join(', ') || '');
            setMetaDescription(post.metaDescription || '');
            setCategoryId(post.categoryId?.toString() || '');
            setAuthorId(post.author?.id?.toString() || (post as any)?.authorId?.toString() || '');
            setAuthorDesignation(post.authorDesignation || '');
            setAuthorBio(post.authorBio || '');
          }
        } catch (err) {
          console.error('Failed to fetch post detail on client', err);
          setToast({ message: 'Failed to load post data', type: 'error' });
        } finally {
          setIsLoadingData(false);
        }
      }
    };
    fetchPostData();
  }, [isNew, initialPost, postId]);

  const isAiGenerated = postData?.isAiGenerated || false;

  const handleSave = async () => {
    const errors: { title?: string; content?: string; categoryId?: string } = {};
    if (!title.trim()) errors.title = 'Title is required';
    if (!content.trim() || content === '<p></p>') errors.content = 'Content is required';
    if (!categoryId) errors.categoryId = 'Category is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setToast({ message: 'Please fill in all required fields.', type: 'error' });
      return;
    }

    try {
      setIsSaving(true);
      setToast({ message: 'Saving post...', type: 'loading' });
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      if (excerpt) formData.append('excerpt', excerpt);
      if (categoryId) formData.append('categoryId', categoryId);
      formData.append('authorId', authorId);
      if (authorDesignation) formData.append('authorDesignation', authorDesignation);
      if (authorBio) formData.append('authorBio', authorBio);
      if (metaDescription) formData.append('metaDescription', metaDescription);

      const tagArray = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      tagArray.forEach((t) => formData.append('tags', t));

      if (coverFile) {
        formData.append('coverImage', coverFile);
      }

      if (isNew) {
        await blogService.createPost(formData);
        setToast({ message: 'Post created successfully', type: 'success' });
        setTimeout(() => router.push('/admin/blog'), 1000);
      } else {
        await blogService.updatePost(postId, formData);

        // Also update status if changed
        if (
          status &&
          status !== postData?.status &&
          (status === 'PUBLISHED' || status === 'DRAFT')
        ) {
          await blogService.updatePostStatus(postId, status as any);
        }
        setToast({ message: 'Post saved successfully', type: 'success' });
      }
    } catch (error: any) {
      setToast({ message: error.response?.data?.message || 'Failed to save post', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] w-full">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Loading post data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-[1400px] mx-auto pb-safe pb-12 px-4 sm:px-6 lg:px-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl p-4 rounded-[2rem] border border-gray-200/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/admin/blog')}
            className="min-w-[48px] min-h-[48px] flex items-center justify-center bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-gray-900 dark:text-white truncate max-w-sm lg:max-w-xl">
                {title || 'Untitled Post'}
              </h1>
              {isAiGenerated && (
                <span className="flex items-center gap-1 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-md text-[10px] font-black tracking-widest uppercase border border-purple-100 dark:border-purple-500/20">
                  <Sparkles size={12} /> AI DRAFT
                </span>
              )}
            </div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">
              Status: <strong className="text-gray-700 dark:text-gray-300">{status}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview(true)}
            className="bg-white dark:bg-[#151515] border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 px-5 py-2.5 min-h-[48px] rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
          >
            <Eye size={16} /> Preview
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 min-h-[48px] rounded-xl font-bold text-sm transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save size={16} /> {isSaving ? 'Saving...' : 'Save Post'}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Editor Column */}
        <div className="flex-1 space-y-6">
          <div className="bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 border border-gray-200/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] space-y-6">
            {/* Title */}
            <div>
              <label className="text-[13px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-2">
                Post Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setFormErrors(p => ({...p, title: undefined}));
                }}
                placeholder="Enter an engaging title..."
                className={`w-full min-h-[48px] text-2xl font-black bg-transparent border-0 border-b-2 px-0 py-2 transition-all ${
                  formErrors.title 
                    ? 'border-red-400 focus:border-red-500 text-red-900 dark:text-red-100 placeholder-red-300' 
                    : 'border-gray-100 dark:border-white/5 focus:border-indigo-500 dark:focus:border-indigo-500 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-700'
                } focus:ring-0`}
              />
              {formErrors.title && <p className="mt-2 text-sm font-bold text-red-500">{formErrors.title}</p>}
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex justify-between">
                <span>Excerpt</span>
                <span className="text-xs text-gray-400 font-normal">{excerpt.length} / 255</span>
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A short summary of the post..."
                className="w-full bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-sm font-medium rounded-xl p-4 min-h-[100px] focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            {/* Advanced Rich Text Editor */}
            <div className={formErrors.content ? 'ring-2 ring-red-400 rounded-2xl p-2 bg-red-50 dark:bg-red-900/10' : ''}>
              <label className="text-[13px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-2 flex justify-between">
                <span>Content <span className="text-red-500">*</span></span>
                <span className="text-xs text-indigo-500 font-normal flex items-center gap-1">
                  <Sparkles size={12} /> Advanced Editor Active
                </span>
              </label>
              <RichTextEditor 
                key={postData?.id || 'editor'}
                initialContent={content} 
                onChange={(html) => {
                  setContent(html);
                  setFormErrors(p => ({...p, content: undefined}));
                }} 
              />
              {formErrors.content && <p className="mt-2 text-sm font-bold text-red-500">{formErrors.content}</p>}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          {/* AI Panel (Only visible if AI generated) */}
          {isAiGenerated && postData?.aiMetadata && (
            <div className="bg-purple-50 dark:bg-purple-500/5 rounded-3xl p-6 border border-purple-100 dark:border-purple-500/20 shadow-sm">
              <h2 className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Sparkles size={16} /> AI Generation Data
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-purple-400 dark:text-purple-500/70 mb-1 font-bold">
                    Source Topic
                  </p>
                  <p className="text-sm font-medium text-purple-900 dark:text-purple-200">
                    {postData.aiMetadata.source.replace('|', ' + ')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-purple-400 dark:text-purple-500/70 mb-1 font-bold">
                    Model Origin
                  </p>
                  <p className="text-sm font-medium text-purple-900 dark:text-purple-200 font-mono bg-purple-100 dark:bg-purple-500/20 inline-block px-2 py-0.5 rounded">
                    {postData.aiMetadata.origin}
                  </p>
                </div>
                <div className="flex items-start gap-2 bg-white/50 dark:bg-[#111111]/50 p-3 rounded-xl border border-purple-200 dark:border-purple-500/20">
                  <AlertCircle size={16} className="text-purple-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-purple-800 dark:text-purple-300 font-medium">
                    This draft was autonomously generated by the cron pipeline. Review carefully
                    before publishing.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Publishing Settings */}
          <div className="bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl rounded-[2rem] p-6 border border-gray-200/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Settings size={16} /> Publishing
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-[13px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-1.5">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-white dark:bg-[#151515] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-[15px] font-bold rounded-xl px-4 py-2.5 min-h-[48px] focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all"
                >
                  <option value="DRAFT">DRAFT</option>
                  <option value="REVIEWED">REVIEWED</option>
                  <option value="PUBLISHED">PUBLISHED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>
              <div>
                <label className="text-[13px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-1.5">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => {
                    setCategoryId(e.target.value);
                    setFormErrors(p => ({...p, categoryId: undefined}));
                  }}
                  className={`w-full bg-white dark:bg-[#151515] border rounded-xl px-4 py-2.5 min-h-[48px] text-[15px] font-bold outline-none focus:ring-4 transition-all text-gray-900 dark:text-white ${
                    formErrors.categoryId
                      ? 'border-red-300 dark:border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-gray-200 dark:border-white/10 focus:border-indigo-500 focus:ring-indigo-500/20'
                  }`}
                >
                  <option value="">Select Category</option>
                  {categories.map((c: any, index) => {
                    const cId = typeof c === 'object' ? c.id || c.name : c;
                    const cName = typeof c === 'object' ? c.name : c;
                    return (
                      <option key={cId || index} value={cId}>
                        {cName}
                      </option>
                    );
                  })}
                </select>
                {formErrors.categoryId && <p className="mt-1.5 text-sm font-bold text-red-500">{formErrors.categoryId}</p>}
              </div>
              <div>
                <label className="text-[13px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-1.5">
                  Author
                </label>
                <SearchableAuthorSelect
                  value={authorId}
                  users={users}
                  onChange={async (newAuthorId) => {
                    setAuthorId(newAuthorId);
                    if (newAuthorId) {
                      try {
                        const posts = await blogService.getPosts({
                          authorId: newAuthorId,
                          limit: 1,
                        });
                        if (posts && posts.length > 0) {
                          const latestPost = posts[0] as any;
                          if (latestPost.authorDesignation)
                            setAuthorDesignation(latestPost.authorDesignation);
                          if (latestPost.authorBio) setAuthorBio(latestPost.authorBio);
                        }
                      } catch (err) {
                        console.error('Failed to fetch author history', err);
                      }
                    }
                  }}
                />
              </div>
              <div>
                <label className="text-[13px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-1.5">
                  Author Designation
                </label>
                <input
                  type="text"
                  value={authorDesignation}
                  onChange={(e) => setAuthorDesignation(e.target.value)}
                  placeholder="e.g. Technology Consultant"
                  className="w-full bg-white dark:bg-[#151515] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-[15px] font-medium rounded-xl px-4 py-2.5 min-h-[48px] focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-[13px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-1.5">
                  Author Bio
                </label>
                <textarea
                  value={authorBio}
                  onChange={(e) => setAuthorBio(e.target.value)}
                  placeholder="e.g. Professional engineers crafting clean code..."
                  className="w-full bg-white dark:bg-[#151515] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-[15px] font-medium rounded-xl px-4 py-2.5 min-h-[80px] focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Cover Image Upload */}
          <div className="bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl rounded-[2rem] p-6 border border-gray-200/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <ImageIcon size={16} /> Cover Image
            </h2>
            {postData?.coverImageUrl && !coverFile ? (
              <div className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-white/10">
                <img
                  src={postData.coverImageUrl}
                  alt="Cover"
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <label className="bg-white text-black px-4 py-2 rounded-lg font-bold text-xs shadow-lg cursor-pointer">
                    Replace Image
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                    />
                  </label>
                </div>
              </div>
            ) : (
              <label className="border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl p-6 text-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer group block">
                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <ImageIcon size={20} />
                </div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {coverFile ? coverFile.name : 'Upload Cover Image'}
                </p>
                <p className="text-xs text-gray-500 mt-1">Recommended: 1200x630px</p>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                />
              </label>
            )}
          </div>

          {/* SEO & Tags */}
          <div className="bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl rounded-[2rem] p-6 border border-gray-200/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <LinkIcon size={16} /> SEO & Tags
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-[13px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-1.5">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full bg-white dark:bg-[#151515] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-[15px] font-medium rounded-xl px-4 py-2.5 min-h-[48px] focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all"
                  placeholder="e.g. AI, Startups, React"
                />
              </div>
              <div>
                <label className="text-[13px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-1.5">
                  Meta Description
                </label>
                <textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  className="w-full bg-white dark:bg-[#151515] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-[15px] font-medium rounded-xl p-4 min-h-[80px] focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all resize-none"
                  placeholder="Override default excerpt for SEO..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white dark:bg-[#111111] rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-200 dark:border-white/10 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 backdrop-blur-sm">
              <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Eye size={20} className="text-indigo-500" /> Live Article Preview
              </h3>
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 min-h-[44px] text-sm font-bold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white bg-white hover:bg-gray-100 dark:bg-[#151515] dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl transition-all shadow-sm flex items-center justify-center"
              >
                Close Preview
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto p-6 sm:p-10 space-y-12 flex-grow bg-white dark:bg-[#0a0a0a]">
              {/* Cover Image Preview */}
              {(coverFile || postData?.coverImageUrl) && (
                <div className="w-full max-w-4xl mx-auto aspect-video md:aspect-[21/9] rounded-3xl overflow-hidden shadow-xl border border-gray-100 dark:border-white/5">
                  <img
                    src={
                      coverFile ? URL.createObjectURL(coverFile) : postData?.coverImageUrl || ''
                    }
                    alt="Cover Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Article Header */}
              <div className="space-y-6 text-center max-w-3xl mx-auto">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {tags
                    .split(',')
                    .filter((t) => t.trim())
                    .map((tag, i) => (
                      <span
                        key={i}
                        className="px-4 py-1.5 bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 text-xs font-bold rounded-full border border-indigo-100 dark:border-indigo-500/20"
                      >
                        #{tag.trim()}
                      </span>
                    ))}
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight tracking-tight">
                  {title || 'Untitled Post'}
                </h1>
                {excerpt && (
                  <p className="text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                    {excerpt}
                  </p>
                )}
              </div>

              <hr className="border-gray-100 dark:border-white/5 w-24 mx-auto border-t-4 rounded-full my-8" />

              {/* Article Content */}
              <div
                className="max-w-3xl mx-auto text-lg md:text-xl text-gray-800 dark:text-gray-200
                           [&_h1]:text-4xl [&_h1]:sm:text-5xl [&_h1]:font-black [&_h1]:tracking-tight [&_h1]:text-gray-900 dark:[&_h1]:text-white [&_h1]:mb-6
                           [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-gray-900 dark:[&_h2]:text-white [&_h2]:mb-4 [&_h2]:mt-8
                           [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:text-gray-900 dark:[&_h3]:text-white [&_h3]:mb-3 [&_h3]:mt-6
                           [&_h4]:text-xl [&_h4]:font-bold [&_h4]:text-gray-900 dark:[&_h4]:text-white [&_h4]:mb-2 [&_h4]:mt-4
                           [&_p]:mb-6 [&_p]:leading-relaxed
                           [&_ul]:list-disc [&_ul]:pl-8 [&_ul]:mb-6 [&_ol]:list-decimal [&_ol]:pl-8 [&_ol]:mb-6 [&_li]:mb-2
                           [&_a]:text-indigo-600 [&_a]:underline hover:[&_a]:text-indigo-500
                           [&_img]:rounded-3xl [&_img]:shadow-xl [&_img]:mx-auto [&_img]:border [&_img]:border-gray-100 dark:[&_img]:border-white/5 [&_img]:my-8
                           [&_pre]:bg-gray-900 [&_pre]:text-gray-100 [&_pre]:rounded-2xl [&_pre]:p-6 [&_pre]:shadow-inner [&_pre]:my-6 [&_code]:font-mono
                           [&_blockquote]:border-l-4 [&_blockquote]:border-indigo-500 [&_blockquote]:pl-6 [&_blockquote]:italic [&_blockquote]:bg-gray-50 dark:[&_blockquote]:bg-white/5 [&_blockquote]:py-4 [&_blockquote]:pr-6 [&_blockquote]:rounded-r-2xl [&_blockquote]:my-6
                           [&_table]:!w-full [&_table]:!border-collapse [&_table]:!my-8 [&_table]:!rounded-xl [&_table]:!overflow-hidden [&_table]:!ring-1 [&_table]:!ring-gray-200 dark:[&_table]:!ring-white/10 [&_table]:!shadow-sm [&_thead]:!bg-gray-50 dark:[&_thead]:!bg-white/5 [&_th]:!border [&_th]:!border-gray-200 dark:[&_th]:!border-white/10 [&_th]:!p-4 [&_th]:!text-left [&_th]:!font-bold [&_th]:!text-gray-900 dark:[&_th]:!text-white [&_td]:!border [&_td]:!border-gray-200 dark:[&_td]:!border-white/10 [&_td]:!p-4 [&_td]:!text-gray-800 dark:[&_td]:!text-gray-300 [&_tr:hover]:!bg-gray-50 dark:[&_tr:hover]:!bg-white/5 [&_tr]:!transition-colors"
                dangerouslySetInnerHTML={{
                  __html:
                    content ||
                    "<p class='text-gray-400 italic text-center'>Start writing to see the preview here...</p>",
                }}
              />
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
