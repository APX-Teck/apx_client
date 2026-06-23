'use client';

import { useState, useEffect } from 'react';
import { useForm, FieldValues } from 'react-hook-form';
import { motion } from 'framer-motion';
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
  console.log('Author:', post.author?.fullName);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
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

  // Inject Ad banner dynamically after paragraph 3
  const renderContentWithAds = () => {
    // Add responsive wrapper to tables
    const contentWithResponsiveTables = (post.content || '')
      .replace(/<table/gi, '<div class="table-responsive-wrapper"><table')
      .replace(/<\/table>/gi, '</table></div>');

    const paragraphs = contentWithResponsiveTables.split('</p>');
    const proseClasses = "prose dark:prose-invert max-w-none text-foreground/90 text-[15px] sm:text-base leading-[1.8] sm:leading-loose prose-p:mb-6 prose-headings:mt-8 prose-headings:mb-4 prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl sm:prose-img:rounded-3xl prose-img:shadow-md [&_blockquote]:border-l-4 [&_blockquote]:border-accent [&_blockquote]:pl-6 [&_blockquote]:italic [&_blockquote]:bg-accent/5 [&_blockquote]:py-5 [&_blockquote]:pr-6 [&_blockquote]:rounded-r-2xl [&_blockquote]:my-8 [&_blockquote]:text-foreground/90 [&_blockquote]:font-medium [&_blockquote_p::before]:content-none [&_blockquote_p::after]:content-none [&_blockquote_p]:m-0 [&_blockquote]:shadow-sm " +
      "[&_.table-responsive-wrapper]:!w-full [&_.table-responsive-wrapper]:!overflow-x-auto [&_.table-responsive-wrapper]:!my-8 [&_.table-responsive-wrapper]:!rounded-xl [&_.table-responsive-wrapper]:!border [&_.table-responsive-wrapper]:!border-glass-border [&_.table-responsive-wrapper]:!shadow-sm [&_.table-responsive-wrapper]:!bg-foreground/[0.01] [&_.table-responsive-wrapper]:scroll-smooth " +
      "[&_table]:!w-full [&_table]:!min-w-[600px] [&_table]:!border-collapse [&_table]:!text-left [&_table]:!text-sm [&_table]:!m-0 " +
      "[&_thead]:!bg-foreground/[0.03] [&_th]:!p-4 [&_th]:!font-semibold [&_th]:!text-foreground [&_th]:!border-b [&_th]:!border-glass-border [&_th]:!whitespace-nowrap " +
      "[&_td]:!p-4 [&_td]:!text-foreground/80 [&_td]:!border-b [&_td]:!border-glass-border/40 [&_tr:last-child_td]:!border-b-0 " +
      "[&_tr:hover_td]:!bg-foreground/[0.02] [&_tr]:!transition-colors";

    if (paragraphs.length <= 3) {
      return (
          <div
            className={proseClasses}
            dangerouslySetInnerHTML={{ __html: contentWithResponsiveTables }}
          />
      );
    }

    const part1 = paragraphs.slice(0, 3).join('</p>') + '</p>';
    const part2 = paragraphs.slice(3).join('</p>');

    return (
      <div className="space-y-6 sm:space-y-8">
        <div
          className={proseClasses}
          dangerouslySetInnerHTML={{ __html: part1 }}
        />

        {/* Ad mid-placement */}
        <AdBanner placement="BLOG_POST_MID" className="my-8 sm:my-12" />

        <div
          className={proseClasses}
          dangerouslySetInnerHTML={{ __html: part2 }}
        />
      </div>
    );
  };

  return (
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
        <div className="lg:col-span-8 space-y-8">
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
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pt-5 sm:pt-6 border-y border-glass-border py-5 sm:py-6 text-sm text-foreground/70 notranslate"
              translate="no"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center font-bold text-accent uppercase overflow-hidden shrink-0">
                  {post.author?.profilePhotoUrl || post.author?.profile?.profilePhotoUrl ? (
                    <img
                      src={
                        post.author.profilePhotoUrl || post.author.profile?.profilePhotoUrl || ''
                      }
                      alt={post.author.fullName || 'Author'}
                      className="w-full h-full object-cover"
                    />
                  ) : post.author?.fullName ? (
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.fullName.includes('APX Blog Bot') ? 'APX Teck' : post.author.fullName)}&background=4f46e5&color=fff`}
                      alt={post.author.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    'A'
                  )}
                </div>
                <div>
                  <p className="font-bold text-[15px] sm:text-base text-foreground">
                    {post.author?.fullName?.includes('APX Blog Bot')
                      ? 'APX Teck'
                      : post.author?.fullName || 'APX Architect'}
                  </p>
                  <time dateTime={post.publishedAt || undefined} className="block text-xs text-foreground/50 mt-0.5">
                    {formatDate(post.publishedAt)}
                  </time>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 sm:gap-5 text-xs sm:text-sm">
                <span className="flex items-center gap-1.5 shrink-0">
                  <Eye className="w-4 h-4" /> {post.views || 0} Views
                </span>
                <span className="w-1 h-1 rounded-full bg-glass-border"></span>
                <span className="flex items-center gap-1.5 shrink-0">
                  <Clock className="w-4 h-4" /> 5 min read
                </span>

                {/* Share buttons */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleShare('facebook')}
                    className="w-8 h-8 rounded-full glass-panel flex items-center justify-center hover:text-[#1877F2] hover:scale-110 hover:bg-[#1877F2]/10 transition-all shadow-sm"
                    aria-label="Share on Facebook"
                  >
                    <FaFacebookF className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="w-8 h-8 rounded-full glass-panel flex items-center justify-center hover:text-white hover:scale-110 hover:bg-white/10 transition-all shadow-sm"
                    aria-label="Share on X (Twitter)"
                  >
                    <FaXTwitter className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="w-8 h-8 rounded-full glass-panel flex items-center justify-center hover:text-[#0A66C2] hover:scale-110 hover:bg-[#0A66C2]/10 transition-all shadow-sm"
                    aria-label="Share on LinkedIn"
                  >
                    <FaLinkedinIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleShare('whatsapp')}
                    className="w-8 h-8 rounded-full glass-panel flex items-center justify-center hover:text-[#25D366] hover:scale-110 hover:bg-[#25D366]/10 transition-all shadow-sm"
                    aria-label="Share on WhatsApp"
                  >
                    <FaWhatsapp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleShare('instagram')}
                    className="w-8 h-8 rounded-full glass-panel flex items-center justify-center hover:text-[#E4405F] hover:scale-110 hover:bg-[#E4405F]/10 transition-all shadow-sm"
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
            <div className="w-full h-[250px] sm:h-[400px] md:h-[450px] rounded-2xl sm:rounded-3xl overflow-hidden border border-glass-border shadow-md">
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
          <div
            className="flex flex-wrap items-center gap-4 sm:gap-6 py-4 px-5 sm:py-5 sm:px-8 rounded-2xl sm:rounded-3xl glass-panel border border-glass-border shadow-sm hover:shadow-md transition-shadow notranslate"
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
                          <img
                            src={
                              comment.user.profilePhotoUrl ||
                              comment.user.profile?.profilePhotoUrl ||
                              ''
                            }
                            alt={comment.user.fullName || 'User'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          comment.user.fullName[0]
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-xs text-foreground break-words">
                            {comment.user.fullName}
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
        <div className="lg:col-span-4 space-y-8 notranslate" translate="no">
          {/* Author Card */}
          <GlassCard className="p-6 border border-glass-border">
            <h2 className="font-bold text-sm mb-4">About the Author</h2>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center font-bold text-accent uppercase overflow-hidden shrink-0">
                {post.author?.profilePhotoUrl || post.author?.profile?.profilePhotoUrl ? (
                  <img
                    src={post.author.profilePhotoUrl || post.author.profile?.profilePhotoUrl || ''}
                    alt={post.author.fullName || 'Author'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  post.author?.fullName[0] || 'A'
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

          {/* Sticky Sidebar Advertisement */}
          <div className="sticky top-28 space-y-6 pt-4">
            <AdBanner placement="BLOG_POST_SIDEBAR" />
            <AvailableAdSlots />
          </div>
        </div>
      </div>
    </article>
  );
}
