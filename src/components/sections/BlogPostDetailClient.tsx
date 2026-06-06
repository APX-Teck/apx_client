"use client";

import { useState, useEffect } from "react";
import { useForm, FieldValues } from "react-hook-form";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Calendar, Clock, Heart, Share2, Send, MessageSquare, AlertCircle, CheckCircle2, ChevronRight, User } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/axios";
import { BlogPost, BlogComment } from "@/app/types/blog.types";
import { AdBanner } from "@/components/ui/AdBanner";

interface BlogPostDetailClientProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
  initialComments: BlogComment[];
}

export function BlogPostDetailClient({
  post,
  relatedPosts,
  initialComments
}: BlogPostDetailClientProps) {
  const [likes, setLikes] = useState(12); // Simulated starting count
  const [hasLiked, setHasLiked] = useState(false);
  const [comments, setComments] = useState<BlogComment[]>(initialComments);
  const [commentStatus, setCommentStatus] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    }
  }, []);

  const handleLike = async () => {
    if (hasLiked) {
      setLikes((l) => l - 1);
      setHasLiked(false);
    } else {
      setLikes((l) => l + 1);
      setHasLiked(true);
      // Optimistic trigger to backend
      try {
        await api.likeBlogPost(post.slug);
      } catch (err) {
        console.error("Failed to sync like on backend", err);
      }
    }
  };

  const onCommentSubmit = async (values: FieldValues) => {
    setIsSubmittingComment(true);
    setCommentStatus("");
    
    try {
      const userFullName = "Client Partner"; // Mock default if actual user profile details aren't stored
      const res = await api.submitBlogComment(post.slug, values.commentText, userFullName);
      if (res.success) {
        setCommentStatus("Your comment is under review. It will appear once approved by the administrator.");
        reset();
      }
    } catch {
      setCommentStatus("Failed to submit comment. Try again.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post.title);
    
    let shareUrl = "";
    if (platform === "twitter") {
      shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
    } else if (platform === "linkedin") {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    } else if (platform === "whatsapp") {
      shareUrl = `https://api.whatsapp.com/send?text=${title}%20${url}`;
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Article link copied to clipboard!");
      return;
    }
    window.open(shareUrl, "_blank");
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Recent";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // Inject Ad banner dynamically after paragraph 3
  const renderContentWithAds = () => {
    const paragraphs = post.content.split("</p>");
    if (paragraphs.length <= 3) {
      return (
        <div
          className="prose dark:prose-invert max-w-none text-foreground/80 text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      );
    }

    const part1 = paragraphs.slice(0, 3).join("</p>") + "</p>";
    const part2 = paragraphs.slice(3).join("</p>");

    return (
      <div className="space-y-6">
        <div
          className="prose dark:prose-invert max-w-none text-foreground/80 text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: part1 }}
        />
        
        {/* Ad mid-placement */}
        <AdBanner placement="BLOG_POST_MID" className="my-8" />
        
        <div
          className="prose dark:prose-invert max-w-none text-foreground/80 text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: part2 }}
        />
      </div>
    );
  };

  return (
    <section className="max-w-7xl mx-auto px-6">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-foreground/50 font-medium mb-8">
        <Link href="/" className="hover:text-accent transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/explore-news" className="hover:text-accent transition-colors">Explore News</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground/80 truncate max-w-[200px]">{post.title}</span>
      </div>

      <div className="grid lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Main Article */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Header */}
          <div className="space-y-4">
            <span className="inline-block px-3 py-1 rounded-full bg-accent/15 border border-accent/25 text-accent text-[10px] font-bold uppercase tracking-wider">
              {post.tags[0] || "Insight"}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.15]">
              {post.title}
            </h1>
            
            {/* Author */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-y border-glass-border py-4 text-xs text-foreground/60">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center font-bold text-accent uppercase">
                  {post.author?.fullName[0] || "A"}
                </div>
                <div>
                  <p className="font-bold text-foreground">{post.author?.fullName || "APX Architect"}</p>
                  <p className="text-[10px] text-foreground/45 mt-0.5">{formatDate(post.publishedAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 5 min read</span>
                
                {/* Share buttons */}
                <div className="flex gap-2">
                  <button onClick={() => handleShare("twitter")} className="hover:text-accent" aria-label="Share on Twitter">🐦</button>
                  <button onClick={() => handleShare("linkedin")} className="hover:text-accent" aria-label="Share on LinkedIn">💼</button>
                  <button onClick={() => handleShare("whatsapp")} className="hover:text-accent" aria-label="Share on WhatsApp">💬</button>
                </div>
              </div>
            </div>
          </div>

          {/* Cover image */}
          {post.coverImageUrl && (
            <div className="w-full h-96 rounded-3xl overflow-hidden border border-glass-border shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.coverImageUrl}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Ad Top */}
          <AdBanner placement="BLOG_POST_TOP" />

          {/* Body Content */}
          <div className="bg-transparent text-foreground/90 leading-relaxed font-normal">
            {renderContentWithAds()}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-6 border-t border-glass-border">
            {post.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-glass-border text-foreground/60 text-xs font-semibold uppercase tracking-wider">
                #{tag}
              </span>
            ))}
          </div>

          {/* Ad Bottom */}
          <AdBanner placement="BLOG_POST_BOTTOM" />

          {/* Like Optimistic UI bar */}
          <div className="flex items-center gap-4 py-4 px-6 rounded-2xl glass-panel border border-glass-border max-w-xs">
            <button
              onClick={handleLike}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                hasLiked ? "bg-accent/20 text-accent scale-110" : "bg-white/5 text-foreground/60 hover:bg-white/10 hover:text-foreground"
              }`}
              aria-label="Like post"
            >
              <Heart className={`w-5 h-5 ${hasLiked ? "fill-current" : ""}`} />
            </button>
            <div>
              <p className="font-bold text-sm text-foreground">{likes} Likes</p>
              <p className="text-[10px] text-foreground/45">Recommend this article</p>
            </div>
          </div>

          {/* Comments Panel */}
          <div className="space-y-6 pt-12 border-t border-glass-border">
            <h3 className="text-2xl font-bold tracking-tight">Article Comments</h3>
            
            {/* Form */}
            {isLoggedIn ? (
              <GlassCard className="p-6 border border-glass-border relative z-10">
                <h4 className="font-bold text-sm mb-4">Leave a Comment</h4>
                
                {commentStatus && (
                  <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-semibold flex gap-2 items-center">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{commentStatus}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit(onCommentSubmit)} className="space-y-4">
                  <div className="space-y-1">
                    <textarea
                      rows={3}
                      {...register("commentText", {
                        required: "Comment is required",
                        minLength: { value: 10, message: "Comment must be at least 10 characters" },
                        maxLength: { value: 500, message: "Comment cannot exceed 500 characters" }
                      })}
                      className="w-full bg-foreground/[0.02] border border-glass-border rounded-xl px-4 py-3 outline-none text-xs resize-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                      placeholder="Share your thoughts on this topic..."
                    />
                    {errors.commentText && (
                      <p className="text-xs text-rose-500 font-medium pl-1">{String(errors.commentText.message)}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmittingComment}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-accent text-white px-5 text-xs font-semibold shadow-md shadow-accent/15 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Comment</span>
                  </button>
                </form>
              </GlassCard>
            ) : (
              <div className="p-6 rounded-2xl border border-glass-border bg-white/[0.01] text-center text-xs space-y-2">
                <p className="text-foreground/50">You must be signed in to post comments.</p>
                <Link href={`/login?redirect=/explore-news/${post.slug}`} className="inline-block text-accent font-semibold hover:underline">
                  Sign In to Comment →
                </Link>
              </div>
            )}

            {/* List */}
            <div className="space-y-4">
              {comments.filter(c => c.status === "APPROVED").length === 0 ? (
                <p className="text-xs text-foreground/45 italic pl-1">No comments approved yet. Be the first to share your thoughts!</p>
              ) : (
                comments
                  .filter((c) => c.status === "APPROVED")
                  .map((comment) => (
                    <div key={comment.id} className="p-5 rounded-2xl bg-foreground/[0.01] border border-glass-border flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center font-bold text-accent text-xs shrink-0 uppercase">
                        {comment.user.fullName[0]}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-foreground">{comment.user.fullName}</span>
                          <span className="text-[9px] text-foreground/45">{formatDate(comment.createdAt)}</span>
                        </div>
                        <p className="text-xs text-foreground/85 leading-relaxed">{comment.commentText}</p>
                      </div>
                    </div>
                  ))
              )}
            </div>

          </div>

        </div>

        {/* Right Sidebar (Desktop layout) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Author Card */}
          <GlassCard className="p-6 border border-glass-border">
            <h4 className="font-bold text-sm mb-4">About Author</h4>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center font-bold text-accent uppercase">
                {post.author?.fullName[0] || "A"}
              </div>
              <div>
                <p className="font-extrabold text-sm">{post.author?.fullName || "APX Author"}</p>
                <p className="text-[10px] text-foreground/50">Technology Consultant</p>
              </div>
            </div>
            <p className="text-[11px] text-foreground/60 leading-relaxed mt-4">
              Professional engineers crafting clean code architectures and visual portfolios for SMBs.
            </p>
          </GlassCard>

          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <GlassCard className="p-6 border border-glass-border">
              <h4 className="font-bold text-sm mb-4">Related Insights</h4>
              <div className="space-y-4">
                {relatedPosts.map((r) => (
                  <Link key={r.id} href={`/explore-news/${r.slug}`} className="block group">
                    <div className="space-y-1">
                      <h5 className="font-bold text-xs text-foreground group-hover:text-accent transition-colors line-clamp-2 leading-snug">
                        {r.title}
                      </h5>
                      <span className="text-[9px] text-foreground/45">{formatDate(r.publishedAt)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </GlassCard>
          )}

        </div>

      </div>

    </section>
  );
}
