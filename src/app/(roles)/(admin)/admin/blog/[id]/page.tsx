"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { blogService, BlogPostDetail, BlogCategory } from "@/services/admin/blog.service";
import { 
  ArrowLeft, Save, Image as ImageIcon, Sparkles, AlertCircle, 
  Settings, Type, Link as LinkIcon, List, Heading, Bold, Italic,
  AlignLeft, AlignCenter, Code, Eye
} from "lucide-react";

function Toast({ message, type, onClose }: { message: string; type: "success" | "error" | "loading"; onClose: () => void }) {
  useEffect(() => {
    if (type !== "loading") {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [type, onClose]);

  return (
    <div className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg border text-sm font-bold flex items-center gap-2 ${
      type === "success" ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800" :
      type === "error" ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800" :
      "bg-white text-gray-700 border-gray-200 dark:bg-[#151515] dark:text-gray-300 dark:border-white/10"
    }`}>
      {type === "loading" && <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />}
      {message}
    </div>
  );
}

export default function BlogEditorPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPostDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("DRAFT");
  const [tags, setTags] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [categoryId, setCategoryId] = useState<string>("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "loading" } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    blogService.getCategories().then(setCategories);
    if (params?.id && params.id !== "new") {
      blogService.getPostDetail(params.id as string).then(data => {
        if (data) {
          setPost(data);
          setTitle(data.title);
          setExcerpt(data.excerpt || "");
          setContent(data.content || "");
          setStatus(data.status);
          setTags(data.tags?.join(", ") || "");
          setMetaDescription(data.metaDescription || "");
          setCategoryId(data.categoryId ? data.categoryId.toString() : "");
        }
        setIsLoading(false);
      });
    } else {
      setIsLoading(false); // New post mode
    }
  }, [params]);

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-gray-200 dark:border-white/10 border-t-indigo-600 dark:border-t-indigo-500 animate-spin"></div>
      </div>
    );
  }

  const isAiGenerated = post?.isAiGenerated || false;

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setToast({ message: "Saving post...", type: "loading" });
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (excerpt) formData.append("excerpt", excerpt);
      if (categoryId) formData.append("categoryId", categoryId);
      if (metaDescription) formData.append("metaDescription", metaDescription);
      
      const tagArray = tags.split(",").map(t => t.trim()).filter(Boolean);
      tagArray.forEach(t => formData.append("tags", t));
      
      if (coverFile) {
        formData.append("coverImage", coverFile);
      }

      if (!params?.id || params?.id === "new") {
        await blogService.createPost(formData);
        setToast({ message: "Post created successfully", type: "success" });
        setTimeout(() => router.push('/admin/blog'), 1000);
      } else {
        await blogService.updatePost(params?.id as string, formData);
        
        // Also update status if changed
        if (status && status !== post?.status && (status === "PUBLISHED" || status === "DRAFT")) {
          await blogService.updatePostStatus(params?.id as string, status as any);
        }
        setToast({ message: "Post saved successfully", type: "success" });
      }
    } catch (error: any) {
      setToast({ message: error.response?.data?.message || "Failed to save post", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#111111] p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/admin/blog')}
            className="p-2 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-gray-900 dark:text-white truncate max-w-sm lg:max-w-xl">
                {title || "Untitled Post"}
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
          <button className="bg-white dark:bg-[#151515] border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center gap-2">
            <Eye size={16} /> Preview
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50">
            <Save size={16} /> {isSaving ? "Saving..." : "Save Post"}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Main Editor Column */}
        <div className="flex-1 space-y-6">
          <div className="bg-white dark:bg-[#111111] rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-white/5 shadow-sm space-y-6">
            
            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Post Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter an engaging title..."
                className="w-full text-2xl font-black bg-transparent border-0 border-b-2 border-gray-100 dark:border-white/5 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-0 px-0 py-2 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-700"
              />
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

            {/* Rich Text Editor Mock */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Content</label>
              <div className="border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 transition-shadow bg-white dark:bg-[#151515]">
                {/* Formatting Toolbar */}
                <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-white/10">
                  <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors"><Bold size={16} /></button>
                  <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors"><Italic size={16} /></button>
                  <div className="w-px h-6 bg-gray-300 dark:bg-white/10 mx-1"></div>
                  <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors"><Heading size={16} /></button>
                  <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors"><Type size={16} /></button>
                  <div className="w-px h-6 bg-gray-300 dark:bg-white/10 mx-1"></div>
                  <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors"><AlignLeft size={16} /></button>
                  <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors"><AlignCenter size={16} /></button>
                  <div className="w-px h-6 bg-gray-300 dark:bg-white/10 mx-1"></div>
                  <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors"><List size={16} /></button>
                  <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors"><LinkIcon size={16} /></button>
                  <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors"><ImageIcon size={16} /></button>
                  <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors"><Code size={16} /></button>
                </div>
                {/* Editable Area */}
                <div 
                  className="p-6 min-h-[500px] text-gray-800 dark:text-gray-200 prose dark:prose-invert max-w-none focus:outline-none"
                  contentEditable
                  dangerouslySetInnerHTML={{ __html: content }}
                  onInput={(e) => setContent(e.currentTarget.innerHTML)}
                />
              </div>
            </div>

          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          
          {/* AI Panel (Only visible if AI generated) */}
          {isAiGenerated && post?.aiMetadata && (
            <div className="bg-purple-50 dark:bg-purple-500/5 rounded-3xl p-6 border border-purple-100 dark:border-purple-500/20 shadow-sm">
              <h2 className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Sparkles size={16} /> AI Generation Data
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-purple-400 dark:text-purple-500/70 mb-1 font-bold">Source Topic</p>
                  <p className="text-sm font-medium text-purple-900 dark:text-purple-200">{post.aiMetadata.source.replace("|", " + ")}</p>
                </div>
                <div>
                  <p className="text-xs text-purple-400 dark:text-purple-500/70 mb-1 font-bold">Model Origin</p>
                  <p className="text-sm font-medium text-purple-900 dark:text-purple-200 font-mono bg-purple-100 dark:bg-purple-500/20 inline-block px-2 py-0.5 rounded">{post.aiMetadata.origin}</p>
                </div>
                <div className="flex items-start gap-2 bg-white/50 dark:bg-[#111111]/50 p-3 rounded-xl border border-purple-200 dark:border-purple-500/20">
                  <AlertCircle size={16} className="text-purple-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-purple-800 dark:text-purple-300 font-medium">
                    This draft was autonomously generated by the cron pipeline. Review carefully before publishing.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Publishing Settings */}
          <div className="bg-white dark:bg-[#111111] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Settings size={16} /> Publishing
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5">Status</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-sm font-bold rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="DRAFT">DRAFT</option>
                  <option value="REVIEWED">REVIEWED</option>
                  <option value="PUBLISHED">PUBLISHED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5">Category</label>
                <select 
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-sm font-medium rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500">
                  <option value="">Select Category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Cover Image Upload */}
          <div className="bg-white dark:bg-[#111111] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <ImageIcon size={16} /> Cover Image
            </h2>
            {post?.coverImageUrl && !coverFile ? (
              <div className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-white/10">
                <img src={post.coverImageUrl} alt="Cover" className="w-full h-32 object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <label className="bg-white text-black px-4 py-2 rounded-lg font-bold text-xs shadow-lg cursor-pointer">
                    Replace Image
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} />
                  </label>
                </div>
              </div>
            ) : (
              <label className="border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl p-6 text-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer group block">
                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <ImageIcon size={20} />
                </div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {coverFile ? coverFile.name : "Upload Cover Image"}
                </p>
                <p className="text-xs text-gray-500 mt-1">Recommended: 1200x630px</p>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} />
              </label>
            )}
          </div>

          {/* SEO & Tags */}
          <div className="bg-white dark:bg-[#111111] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <LinkIcon size={16} /> SEO & Tags
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5">Tags (Comma separated)</label>
                <input 
                  type="text" 
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-sm font-medium rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. AI, Startups, React"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5">Meta Description</label>
                <textarea 
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-sm font-medium rounded-xl p-3 min-h-[80px] focus:ring-2 focus:ring-indigo-500 resize-none"
                  placeholder="Override default excerpt for SEO..."
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
