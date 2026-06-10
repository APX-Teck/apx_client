"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, Briefcase, Edit, Trash2, CheckCircle2, XCircle, Search, AlertCircle, Eye } from "lucide-react";
import { portfolioService, Portfolio } from "@/services/admin/portfolio.service";

function Toast({ message, type, onClose }: { message: string; type: "success" | "error" | "loading"; onClose: () => void }) {
  useEffect(() => {
    if (type === "loading") return;
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose, type]);

  const bg = type === "success" ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20" : type === "error" ? "bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:border-red-500/20" : "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/20";
  return (
    <div className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-xl border shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5 ${bg}`}>
      {type === "success" && <CheckCircle2 size={18} />}
      {type === "error" && <AlertCircle size={18} />}
      {type === "loading" && <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>}
      <p className="text-sm font-bold">{message}</p>
      {type !== "loading" && (
        <button onClick={onClose} className="ml-2 hover:opacity-70"><XCircle size={16} /></button>
      )}
    </div>
  );
}

export default function PortfolioManagementPage() {
  const router = useRouter();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "loading" } | null>(null);

  const fetchPortfolios = async () => {
    try {
      setIsLoading(true);
      const data = await portfolioService.getAllPortfoliosAdmin({ limit: 100 });
      setPortfolios(data?.data || []);
    } catch (error) {
      setToast({ message: "Failed to fetch portfolios. Have you run 'npx prisma db push'?", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this portfolio item? This action cannot be undone.")) {
      try {
        setToast({ message: "Deleting portfolio...", type: "loading" });
        await portfolioService.deletePortfolio(id);
        setToast({ message: "Portfolio deleted successfully", type: "success" });
        fetchPortfolios();
      } catch (error) {
        setToast({ message: "Failed to delete portfolio", type: "error" });
      }
    }
  };

  const handleTogglePublish = async (id: number, currentStatus: boolean) => {
    try {
      setToast({ message: "Updating status...", type: "loading" });
      await portfolioService.togglePublish(id);
      setToast({ message: `Portfolio is now ${!currentStatus ? 'Published' : 'Draft'}`, type: "success" });
      fetchPortfolios();
    } catch (error) {
      setToast({ message: "Failed to update publish status", type: "error" });
    }
  };

  const filteredPortfolios = portfolios.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.serviceType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400">
              <Briefcase size={24} />
            </div>
            Portfolio Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-2">
            Showcase your best projects, manage client cases, and update portfolio visibility.
          </p>
        </div>
        <button 
          onClick={() => router.push('/admin/portfolio/create')}
          className="bg-[#39FF14] hover:bg-[#32e012] text-black px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm flex items-center gap-2 shrink-0"
        >
          <PlusCircle size={18} />
          Create Portfolio
        </button>
      </div>

      <div className="bg-white dark:bg-[#111111] rounded-3xl border border-gray-100 dark:border-white/5 shadow-[0px_4px_20px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50 dark:bg-[#1a1a1a]/50">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search portfolios by title, client, or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all"
            />
          </div>
        </div>

        <div className="p-6 overflow-auto bg-gray-50 dark:bg-[#151515] min-h-[400px]">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-indigo-100 dark:border-indigo-500/20 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Loading portfolios...</p>
              </div>
            </div>
          ) : filteredPortfolios.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-white dark:bg-[#222] rounded-full flex items-center justify-center mb-4 border border-gray-100 dark:border-white/5">
                <Briefcase className="text-gray-400 dark:text-gray-500" size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No portfolios found</h3>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 max-w-md">
                We couldn't find any portfolios matching "{searchTerm}".
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPortfolios.map((portfolio) => (
                <div key={portfolio.id} className="bg-white dark:bg-[#111111] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all flex flex-col group overflow-hidden relative">
                  
                  <div className="h-48 w-full bg-gray-100 dark:bg-gray-800 relative">
                    {portfolio.coverImageUrl ? (
                      <img src={portfolio.coverImageUrl} alt={portfolio.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Briefcase size={32} />
                      </div>
                    )}
                    
                    <button 
                      onClick={() => handleTogglePublish(portfolio.id, portfolio.isPublished)}
                      className="absolute top-4 right-4 z-10 p-1 rounded-full border border-gray-200 dark:border-white/10 shadow-sm bg-white dark:bg-[#151515] flex items-center justify-center"
                      title={`Toggle Status (Currently ${portfolio.isPublished ? 'Published' : 'Draft'})`}
                    >
                      <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${portfolio.isPublished ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700'}`}>
                        <div className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform ${portfolio.isPublished ? 'translate-x-4' : 'translate-x-0'}`}></div>
                      </div>
                    </button>
                    <div className="absolute bottom-4 left-4 right-4 z-10">
                       <span className="bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border border-white/10">
                         {portfolio.serviceType}
                       </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg tracking-tight mb-1 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {portfolio.title}
                    </h3>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
                       Client: <span className="text-gray-900 dark:text-gray-200">{portfolio.clientName}</span>
                    </p>

                    <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-end gap-2">
                      <button 
                        onClick={() => router.push(`/portfolio/${portfolio.slug}`)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-blue-500/10 rounded-xl transition-colors border border-transparent hover:border-blue-200 dark:hover:border-blue-500/20"
                        title="View Public Page"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => router.push(`/admin/portfolio/${portfolio.id}/edit`)}
                        className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:text-indigo-400 dark:hover:bg-indigo-500/10 rounded-xl transition-colors border border-transparent hover:border-indigo-200 dark:hover:border-indigo-500/20"
                        title="Edit Portfolio"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(portfolio.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-500/10 rounded-xl transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-500/20"
                        title="Delete Portfolio"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
