import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PortfolioDetailClient } from "@/components/sections/PortfolioDetailClient";
import { api } from "@/lib/axios";
import { Portfolio } from "@/app/types/portfolio.types";

export const revalidate = 300;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const portfolios = await api.fetchPortfolios();
    return portfolios.map((p) => ({ slug: p.slug }));
  } catch {
    return [
      { slug: "style-store" },
      { slug: "coin-flow" },
      { slug: "neuro-sync" },
    ];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const portfolios = await api.fetchPortfolios();
    const project = portfolios.find((p) => p.slug === slug);
    if (!project) return { title: "Case Study Not Found" };

    return {
      title: `${project.clientName} Case Study — APXTECK`,
      description: project.problem || `Read the detailed case study of our project with ${project.clientName}.`,
      openGraph: {
        title: `${project.clientName} Case Study — APXTECK`,
        description: project.problem || `Read the detailed case study of our project with ${project.clientName}.`,
        url: `https://apxteck.com/portfolio/${slug}`,
        siteName: "APXTeck",
        type: "article",
        images: project.coverImageUrl ? [{ url: project.coverImageUrl }] : undefined,
      },
      alternates: {
        canonical: `https://apxteck.com/portfolio/${slug}`,
      },
    };
  } catch {
    return {
      title: "Case Study Details — APXTeck",
    };
  }
}

export default async function PortfolioDetailPage({ params }: Props) {
  const { slug } = await params;

  let portfolios: Portfolio[] = [];
  try {
    portfolios = await api.fetchPortfolios();
  } catch (err) {
    console.error("Failed to load server portfolio", err);
  }

  const project = portfolios.find((p) => p.slug === slug);
  if (!project) {
    notFound();
  }

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `${project.clientName} Case Study - ${project.title}`,
    "description": project.problem || project.results,
    "image": project.coverImageUrl,
    "publisher": {
      "@type": "Organization",
      "name": "APXTeck"
    }
  };

  return (
    <div className="flex flex-col min-h-screen selection:bg-accent/30 bg-background text-foreground transition-colors duration-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />

      <Navbar />

      <main className="flex-1 pt-24 pb-20">
        <PortfolioDetailClient project={project} />
      </main>

      <Footer />
    </div>
  );
}
