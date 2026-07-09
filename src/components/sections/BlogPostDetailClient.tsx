'use client';

import { useState, useEffect } from 'react';
import { useForm, FieldValues } from 'react-hook-form';
import { motion, useScroll, useSpring } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import {
  Calendar,
  Clock,
  Heart,
  Share2,
  Send,
  MessageSquare,
  CheckCircle2,
  ChevronRight,
  User,
  Eye,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/axios';
import { BlogPost, BlogComment } from '@/app/types/blog.types';
import { AdBanner } from '@/components/ui/AdBanner';
import { AvailableAdSlots } from '@/components/ui/AvailableAdSlots';
import { FaFacebookF, FaInstagram, FaXTwitter, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa6';

interface BlogPostDetailClientProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
  initialComments: BlogComment[];
}

export function BlogPostDetailClient({
  post,
  relatedPosts,
  initialComments,
}: BlogPostDetailClientProps) {
  const [likes, setLikes] = useState(post._count?.likes || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [comments, setComments] = useState<BlogComment[]>(initialComments || []);
  const [commentStatus, setCommentStatus] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');

      const viewedKey = `viewed_${post.slug}`;
      if (!sessionStorage.getItem(viewedKey)) {
        sessionStorage.setItem(viewedKey, 'true');
        api
          .incrementBlogView(post.slug)
          .catch((err: any) => console.error('Failed to increment view on backend', err));
      }
    }
  }, [post.slug]);

  useEffect(() => {
    if (isLoggedIn) {
      api
        .getLikeStatus(post.slug)
        .then((res) => {
          if (res?.data?.hasLiked !== undefined) {
            setHasLiked(res.data.hasLiked);
          }
        })
        .catch((err) => console.error('Failed to fetch like status', err));
    }
  }, [isLoggedIn, post.slug]);

  const handleLike = async () => {
    if (!isLoggedIn) {
      window.location.href = `/login?redirect=/insights-news/${post.slug}`;
      return;
    }

    const previousLiked = hasLiked;
    const previousLikes = likes;

    if (hasLiked) {
      setLikes((l) => l - 1);
      setHasLiked(false);
    } else {
      setLikes((l) => l + 1);
      setHasLiked(true);
    }

    try {
      const res = await api.likeBlogPost(post.slug);
      if (res && res.success) {
        if (res.data?.totalLikes !== undefined) setLikes(res.data.totalLikes);
        if (res.data?.liked !== undefined) setHasLiked(res.data.liked);
      } else if (res && !res.success && res.success !== undefined) {
        // Revert optimistic update on failure
        setHasLiked(previousLiked);
        setLikes(previousLikes);
      }
    } catch (err) {
      setHasLiked(previousLiked);
      setLikes(previousLikes);
      console.error('Failed to sync like on backend', err);
    }
  };

  const onCommentSubmit = async (values: FieldValues) => {
    setIsSubmittingComment(true);
    setCommentStatus('');

    try {
      const res = await api.submitBlogComment(post.slug, values.commentText);
      if (res && res.success) {
        setCommentStatus('Your comment has been posted successfully.');
        if (res.data) {
          setComments((prev) => [...prev, res.data]);
        }
        reset();
      } else {
        setCommentStatus(res?.message || 'Failed to submit comment. Try again.');
      }
    } catch {
      setCommentStatus('Failed to submit comment. Try again.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post.title || 'APX Article');

    let shareUrl = '';
    if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
    } else if (platform === 'linkedin') {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    } else if (platform === 'whatsapp') {
      shareUrl = `https://api.whatsapp.com/send?text=${title}%20${url}`;
    } else if (platform === 'facebook') {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    } else if (platform === 'instagram') {
      navigator.clipboard.writeText(window.location.href);
      alert('Article link copied to clipboard! Share it on Instagram.');
      return;
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Article link copied to clipboard!');
      return;
    }
    window.open(shareUrl, '_blank');
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Recent';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Inject Ad banner safely without splitting HTML strings which can break the DOM
  const renderContentWithAds = () => {
    // Add responsive wrapper and SEO caption to tables
    const contentWithResponsiveTables = (post.content || '')
      .replace(/<table([^>]*)>/gi, '<div class="table-responsive-wrapper"><table$1><caption class="sr-only">Detailed data and specifications</caption>')
      .replace(/<\/table>/gi, '</table></div>');

    const proseClasses = "blog-content max-w-none " +
      // Base text
      "text-foreground/90 text-lg sm:text-[21px] leading-[1.8] font-normal tracking-wide " +
      "[&_p]:mb-10 [&_p]:text-foreground/85 [&_p]:text-pretty " +
      
      // Headings
      "[&_h1]:text-4xl sm:[&_h1]:text-5xl lg:[&_h1]:text-6xl [&_h1]:font-black [&_h1]:mt-16 [&_h1]:mb-8 [&_h1]:tracking-tighter [&_h1]:text-foreground [&_h1]:leading-[1.15] [&_h1]:text-balance " +
      "[&_h2]:text-3xl sm:[&_h2]:text-4xl [&_h2]:font-extrabold [&_h2]:mt-16 [&_h2]:mb-6 [&_h2]:tracking-tight [&_h2]:text-foreground [&_h2]:leading-[1.2] [&_h2]:text-balance " +
      "[&_h3]:text-2xl sm:[&_h3]:text-3xl [&_h3]:font-bold [&_h3]:mt-12 [&_h3]:mb-4 [&_h3]:tracking-tight [&_h3]:text-foreground [&_h3]:leading-[1.3] [&_h3]:text-pretty " +
      "[&_h4]:text-xl sm:[&_h4]:text-2xl [&_h4]:font-bold [&_h4]:mt-10 [&_h4]:mb-4 [&_h4]:tracking-tight [&_h4]:text-foreground [&_h4]:leading-snug " +
      
      // Inline Elements
      "[&_strong]:font-bold [&_strong]:text-foreground [&_strong]:tracking-normal " +
      "[&_b]:font-bold [&_b]:text-foreground [&_b]:tracking-normal " +
      "[&_em]:italic [&_i]:italic " +
      "[&_mark]:bg-accent/20 [&_mark]:text-foreground [&_mark]:px-1.5 [&_mark]:rounded-sm " +
      
      // Links
      "[&_a]:text-accent [&_a]:font-semibold [&_a]:underline [&_a]:underline-offset-8 [&_a]:decoration-accent/30 hover:[&_a]:decoration-accent hover:[&_a]:text-accent/90 [&_a]:transition-all [&_a]:duration-300 " +
      
      // Lists (Custom styled)
      "[&_ul]:list-none [&_ul]:pl-0 [&_ul]:mb-10 [&_ul]:space-y-5 [&_ul]:text-foreground/85 " +
      "[&_ul_li]:relative [&_ul_li]:pl-10 sm:[&_ul_li]:pl-12 [&_ul_li::before]:content-[''] [&_ul_li::before]:absolute [&_ul_li::before]:left-3 [&_ul_li::before]:top-[0.65em] [&_ul_li::before]:w-2.5 [&_ul_li::before]:h-2.5 [&_ul_li::before]:bg-accent [&_ul_li::before]:rounded-full [&_ul_li::before]:shadow-[0_0_12px_rgba(var(--accent),0.5)] " +
      "[&_ol]:list-none [&_ol]:pl-0 [&_ol]:mb-10 [&_ol]:space-y-5 [&_ol]:text-foreground/85 [&_ol]:[counter-reset:list-counter] " +
      "[&_ol_li]:relative [&_ol_li]:pl-10 sm:[&_ol_li]:pl-12 [&_ol_li]:[counter-increment:list-counter] [&_ol_li::before]:content-[counter(list-counter)_'.'] [&_ol_li::before]:absolute [&_ol_li::before]:left-2 [&_ol_li::before]:font-bold [&_ol_li::before]:text-accent [&_ol_li::before]:text-lg " +
      "[&_li>p]:mb-0 " +
      
      // Blockquote (Premium Callout)
      "[&_blockquote]:relative [&_blockquote]:border-l-4 [&_blockquote]:border-accent [&_blockquote]:pl-8 sm:[&_blockquote]:pl-12 [&_blockquote]:italic [&_blockquote]:bg-foreground/[0.02] dark:[&_blockquote]:bg-white/[0.02] [&_blockquote]:py-10 [&_blockquote]:pr-8 sm:[&_blockquote]:pr-10 [&_blockquote]:rounded-r-[2rem] [&_blockquote]:my-16 [&_blockquote]:text-foreground/90 [&_blockquote]:font-medium [&_blockquote]:text-xl sm:[&_blockquote]:text-2xl [&_blockquote]:leading-[1.7] [&_blockquote_p]:m-0 [&_blockquote]:shadow-sm " +
      "[&_blockquote::before]:content-['\"'] [&_blockquote::before]:absolute [&_blockquote::before]:-top-6 [&_blockquote::before]:left-4 [&_blockquote::before]:text-[100px] [&_blockquote::before]:text-accent/10 [&_blockquote::before]:font-serif [&_blockquote::before]:leading-none [&_blockquote::before]:select-none " +
      
      // Images
      "[&_img]:rounded-3xl [&_img]:shadow-2xl [&_img]:my-16 [&_img]:mx-auto [&_img]:max-w-full [&_img]:object-cover [&_img]:border [&_img]:border-glass-border [&_img]:transition-transform [&_img]:duration-700 hover:[&_img]:scale-[1.01] " +
      "[&_figure]:my-16 [&_figcaption]:text-center [&_figcaption]:text-[15px] [&_figcaption]:text-foreground/60 [&_figcaption]:mt-6 [&_figcaption]:italic [&_figcaption]:font-medium " +
      
      // Code and Pre
      "[&_code]:bg-foreground/[0.06] dark:[&_code]:bg-white/[0.08] [&_code]:text-accent [&_code]:px-2 [&_code]:py-1 [&_code]:rounded-md [&_code]:font-mono [&_code]:text-[0.85em] [&_code]:font-medium [&_code]:border [&_code]:border-glass-border " +
      "[&_pre]:bg-[#0a0a0a] dark:[&_pre]:bg-[#000000] [&_pre]:p-8 sm:[&_pre]:p-10 [&_pre]:rounded-3xl [&_pre]:overflow-x-auto [&_pre]:my-16 [&_pre]:border [&_pre]:border-white/10 [&_pre]:shadow-2xl [&_pre_code]:bg-transparent [&_pre_code]:text-gray-300 [&_pre_code]:p-0 [&_pre_code]:text-[0.9em] [&_pre_code]:border-none [&_pre_code]:font-normal " +
      
      // Tables (Modern SaaS style)
      "[&_.table-responsive-wrapper]:!w-full [&_.table-responsive-wrapper]:!overflow-x-auto [&_.table-responsive-wrapper]:!my-16 [&_.table-responsive-wrapper]:!rounded-3xl [&_.table-responsive-wrapper]:!border [&_.table-responsive-wrapper]:!border-glass-border [&_.table-responsive-wrapper]:!shadow-lg [&_.table-responsive-wrapper]:!bg-white dark:[&_.table-responsive-wrapper]:!bg-[#0a0a0a] " +
      "[&_table]:!w-full [&_table]:!min-w-[600px] [&_table]:!border-collapse [&_table]:!text-left [&_table]:!text-base [&_table]:!m-0 " +
      "[&_thead]:!bg-foreground/[0.02] dark:[&_thead]:!bg-white/[0.03] [&_th]:!p-6 [&_th]:!font-bold [&_th]:!text-foreground [&_th]:!border-b [&_th]:!border-glass-border [&_th]:!whitespace-nowrap " +
      "[&_td]:!p-6 [&_td]:!text-foreground/80 [&_td]:!border-b [&_td]:!border-glass-border/40 [&_tr:last-child_td]:!border-b-0 " +
      "[&_tr:hover_td]:!bg-foreground/[0.02] dark:[&_tr:hover_td]:!bg-white/[0.02] [&_tr]:!transition-colors " +
      
      // HR
      "[&_hr]:my-20 [&_hr]:border-0 [&_hr]:h-px [&_hr]:bg-gradient-to-r [&_hr]:from-transparent [&_hr]:via-glass-border [&_hr]:to-transparent";

    return (
      <div className="space-y-6 sm:space-y-8">
        <div
          className={proseClasses}
          dangerouslySetInnerHTML={{ __html: contentWithResponsiveTables }}
        />
        {/* Ad mid-placement moved here to prevent DOM breakage */}
        <AdBanner placement="BLOG_POST_MID" className="my-8 sm:my-12" />
      </div>
    );
  };

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-accent z-50 origin-left"
        style={{ scaleX }}
      />
      <article className="max-w-7xl mx-auto px-4 sm:px-6">
      {/* Breadcrumbs */}
      <div
        className="flex flex-wrap items-center gap-2 text-xs text-foreground/50 font-medium mb-8 notranslate"
        translate="no"
      >
        <Link href="/" className="hover:text-accent transition-colors shrink-0">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/insights-news" className="hover:text-accent transition-colors">
          Explore News
        </Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <span className="text-foreground/80 truncate max-w-full sm:max-w-[200px] shrink-0">{post.title}</span>
      </div>

      <div className="grid lg:grid-cols-12 gap-12 items-start">
        {/* Left Main Article */}
        <div className="lg:col-span-8 space-y-8 min-w-0">
          {/* Header */}
          <header className="space-y-4">
            <span className="inline-block px-3 py-1 rounded-full bg-accent/15 border border-accent/25 text-accent text-[10px] font-bold uppercase tracking-wider">
              {(post.tags || [])[0] || 'Insight'}
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.3] sm:leading-[1.15] break-words text-foreground">
              {post.title}
            </h1>

            {/* Author */}
            <div
              className="flex flex-col md:flex-row md:items-center justify-between gap-6 mt-8 pt-8 border-t border-glass-border/60 pb-2 text-sm text-foreground/70 notranslate"
              translate="no"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-accent/10 border-2 border-accent/20 flex items-center justify-center font-bold text-accent uppercase overflow-hidden shrink-0 shadow-sm">
                  {post.author?.profilePhotoUrl || post.author?.profile?.profilePhotoUrl ? (
                    <Image
                      src={
                        post.author.profilePhotoUrl || post.author.profile?.profilePhotoUrl || ''
                      }
                      alt={post.author.fullName || 'Author'}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  ) : post.author?.fullName ? (
                    <Image
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.fullName.includes('APX Blog Bot') ? 'APX Teck' : post.author.fullName)}&background=4f46e5&color=fff`}
                      alt={post.author.fullName}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    'A'
                  )}
                </div>
                <div>
                  <p className="font-bold text-base sm:text-lg text-foreground tracking-tight">
                    {post.author?.fullName?.includes('APX Blog Bot')
                      ? 'APX Teck'
                      : post.author?.fullName || 'APX Architect'}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <time dateTime={post.publishedAt || undefined} className="text-xs sm:text-sm font-medium text-foreground/60">
                      {formatDate(post.publishedAt)}
                    </time>
                    <span className="w-1 h-1 rounded-full bg-foreground/30"></span>
                    <span className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-accent">
                      <Clock className="w-3.5 h-3.5" /> 5 min read
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Share buttons */}
                <div className="flex items-center gap-2 bg-foreground/[0.02] dark:bg-white/[0.02] p-1.5 rounded-full border border-glass-border">
                  <button
                    onClick={() => handleShare('facebook')}
                    className="w-9 h-9 rounded-full flex items-center justify-center hover:text-white hover:bg-[#1877F2] transition-colors"
                    aria-label="Share on Facebook"
                  >
                    <FaFacebookF className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="w-9 h-9 rounded-full flex items-center justify-center hover:text-white hover:bg-black dark:hover:bg-white dark:hover:text-black transition-colors"
                    aria-label="Share on X (Twitter)"
                  >
                    <FaXTwitter className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="w-9 h-9 rounded-full flex items-center justify-center hover:text-white hover:bg-[#0A66C2] transition-colors"
                    aria-label="Share on LinkedIn"
                  >
                    <FaLinkedinIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleShare('whatsapp')}
                    className="w-9 h-9 rounded-full flex items-center justify-center hover:text-white hover:bg-[#25D366] transition-colors"
                    aria-label="Share on WhatsApp"
                  >
                    <FaWhatsapp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleShare('instagram')}
                    className="w-9 h-9 rounded-full flex items-center justify-center hover:text-white hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] transition-all"
                    aria-label="Copy link for Instagram"
                  >
                    <FaInstagram className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Cover image */}
          {post.coverImageUrl && (
            <figure className="w-full mt-10 mb-16">
              <div className="w-full h-[400px] md:h-[550px] rounded-[2rem] overflow-hidden border border-glass-border shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] bg-accent/5 relative group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <Image
                  src={post.coverImageUrl}
                  alt={`${post.title} article hero image`}
                  width={1400}
                  height={800}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  priority
                />
              </div>
            </figure>
          )}

          {/* Ad Top */}
          <AdBanner placement="BLOG_POST_TOP" />

          {/* Body Content */}
          <div className="bg-transparent text-foreground/90 leading-relaxed font-normal break-words min-w-0 max-w-[760px] mx-auto lg:mx-0">
            {renderContentWithAds()}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-6 border-t border-glass-border">
            {(post.tags || []).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-white/5 border border-glass-border text-foreground/60 text-xs font-semibold uppercase tracking-wider"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Ad Bottom */}
          <AdBanner placement="BLOG_POST_BOTTOM" />

          {/* Like & Engagement Optimistic UI bar */}
          <div className="flex justify-center sticky bottom-6 z-40 mt-16 mb-8 w-full pointer-events-none">
            <div
              className="pointer-events-auto flex flex-wrap items-center gap-6 sm:gap-10 py-3 px-6 sm:py-4 sm:px-10 rounded-full glass-panel border border-glass-border shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_60px_-15px_rgba(var(--accent-rgb),0.3)] transition-all duration-300 notranslate bg-white/60 dark:bg-[#0a0a0a]/80 backdrop-blur-xl"
              translate="no"
            >
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  hasLiked
                    ? 'bg-accent text-white scale-110 shadow-lg shadow-accent/20'
                    : 'bg-foreground/5 text-foreground/60 hover:bg-foreground/10 hover:text-foreground'
                }`}
                aria-label="Like post"
              >
                <Heart className={`w-6 h-6 ${hasLiked ? 'fill-current' : ''}`} />
              </button>
              <div className="flex flex-col">
                <span className="font-extrabold text-base text-foreground tracking-tight">
                  {likes} Likes
                </span>
                <span className="text-[11px] font-medium text-foreground/50 uppercase tracking-widest mt-0.5">
                  {hasLiked ? 'Unlike' : 'Like'}
                </span>
              </div>
            </div>

            <div className="h-10 w-[1px] bg-glass-border hidden sm:block"></div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-foreground/5 text-foreground/60">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base text-foreground tracking-tight">
                  {comments.filter((c) => c.status === 'APPROVED').length} Comments
                </span>
                <span className="text-[11px] font-medium text-foreground/50 uppercase tracking-widest mt-0.5">
                  Join the Discussion
                </span>
              </div>
              </div>
            </div>
          </div>

          {/* Comments Panel */}
          <div className="space-y-6 pt-12 border-t border-glass-border notranslate" translate="no">
            <h2 className="text-2xl font-bold tracking-tight">Article Comments</h2>

            {/* Form */}
            {isLoggedIn ? (
              <GlassCard className="p-6 border border-glass-border relative z-10">
                <h3 className="font-bold text-sm mb-4">Leave a Comment</h3>

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
                      {...register('commentText', {
                        required: 'Comment is required',
                        minLength: { value: 10, message: 'Comment must be at least 10 characters' },
                        maxLength: { value: 500, message: 'Comment cannot exceed 500 characters' },
                      })}
                      className="w-full bg-foreground/[0.02] border border-glass-border rounded-xl px-4 py-3 outline-none text-xs resize-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                      placeholder="Share your thoughts on this topic..."
                    />
                    {errors.commentText && (
                      <p className="text-xs text-rose-500 font-medium pl-1">
                        {String(errors.commentText.message)}
                      </p>
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
                <Link
                  href={`/login?redirect=/insights-news/${post.slug}`}
                  className="inline-block text-accent font-semibold hover:underline"
                >
                  Sign In to Join the Discussion →
                </Link>
              </div>
            )}

            {/* List */}
            <div className="space-y-4">
              {comments.filter((c) => c.status === 'APPROVED').length === 0 ? (
                <p className="text-xs text-foreground/45 italic pl-1">
                  No comments approved yet. Be the first to share your thoughts!
                </p>
              ) : (
                comments
                  .filter((c) => c.status === 'APPROVED')
                  .map((comment) => (
                    <div
                      key={comment.id}
                      className="p-5 rounded-2xl bg-foreground/[0.01] border border-glass-border flex gap-4"
                    >
                      <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center font-bold text-accent text-xs shrink-0 uppercase overflow-hidden">
                        {comment.user?.profilePhotoUrl || comment.user?.profile?.profilePhotoUrl ? (
                          <Image
                            src={
                              comment.user.profilePhotoUrl ||
                              comment.user.profile?.profilePhotoUrl ||
                              ''
                            }
                            alt={comment.user?.fullName || 'User'}
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          comment.user?.fullName?.[0] || 'U'
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-xs text-foreground break-words">
                            {comment.user?.fullName || 'Anonymous'}
                          </span>
                          <span className="text-[9px] text-foreground/45">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs text-foreground/85 leading-relaxed break-words">
                          {comment.commentText}
                        </p>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar (Desktop layout) */}
        <div className="lg:col-span-4 space-y-8 notranslate lg:sticky lg:top-28 lg:self-start lg:pb-12" translate="no">
          {/* Author Card */}
          <GlassCard className="p-6 border border-glass-border">
            <h2 className="font-bold text-sm mb-4">About the Author</h2>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center font-bold text-accent uppercase overflow-hidden shrink-0">
                {post.author?.profilePhotoUrl || post.author?.profile?.profilePhotoUrl ? (
                  <Image
                    src={post.author.profilePhotoUrl || post.author.profile?.profilePhotoUrl || ''}
                    alt={post.author?.fullName || 'Author'}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  post.author?.fullName?.[0] || 'A'
                )}
              </div>
              <div>
                <p className="font-extrabold text-sm">
                  {post.author?.fullName?.includes('APX Blog Bot')
                    ? 'APX Teck'
                    : post.author?.fullName || 'APX Author'}
                </p>
                <p className="text-[10px] text-foreground/50">
                  {post.authorDesignation || 'Technology Consultant'}
                </p>
              </div>
            </div>
            <p className="text-[11px] text-foreground/60 leading-relaxed mt-4">
              {post.authorBio ||
                'Professional engineers crafting clean code architectures and visual portfolios for SMBs.'}
            </p>
          </GlassCard>

          {/* Related Articles */}
          {(relatedPosts || []).length > 0 && (
            <GlassCard className="p-6 border border-glass-border">
              <h2 className="font-bold text-sm mb-4">Related Insights</h2>
              <div className="space-y-4">
                {relatedPosts.map((r) => (
                  <Link key={r.id} href={`/insights-news/${r.slug}`} className="block group">
                    <div className="space-y-1">
                      <h5 className="font-bold text-xs text-foreground group-hover:text-accent transition-colors line-clamp-2 leading-snug">
                        {r.title}
                      </h5>
                      <span className="text-[9px] text-foreground/45">
                        {formatDate(r.publishedAt)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Bottom Sidebar Advertisement */}
          <div className="pt-4">
            <AdBanner placement="BLOG_POST_SIDEBAR" />
            <AvailableAdSlots />
          </div>
        </div>
      </div>
    </article>
    </>
  );
}
