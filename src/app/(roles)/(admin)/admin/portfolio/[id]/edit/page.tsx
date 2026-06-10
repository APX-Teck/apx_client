"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PortfolioForm from "../../_components/PortfolioForm";
import { portfolioService, Portfolio } from "@/services/admin/portfolio.service";
import { Layers } from "lucide-react";

export default function EditPortfolioPage() {
  const params = useParams();
  const id = Number(params.id);
  const router = useRouter();

  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id || isNaN(id)) {
      router.push("/admin/portfolio");
      return;
    }

    const fetchPortfolio = async () => {
      try {
        const data = await portfolioService.getPortfolioByIdAdmin(id);
        setPortfolio(data);
      } catch (error) {
        console.error("Failed to load portfolio:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolio();
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="flex flex-col h-64 items-center justify-center gap-4">
        <Layers size={48} className="text-gray-500" />
        <h2 className="text-xl font-bold text-white">Portfolio Not Found</h2>
        <button onClick={() => router.push("/admin/portfolio")} className="text-indigo-400 hover:text-indigo-300">
          Return to Portfolio Management
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PortfolioForm mode="edit" initialData={portfolio} />
    </div>
  );
}
