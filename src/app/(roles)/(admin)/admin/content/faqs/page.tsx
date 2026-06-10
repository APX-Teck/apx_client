"use client";

import React, { useEffect, useState } from "react";
import { 
  HelpCircle, PlusCircle, Edit, Trash2, CheckCircle2, 
  XCircle, Search, AlertCircle, MessageCircle
} from "lucide-react";
import { faqsService } from "@/services/admin/faqs.service";
import { Faq } from "@/app/types/faq.types";

function Toast({ message, type, onClose }: { message: string; type: "success" | "error" | "loading"; onClose: () => void }) {
  useEffect(() => {
    if (type === "loading") return;
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose, type]);

  const bg = type === "success" 
    ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20" 
    : type === "error" 
    ? "bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:border-red-500/20" 
    : "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/20";
  return (
    <div className={`fixed bottom-4 right-4 z-[9999] px-4 py-3 rounded-xl border shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5 ${bg}`}>
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

export default function FAQsManagementPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "loading" } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);

  // Form State
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("General");
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [isPublished, setIsPublished] = useState(true);

  const fetchFaqs = async () => {
    try {
      setIsLoading(true);
      const data = await faqsService.getFaqs();
      setFaqs(data.data || []);
    } catch (error) {
      setToast({ message: "Failed to fetch FAQs", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this FAQ?")) {
      try {
        setToast({ message: "Deleting FAQ...", type: "loading" });
        await faqsService.deleteFaq(id);
        setToast({ message: "FAQ deleted successfully", type: "success" });
        fetchFaqs();
      } catch (error) {
        setToast({ message: "Failed to delete FAQ", type: "error" });
      }
    }
  };

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    try {
      setToast({ message: "Updating status...", type: "loading" });
      await faqsService.toggleFaqActive(id, currentStatus);
      setToast({ message: `FAQ is now ${!currentStatus ? 'Published' : 'Hidden'}`, type: "success" });
      fetchFaqs();
    } catch (error) {
      setToast({ message: "Failed to update FAQ status", type: "error" });
    }
  };

  const openCreateModal = () => {
    setEditingFaq(null);
    setQuestion("");
    setAnswer("");
    setCategory("General");
    setSortOrder(faqs.length > 0 ? Math.max(...faqs.map(f => f.sortOrder)) + 1 : 0);
    setIsPublished(true);
    setIsModalOpen(true);
  };

  const openEditModal = (faq: Faq) => {
    setEditingFaq(faq);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setCategory(faq.category || "General");
    setSortOrder(faq.sortOrder);
    setIsPublished(faq.isPublished);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setToast({ message: editingFaq ? "Updating FAQ..." : "Creating FAQ...", type: "loading" });
      
      const payload = {
        question,
        answer,
        category,
        sortOrder,
        isPublished
      };

      if (editingFaq) {
        await faqsService.updateFaq(editingFaq.id, payload);
        setToast({ message: "FAQ updated successfully", type: "success" });
      } else {
        await faqsService.createFaq(payload);
        setToast({ message: "FAQ created successfully", type: "success" });
      }
      setIsModalOpen(false);
      fetchFaqs();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Failed to save FAQ";
      setToast({ message: errorMsg, type: "error" });
    }
  };

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (faq.category && faq.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400">
              <HelpCircle size={24} />
            </div>
            FAQs Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-2">
            Create, edit, and organize Frequently Asked Questions.
          </p>
        </div>
        <button 
          onClick={openCreateModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-md flex items-center gap-2 shrink-0"
        >
          <PlusCircle size={18} />
          Create FAQ
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
              placeholder="Search FAQs by question, answer, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* FAQs List */}
        <div className="p-6 overflow-auto bg-gray-50 dark:bg-[#151515] min-h-[400px]">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-indigo-100 dark:border-indigo-500/20 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Loading FAQs...</p>
              </div>
            </div>
          ) : filteredFaqs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-white dark:bg-[#222] rounded-full flex items-center justify-center mb-4 border border-gray-100 dark:border-white/5">
                <MessageCircle className="text-gray-400 dark:text-gray-500" size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No FAQs found</h3>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 max-w-md">
                We couldn't find any FAQs matching your criteria. Create a new one to get started.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredFaqs.map((faq) => (
                <div key={faq.id} className="bg-white dark:bg-[#111111] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all flex flex-col group relative overflow-hidden">
                  
                  {/* Status Toggle on Top Right */}
                  <button 
                    onClick={() => handleToggleActive(faq.id, faq.isPublished)}
                    className="absolute top-4 right-4 z-10 p-1 rounded-full border border-gray-200 dark:border-white/10 shadow-sm bg-white dark:bg-[#151515] flex items-center justify-center"
                    title={`Toggle Status (Currently ${faq.isPublished ? 'Published' : 'Hidden'})`}
                  >
                    <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${faq.isPublished ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700'}`}>
                      <div className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform ${faq.isPublished ? 'translate-x-4' : 'translate-x-0'}`}></div>
                    </div>
                  </button>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3">
                      <span className="bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded-lg">
                        {faq.category || 'General'}
                      </span>
                      <span className="bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-lg text-gray-500 dark:text-gray-400">
                        Order: {faq.sortOrder}
                      </span>
                    </div>

                    <h3 className="font-bold text-gray-900 dark:text-white text-lg tracking-tight mb-2 pr-12">
                      {faq.question}
                    </h3>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-6 leading-relaxed">
                      {faq.answer}
                    </p>

                    <div className="mt-auto flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-white/5">
                      <button 
                        onClick={() => openEditModal(faq)}
                        className="flex-1 bg-gray-50 hover:bg-indigo-50 dark:bg-white/5 dark:hover:bg-indigo-500/10 text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors border border-gray-200 dark:border-white/10 flex items-center justify-center gap-2"
                      >
                        <Edit size={16} />
                        Edit FAQ
                      </button>
                      <button 
                        onClick={() => handleDelete(faq.id)}
                        className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-500/10 rounded-xl transition-colors border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5"
                        title="Delete FAQ"
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
      
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-[#151515]/50">
              <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                {editingFaq ? <Edit className="text-indigo-500" size={20} /> : <PlusCircle className="text-indigo-500" size={20} />}
                {editingFaq ? 'Edit FAQ' : 'Create FAQ'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors bg-white dark:bg-[#222] p-1.5 rounded-full border border-gray-200 dark:border-white/10">
                <XCircle size={20} />
              </button>
            </div>

            <form id="faq-form" onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Question *</label>
                <input 
                  type="text" 
                  required
                  value={question} 
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g. What services do you offer?"
                  className="w-full bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-gray-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Answer *</label>
                <textarea 
                  required
                  value={answer} 
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Provide a detailed answer..."
                  className="w-full bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-gray-900 dark:text-white min-h-[120px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</label>
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-gray-900 dark:text-white"
                  >
                    <option value="General">General</option>
                    <option value="Pricing">Pricing</option>
                    <option value="Services">Services</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sort Order</label>
                  <input 
                    type="number" 
                    value={sortOrder} 
                    onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                    min={0}
                    className="w-full bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-gray-100 dark:border-white/5 mt-4">
                <div className="relative flex items-center">
                  <input 
                    type="checkbox" 
                    id="isPublished" 
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="peer sr-only"
                  />
                  <label 
                    htmlFor="isPublished"
                    className="w-12 h-6 bg-gray-200 dark:bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 cursor-pointer shadow-inner"
                  ></label>
                </div>
                <div>
                  <label htmlFor="isPublished" className="text-sm font-bold text-gray-700 dark:text-gray-300 cursor-pointer block">
                    Published
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">If checked, this FAQ will be visible on the website.</p>
                </div>
              </div>

            </form>

            <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-[#151515]/50 flex items-center justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 rounded-xl font-bold text-sm bg-white dark:bg-[#222] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                form="faq-form"
                className="px-6 py-2.5 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-colors flex items-center gap-2"
              >
                <CheckCircle2 size={16} />
                {editingFaq ? 'Save Changes' : 'Create FAQ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
