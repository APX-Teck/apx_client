"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Search, Calendar, Clock, Heart, ChevronLeft, ChevronRight, User } from "lucide-react";
import Link from "next/link";
import { BlogPost } from "@/app/types/blog.types";
import { AdBanner } from "@/components/ui/AdBanner";

interface BlogListingSectionProps {
  initialBlogs: BlogPost[];
}

const categories = ["All", "Technology", "Tutorial", "Marketing", "Design", "SMB"];

export function BlogListingSection({ initialBlogs }: BlogListingSectionProps) {
  const [blogs, setBlogs] = useState<BlogPost[]>(initialBlogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6; // Set to 6 to easily demonstrate pagination and Ad placement

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Filter posts
  const filteredPosts = initialBlogs.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      post.content.toLowerCase().includes(debouncedSearch.toLowerCase());

    const matchesCategory =
      activeCategory === "All" ||
      post.tags.some((t) => t.toLowerCase() === activeCategory.toLowerCase());

    const matchesTag =
      !activeTag ||
      post.tags.some((t) => t.toLowerCase() === activeTag.toLowerCase());

    return matchesSearch && matchesCategory && matchesTag;
  });

  // Reset page index on filter change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [debouncedSearch, activeCategory, activeTag]);

  // Pagination bounds
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

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

  // Pull all unique tags for chips list
  const allTags = Array.from(
    new Set(initialBlogs.flatMap((p) => p.tags))
  );

  return (
    <section className="py-12 max-w-7xl mx-auto px-6 space-y-12">
      
      {/* Search and Filters panel */}
      <div className="space-y-6">
        
        {/* Search Input */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/45" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-foreground/[0.02] border border-glass-border rounded-xl pl-11 pr-4 py-3 outline-none text-sm focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
            placeholder="Search articles..."
          />
        </div>

        {/* Categories Tab Row */}
        <div className="flex justify-center overflow-x-auto gap-2 pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setActiveTag(null); // Clear tag filter when switching category
              }}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider shrink-0 transition-all ${
                activeCategory === cat
                  ? "bg-accent text-white"
                  : "glass-panel border-glass-border hover:bg-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tags row */}
        {allTags.length > 0 && (
          <div className="flex justify-center flex-wrap gap-2 pt-2 border-t border-glass-border max-w-3xl mx-auto">
            {allTags.map((tag) => {
              const isSelected = activeTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setActiveTag(isSelected ? null : tag)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors border ${
                    isSelected
                      ? "bg-accent/15 border-accent text-accent"
                      : "bg-transparent border-glass-border text-foreground/50 hover:border-foreground/30 hover:text-foreground"
                  }`}
                >
                  #{tag}
                </button>
              );
            })}
          </div>
        )}

      </div>

      {/* Grid of Results */}
      {currentPosts.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-glass-border rounded-3xl">
          <p className="text-foreground/50 text-base font-semibold mb-2">No posts found.</p>
          <p className="text-foreground/40 text-xs">Try selecting a different filter key or keywords search.</p>
        </div>
      ) : (
        <div className="space-y-12">
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentPosts.map((post, idx) => {
              // We inject the Mid Ad slot after the 6th card index (index 5) or midway through the list.
              // In this layout, if we show 6 cards per page, we can place the ad after index 3 (first row) dynamically!
              const showMidAd = idx === 3;
              
              return (
                <div key={post.id} className="contents">
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <Link href={`/explore-news/${post.slug}`} className="block group h-full">
                      <GlassCard className="!p-0 overflow-hidden h-full flex flex-col hover:border-white/20 hover:shadow-2xl transition-all duration-300">
                        
                        <div className="relative h-48 w-full overflow-hidden bg-accent/5">
                          {post.coverImageUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={post.coverImageUrl}
                              alt={post.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                            />
                          )}
                          <div className="absolute top-4 left-4 glass-panel border border-white/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
                            {post.tags[0] || "Blog"}
                          </div>
                        </div>

                        <div className="p-5 flex flex-col justify-between flex-1 gap-6">
                          <div className="space-y-2">
                            <h3 className="text-xl font-bold tracking-tight line-clamp-2 group-hover:text-accent transition-colors">
                              {post.title}
                            </h3>
                            {post.excerpt && (
                              <p className="text-foreground/70 text-xs leading-relaxed line-clamp-3">
                                {post.excerpt}
                              </p>
                            )}
                          </div>

                          <div className="pt-4 border-t border-glass-border flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center font-bold text-xs text-accent uppercase">
                                {post.author?.fullName[0] || "A"}
                              </div>
                              <span className="text-[10px] font-semibold text-foreground/60">{post.author?.fullName || "APX Lead"}</span>
                            </div>
                            <span className="text-[10px] text-foreground/45 font-medium">{formatDate(post.publishedAt)}</span>
                          </div>
                        </div>

                      </GlassCard>
                    </Link>
                  </motion.div>

                    {/* Inject Mid Ad slot dynamically */}
                    {showMidAd && (
                      <div className="col-span-full py-4">
                        <AdBanner placement="BLOG_LIST_MID" />
                      </div>
                    )}
                  </div>
                );
              })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 pt-8 border-t border-glass-border">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-xl glass-panel border border-glass-border flex items-center justify-center text-foreground hover:bg-white/5 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs font-semibold text-foreground/70">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-xl glass-panel border border-glass-border flex items-center justify-center text-foreground hover:bg-white/5 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                aria-label="Next Page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

        </div>
      )}

    </section>
  );
}
