"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, Layers, Edit, Trash2, CheckCircle2, XCircle, Search, AlertCircle, IndianRupee } from "lucide-react";
import { servicesService, Service } from "@/services/admin/services.service";

/* ─── tiny inline toast ─── */
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

export default function ServicesManagementPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "loading" } | null>(null);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const data = await servicesService.getServices();
      setServices(data || []);
    } catch (error) {
      setToast({ message: "Failed to fetch services", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this service? This action cannot be undone.")) {
      try {
        setToast({ message: "Deleting service...", type: "loading" });
        await servicesService.deleteService(id);
        setToast({ message: "Service deleted successfully", type: "success" });
        fetchServices();
      } catch (error) {
        setToast({ message: "Failed to delete service", type: "error" });
      }
    }
  };

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    try {
      setToast({ message: "Updating status...", type: "loading" });
      await servicesService.toggleServiceActive(id, !currentStatus);
      setToast({ message: `Service is now ${!currentStatus ? 'Active' : 'Inactive'}`, type: "success" });
      fetchServices();
    } catch (error) {
      setToast({ message: "Failed to update service status", type: "error" });
    }
  };

  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400">
              <Layers size={24} />
            </div>
            Services Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-2">
            Manage your IT services catalog, update pricing, and control visibility.
          </p>
        </div>
        <button 
          onClick={() => router.push('/admin/services/create')}
          className="bg-[#39FF14] hover:bg-[#32e012] text-black px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm flex items-center gap-2 shrink-0"
        >
          <PlusCircle size={18} />
          Create Service
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
              placeholder="Search services by name or slug..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all"
            />
          </div>
        </div>

        {/* Services List Grid */}
        <div className="p-6 overflow-auto bg-gray-50 dark:bg-[#151515] min-h-[400px]">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-indigo-100 dark:border-indigo-500/20 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Loading services...</p>
              </div>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-white dark:bg-[#222] rounded-full flex items-center justify-center mb-4 border border-gray-100 dark:border-white/5">
                <Layers className="text-gray-400 dark:text-gray-500" size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No services found</h3>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 max-w-md">
                We couldn't find any services matching "{searchTerm}".
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredServices.map((service) => (
                <div key={service.id} className="bg-white dark:bg-[#111111] p-5 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all flex flex-col group relative">
                  
                  {/* Status Toggle on Top Right */}
                  <button 
                    onClick={() => handleToggleActive(service.id, service.isActive)}
                    className="absolute top-5 right-5 z-10 p-1 rounded-full border border-gray-200 dark:border-white/10 shadow-sm bg-white dark:bg-[#151515] flex items-center justify-center"
                    title={`Toggle Status (Currently ${service.isActive ? 'Active' : 'Inactive'})`}
                  >
                    <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${service.isActive ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700'}`}>
                      <div className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform ${service.isActive ? 'translate-x-4' : 'translate-x-0'}`}></div>
                    </div>
                  </button>

                  <div className="flex gap-4 items-start mb-4 pr-12">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                      <Layers size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-xs font-mono text-gray-500 dark:text-gray-400 mt-0.5 bg-gray-100 dark:bg-[#222] px-2 py-0.5 rounded inline-block">
                        /{service.slug}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium line-clamp-2 mb-6">
                    {service.description || "No description provided."}
                  </p>

                  <div className="mt-auto grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 dark:bg-[#151515] p-3 rounded-2xl border border-gray-100 dark:border-white/5">
                      <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">Pricing</p>
                      <p className="font-black text-gray-900 dark:text-white flex items-center text-sm">
                        {service.price ? <><IndianRupee size={12} className="mr-0.5"/>{Number(service.price).toFixed(2)}</> : "Custom"}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-[#151515] p-3 rounded-2xl border border-gray-100 dark:border-white/5">
                      <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">Timeline</p>
                      <p className="font-bold text-gray-900 dark:text-white text-sm">
                        {service.timeline || "TBD"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-white/5">
                    <button 
                      onClick={() => router.push(`/admin/services/${service.id}/fields`)}
                      className="flex-1 bg-white dark:bg-[#151515] border border-gray-200 dark:border-white/10 hover:border-indigo-500 hover:text-indigo-600 dark:hover:border-indigo-400 dark:hover:text-indigo-400 px-4 py-2 rounded-xl font-bold text-xs transition-colors text-gray-700 dark:text-gray-300"
                    >
                      Manage Fields
                    </button>
                    <button 
                      onClick={() => router.push(`/admin/services/${service.id}/edit`)}
                      className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:text-indigo-400 dark:hover:bg-indigo-500/10 rounded-xl transition-colors border border-transparent hover:border-indigo-200 dark:hover:border-indigo-500/20"
                      title="Edit Service"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(service.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-500/10 rounded-xl transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-500/20"
                      title="Delete Service"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
