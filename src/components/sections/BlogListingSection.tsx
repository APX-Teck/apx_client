'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { Search, ChevronLeft, ChevronRight, Eye, Clock, TrendingUp, Heart, MessageCircle, Share2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { BlogPost } from '@/app/types/blog.types';
import { AdBanner } from '@/components/ui/AdBanner';
import { api } from '@/lib/axios';

interface BlogListingSectionProps {
  initialBlogs: BlogPost[];
  initialCategories?: any[];
}

export function BlogListingSection({ initialBlogs = [], initialCategories = [] }: BlogListingSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const sectionRef = useRef<HTMLElement>(null);

  const [clientCategories, setClientCategories] = useState<any[]>(initialCategories || []);

  useEffect(() => {
    if (clientCategories.length === 0) {
      api.fetchCategories().then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setClientCategories(data);
        }
      });
    }
  }, []);

  // Combine static "All" with dynamic categories from backend
  const categoriesList = [{ id: 'all', name: 'All' }, ...(clientCategories || [])];

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (sectionRef.current) {
      const yOffset = -100;
      const y = sectionRef.current.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const filteredPosts = (initialBlogs || []).filter((post) => {
    const titleStr = post.title || '';
    const excerptStr = post.excerpt || '';
    const contentStr = post.content || '';

    const matchesSearch =
      titleStr.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      excerptStr.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      contentStr.toLowerCase().includes(debouncedSearch.toLowerCase());

    const tags = post.tags || [];
    const categoryName = post.category?.name || '';
    const matchesCategory =
      activeCategory === 'All' ||
      tags.some((t) => t.toLowerCase() === activeCategory.toLowerCase()) ||
      categoryName.toLowerCase() === activeCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, activeCategory]);

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


  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Google News Layout Splitting
  // If we are on page 1 of 'All' with no search, show Top Stories.
  const isDefaultView = activeCategory === 'All' && !debouncedSearch && currentPage === 1;
  
  // Top 4 posts for "Your Briefing / Top Stories"
  const topStories = isDefaultView ? currentPosts.slice(0, 4) : [];
  
  // Posts for the main list
  const currentListPosts = isDefaultView ? currentPosts.slice(4) : currentPosts;
  
  // Picks for you (trending posts for sidebar)
  const picksForYou = [...(initialBlogs || [])].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);

  const AuthorImage = ({ post }: { post: BlogPost }) => {
    if (!post) return null;
    const url = post.author?.profile?.profilePhotoUrl || post.author?.profilePhotoUrl;
    if (url) {
      return <Image src={url} alt={`${post.author?.fullName || 'Article Author'} profile avatar`} width={100} height={100} className="w-full h-full object-cover" />;
    }
    const name = typeof post.author?.fullName === 'string' ? post.author.fullName : 'APX';
    return (
      <Image
        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name.includes('APX') ? 'APX' : name)}&background=4f46e5&color=fff`}
        alt={`${name} generated avatar`}
        width={100}
        height={100}
        className="w-full h-full object-cover"
      />
    );
  };

  return (
    <section ref={sectionRef} className="w-full max-w-[1400px] mx-auto space-y-6 md:space-y-10">
      
      {/* Category Navbar (Sticky style like Google News) */}
      <div className="sticky top-16 md:top-20 z-40 bg-background/95 backdrop-blur-md border-b border-glass-border py-3 px-4 sm:px-6 notranslate" translate="no">
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar max-w-7xl mx-auto">
          {categoriesList.map((cat, idx) => {
            if (!cat) return null;
            const catId = typeof cat === 'string' ? cat : (cat.id || idx);
            const catName = typeof cat === 'string' ? cat : (cat.name || 'Unknown');
            return (
              <button
                key={catId}
                onClick={() => setActiveCategory(catName)}
                className={`shrink-0 text-sm font-semibold whitespace-nowrap transition-colors ${
                  activeCategory === catName
                    ? 'text-accent border-b-2 border-accent pb-1'
                    : 'text-foreground/70 hover:text-foreground pb-1 border-b-2 border-transparent'
                }`}
              >
                {catName}
              </button>
            );
          })}
          
          <div className="ml-auto relative shrink-0 w-48 sm:w-64 hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/45" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-foreground/[0.03] border border-glass-border rounded-full pl-9 pr-4 py-1.5 outline-none text-xs focus:ring-1 focus:ring-accent transition-all"
              placeholder="Search topics..."
            />
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 max-w-7xl mx-auto space-y-10 notranslate" translate="no">
        
        {/* Mobile Search */}
        <div className="relative sm:hidden w-full mt-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/45" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-foreground/[0.03] border border-glass-border rounded-full pl-10 pr-4 py-2.5 outline-none text-sm focus:ring-1 focus:ring-accent transition-all"
            placeholder="Search topics, news..."
          />
        </div>

        {/* Top Stories / Your Briefing (Only on default view) */}
        {isDefaultView && topStories.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Your Briefing</h2>
            
            <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
              {/* Main Feature (Left) */}
              {topStories[0] && (
                <div className="lg:col-span-7 xl:col-span-8 h-full">
                  <Link href={`/insights-news/${topStories[0].slug}`} className="block group h-full">
                    <GlassCard className="!p-0 overflow-hidden h-full flex flex-col border border-glass-border hover:border-white/20 transition-all duration-300">
                      <div className="relative w-full sm:h-[400px] overflow-hidden bg-accent/5 flex items-center justify-center rounded-t-2xl sm:rounded-none">
                        {topStories[0].coverImageUrl && (
                          <Image
                            src={topStories[0].coverImageUrl || '/APXTECK.png'}
                            alt={`${topStories[0].title} news article thumbnail`}
                            width={800}
                            height={600}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        )}
                      </div>
                      <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                        <span className="text-accent text-xs font-bold uppercase tracking-wider mb-2 block">
                          {(topStories[0].tags || [])[0] || 'Top Story'}
                        </span>
                        <h3 className="text-2xl md:text-3xl font-extrabold leading-tight mb-3 group-hover:text-accent transition-colors line-clamp-3">
                          {topStories[0].title}
                        </h3>
                        <p className="text-foreground/70 text-sm leading-relaxed line-clamp-2 md:line-clamp-3 mb-6">
                          {topStories[0].excerpt}
                        </p>
                        <div className="flex items-center gap-4 mt-auto">
                           <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-glass-border">
                             <AuthorImage post={topStories[0]} />
                           </div>
                           <div className="flex flex-col flex-1">
                             <span className="text-xs font-bold text-foreground">
                               {topStories[0].author?.fullName || 'APX Team'}
                             </span>
                             <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] text-foreground/50 mt-1">
                               <span className="whitespace-nowrap">{formatDate(topStories[0].publishedAt)}</span>
                               <span className="hidden sm:inline">•</span>
                               <div className="flex items-center gap-3 shrink-0">
                                 <span className="flex items-center gap-1"><Eye className="w-3 h-3"/> {topStories[0].views || 0}</span>
                                 <span className="flex items-center gap-1"><Heart className="w-3 h-3"/> {topStories[0]._count?.likes || 0}</span>
                                 <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3"/> {topStories[0]._count?.comments || 0}</span>
                               </div>
                             </div>
                           </div>
                        </div>
                      </div>
                    </GlassCard>
                  </Link>
                </div>
              )}

              {/* Side Stories (Right) */}
              <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
                {topStories.slice(1, 4).map((post, idx) => {
                  if (!post) return null;
                  return (
                  <Link key={post.id || idx} href={`/insights-news/${post.slug || '#'}`} className="block group flex-1">
                    <div className="flex flex-col-reverse sm:flex-row gap-4 sm:items-center h-full border-b border-glass-border pb-6 last:border-0 last:pb-0">
                      <div className="flex-1 space-y-2">
                        <span className="text-accent text-[10px] font-bold uppercase tracking-wider block">
                          {(post.tags || [])[0] || 'News'}
                        </span>
                        <h4 className="text-base font-bold leading-snug group-hover:text-accent transition-colors line-clamp-3">
                          {post.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-auto pt-4 text-[10px] text-foreground/50 border-t border-glass-border">
                          <span className="whitespace-nowrap">{formatDate(post.publishedAt)}</span>
                          <span className="hidden sm:inline">•</span>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="flex items-center gap-1"><Eye className="w-3 h-3"/> {post.views || 0}</span>
                            <span className="flex items-center gap-1"><Heart className="w-3 h-3"/> {post._count?.likes || 0}</span>
                            <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3"/> {post._count?.comments || 0}</span>
                          </div>
                        </div>
                      </div>
                      {post.coverImageUrl && (
                        <div className="w-full sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-accent/5 border border-glass-border flex items-center justify-center">
                          <Image
                            src={post.coverImageUrl || '/APXTECK.png'}
                            alt={`${post.title} article thumbnail`}
                            width={600}
                            height={400}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                      )}
                    </div>
                  </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Main Feed & Sidebar */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 pt-8 border-t border-glass-border">
          
          {/* Main List */}
          <div className="lg:col-span-8 space-y-8">
            <div role="heading" aria-level={2} className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              {isDefaultView ? 'More News' : `Results for "${activeCategory}"`}
            </div>

            {currentListPosts.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-glass-border rounded-2xl">
                <p className="text-foreground/50 text-sm font-semibold">No posts found.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {currentListPosts.map((post, idx) => {
                  const showMidAd = idx === 3; // Show Ad after 3rd post in the list

                  return (
                    <div key={post.id || idx} className="contents">
                      <Link href={`/insights-news/${post.slug || '#'}`} className="block group">
                        <div className="flex flex-col sm:flex-row gap-5 p-4 sm:p-5 rounded-2xl border border-transparent hover:border-glass-border hover:bg-foreground/[0.02] transition-all duration-300">
                          {post.coverImageUrl && (
                            <div className="w-full sm:w-48 rounded-xl overflow-hidden shrink-0 bg-accent/5 border border-glass-border flex items-center justify-center">
                              <Image
                                src={post.coverImageUrl || '/APXTECK.png'}
                                alt={`${post.title} article preview`}
                                width={600}
                                height={400}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              />
                            </div>
                          )}
                          <div className="flex flex-col justify-between flex-1 py-1 space-y-3 sm:space-y-0">
                            <div>
                              <span className="text-foreground/50 text-[10px] font-bold uppercase tracking-wider mb-1 block">
                                {(post.tags || [])[0] || 'Article'}
                              </span>
                              <h3 className="text-lg font-bold leading-snug group-hover:text-accent transition-colors line-clamp-2">
                                {post.title}
                              </h3>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-auto pt-4 sm:pt-2 border-t sm:border-0 border-glass-border">
                               <div className="flex items-center gap-2 shrink-0">
                                 <div className="w-6 h-6 rounded-full overflow-hidden shrink-0">
                                   <AuthorImage post={post} />
                                 </div>
                                 <span className="text-[11px] font-semibold text-foreground/70">
                                   {post.author?.fullName || 'APX Team'}
                                 </span>
                               </div>
                               <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] text-foreground/45">
                                 <span className="whitespace-nowrap">{formatDate(post.publishedAt)}</span>
                                 <span className="hidden sm:inline">•</span>
                                 <div className="flex items-center gap-3 shrink-0">
                                   <span className="flex items-center gap-1"><Eye className="w-3 h-3"/> {post.views || 0}</span>
                                   <span className="flex items-center gap-1"><Heart className="w-3 h-3"/> {post._count?.likes || 0}</span>
                                   <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3"/> {post._count?.comments || 0}</span>
                                 </div>
                               </div>
                            </div>
                          </div>
                        </div>
                      </Link>

                      {showMidAd && (
                        <div className="py-4 border-y border-glass-border my-6">
                          <AdBanner placement="BLOG_LIST_MID" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pt-10 border-t border-glass-border mt-10">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1.5 px-4 h-10 rounded-full border border-glass-border text-sm font-semibold text-foreground hover:bg-foreground/5 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>

                <div className="hidden sm:flex items-center gap-1">
                  {(() => {
                    const pageNumbers = [];
                    const maxVisiblePages = 5;
                    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

                    if (endPage - startPage + 1 < maxVisiblePages) {
                      startPage = Math.max(1, endPage - maxVisiblePages + 1);
                    }

                    for (let i = startPage; i <= endPage; i++) {
                      pageNumbers.push(i);
                    }

                    return (
                      <>
                        {startPage > 1 && (
                          <>
                            <button
                              onClick={() => handlePageChange(1)}
                              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold hover:bg-foreground/5 transition-all text-foreground/70"
                            >
                              1
                            </button>
                            {startPage > 2 && <span className="text-foreground/40 px-1">...</span>}
                          </>
                        )}

                        {pageNumbers.map(number => (
                          <button
                            key={number}
                            onClick={() => handlePageChange(number)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                              currentPage === number
                                ? 'bg-accent text-white shadow-md shadow-accent/20'
                                : 'hover:bg-foreground/5 text-foreground/80'
                            }`}
                          >
                            {number}
                          </button>
                        ))}

                        {endPage < totalPages && (
                          <>
                            {endPage < totalPages - 1 && <span className="text-foreground/40 px-1">...</span>}
                            <button
                              onClick={() => handlePageChange(totalPages)}
                              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold hover:bg-foreground/5 transition-all text-foreground/70"
                            >
                              {totalPages}
                            </button>
                          </>
                        )}
                      </>
                    );
                  })()}
                </div>

                {/* Mobile text indicator since numbers are hidden on mobile */}
                <span className="sm:hidden text-xs font-semibold text-foreground/70 mx-2">
                  {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1.5 px-4 h-10 rounded-full border border-glass-border text-sm font-semibold text-foreground hover:bg-foreground/5 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Sidebar (Picks for you) */}
          <div className="lg:col-span-4 space-y-8">
            <div className="sticky top-40 space-y-8">
              <div className="bg-foreground/[0.02] border border-glass-border rounded-3xl p-6">
                <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                  Picks for you
                </h3>
                <div className="space-y-5">
                  {picksForYou.map((post, idx) => {
                    if (!post) return null;
                    return (
                    <Link key={post.id || idx} href={`/insights-news/${post.slug || '#'}`} className="block group">
                      <div className="flex gap-3 items-center">
                        <div className="text-xl font-extrabold text-foreground/10 group-hover:text-accent/20 transition-colors w-6">
                          0{picksForYou.indexOf(post) + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-bold leading-tight group-hover:text-accent transition-colors line-clamp-2">
                            {post.title}
                          </h4>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-1 text-[10px] text-foreground/50 mt-1">
                            <span className="whitespace-nowrap">{formatDate(post.publishedAt)}</span>
                            <span className="hidden sm:inline">•</span>
                            <div className="flex items-center gap-3 shrink-0">
                              <span className="flex items-center gap-1"><Eye className="w-3 h-3"/> {post.views || 0}</span>
                              <span className="flex items-center gap-1"><Heart className="w-3 h-3"/> {post._count?.likes || 0}</span>
                              <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3"/> {post._count?.comments || 0}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                    );
                  })}
                </div>
              </div>

              {/* Sidebar Ad */}
              <div className="rounded-3xl overflow-hidden border border-glass-border">
                 <AdBanner placement="BLOG_POST_SIDEBAR" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
