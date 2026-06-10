"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Edit3, Eye, Sparkles, CheckCircle2, FileText, XCircle, Clock, Trash2, Search, AlertCircle, LayoutGrid } from "lucide-react";
import { blogService, BlogPost, BlogPostStatus } from "@/services/admin/blog.service";
import { format } from "date-fns";

/* ─── tiny inline toast ─── */
function Toast({ message, type, onClose }: { message: string; type: "success" | "error" | "loading"; onClose: () => void }) {
  useEffect(() => {
    if (type === "loading") return;
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose, type]);

  const bg = type === "success" ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20" : type === "error" ? "bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:border-red-500/20" : "bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-500/10 dark:border-indigo-500/20";
  return (
    <div className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-xl border shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5 ${bg}`}>
      {type === "success" && <CheckCircle2 size={18} />}
      {type === "error" && <AlertCircle size={18} />}
      {type === "loading" && <div className="w-4 h-4 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>}
      <p className="text-sm font-bold">{message}</p>
      {type !== "loading" && (
        <button onClick={onClose} className="ml-2 hover:opacity-70"><XCircle size={16} /></button>
      )}
    </div>
  );
}

export default function BlogManagementPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "loading" } | null>(null);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const data = await blogService.getPosts();
      setPosts(data || []);
    } catch (error) {
      setToast({ message: "Failed to fetch posts", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      try {
        setToast({ message: "Deleting post...", type: "loading" });
        await blogService.deletePost(id);
        setToast({ message: "Post deleted successfully", type: "success" });
        fetchPosts();
      } catch (error) {
        setToast({ message: "Failed to delete post", type: "error" });
      }
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: BlogPostStatus) => {
    try {
      setToast({ message: "Updating status...", type: "loading" });
      await blogService.updatePostStatus(id, newStatus);
      setToast({ message: `Post is now ${newStatus}`, type: "success" });
      fetchPosts();
    } catch (error) {
      setToast({ message: "Failed to update post status", type: "error" });
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusConfig = (status: BlogPostStatus) => {
    switch(status) {
      case "PUBLISHED": return { color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10", border: "border-emerald-100 dark:border-emerald-500/20", icon: CheckCircle2 };
      case "UPDATED": return { color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10", border: "border-blue-100 dark:border-blue-500/20", icon: CheckCircle2 };
      case "DRAFT": return { color: "text-gray-600 dark:text-gray-400", bg: "bg-gray-100 dark:bg-white/5", border: "border-gray-200 dark:border-white/10", icon: FileText };
      case "REVIEWED": return { color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10", border: "border-amber-100 dark:border-amber-500/20", icon: Clock };
      case "REJECTED": return { color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-500/10", border: "border-red-100 dark:border-red-500/20", icon: XCircle };
      default: return { color: "text-gray-600", bg: "bg-gray-50", border: "border-gray-200", icon: FileText };
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400">
              <LayoutGrid size={24} />
            </div>
            Blog Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-2">
            Manage articles, AI drafts, categories, and publications.
          </p>
        </div>
        <button 
          onClick={() => router.push('/admin/blog/new')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm flex items-center gap-2 shrink-0"
        >
          <Edit3 size={18} />
          Write New Post
        </button>
      </div>

      {/* Main Content Area */}
      <div className="bg-white dark:bg-[#111111] rounded-3xl border border-gray-100 dark:border-white/5 shadow-[0px_4px_20px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50 dark:bg-[#1a1a1a]/50">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search posts by title, slug, or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all"
            />
          </div>
        </div>

        {/* Posts List Grid */}
        <div className="p-6 overflow-auto bg-gray-50 dark:bg-[#151515] min-h-[400px]">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-indigo-100 dark:border-indigo-500/20 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Loading posts...</p>
              </div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-white dark:bg-[#222] rounded-full flex items-center justify-center mb-4 border border-gray-100 dark:border-white/5">
                <FileText className="text-gray-400 dark:text-gray-500" size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No posts found</h3>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 max-w-md">
                We couldn't find any blog posts matching "{searchTerm}".
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredPosts.map((post) => {
                const config = getStatusConfig(post.status);
                const StatusIcon = config.icon;

                return (
                  <div key={post.id} className="bg-white dark:bg-[#111111] p-5 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all flex flex-col group relative">
                    
                    {/* Top Right Status Control */}
                    <div className="absolute top-5 right-5 z-10 flex flex-col items-end gap-1">
                       <select
                        value={post.status}
                        onChange={(e) => handleUpdateStatus(String(post.id), e.target.value as BlogPostStatus)}
                        className={`appearance-none cursor-pointer pl-8 pr-4 py-1.5 text-[11px] font-bold rounded-lg border uppercase tracking-wider transition-colors outline-none ${config.bg} ${config.color} ${config.border} hover:opacity-80`}
                      >
                        <option value="DRAFT">DRAFT</option>
                        <option value="REVIEWED">REVIEWED</option>
                        <option value="PUBLISHED">PUBLISHED</option>
                        <option value="REJECTED">REJECTED</option>
                        <option value="UPDATED">UPDATED</option>
                      </select>
                      <StatusIcon size={14} className={`absolute left-2.5 top-1/2 -translate-y-1/2 ${config.color}`} pointerEvents="none" />
                    </div>

                    <div className="flex gap-4 items-start mb-4 pr-32">
                      <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                         {post.isAiGenerated ? <Sparkles size={24} /> : <FileText size={24} />}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2" title={post.title}>
                          {post.title}
                        </h3>
                        <p className="text-xs font-mono text-gray-500 dark:text-gray-400 mt-1 bg-gray-100 dark:bg-[#222] px-2 py-0.5 rounded inline-block truncate max-w-full">
                          /{post.slug}
                        </p>
                      </div>
                    </div>

                    <div className="mt-auto grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 dark:bg-[#151515] p-3 rounded-2xl border border-gray-100 dark:border-white/5">
                        <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">Author</p>
                        <p className="font-bold text-gray-900 dark:text-white flex items-center text-sm gap-2">
                           <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-[10px] text-indigo-600 dark:text-indigo-400">{post.authorName.charAt(0)}</span>
                          {post.authorName}
                        </p>
                      </div>
                      <div className="bg-gray-50 dark:bg-[#151515] p-3 rounded-2xl border border-gray-100 dark:border-white/5">
                        <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">Category</p>
                        <p className="font-bold text-gray-900 dark:text-white text-sm">
                          {post.category?.name || post.category || "Uncategorized"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-white/5">
                      <button 
                        onClick={() => router.push(`/admin/blog/${post.id}`)}
                        className="flex-1 bg-white dark:bg-[#151515] border border-gray-200 dark:border-white/10 hover:border-indigo-500 hover:text-indigo-600 dark:hover:border-indigo-400 dark:hover:text-indigo-400 px-4 py-2 rounded-xl font-bold text-xs transition-colors text-gray-700 dark:text-gray-300 flex items-center justify-center gap-2"
                      >
                        <Edit3 size={14} /> Full Editor
                      </button>
                      {post.status === "PUBLISHED" && (
                        <button 
                          className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:text-emerald-400 dark:hover:bg-emerald-500/10 rounded-xl transition-colors border border-transparent hover:border-emerald-200 dark:hover:border-emerald-500/20"
                          title="View Live"
                        >
                          <Eye size={18} />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(String(post.id))}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-500/10 rounded-xl transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-500/20"
                        title="Delete Post"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
