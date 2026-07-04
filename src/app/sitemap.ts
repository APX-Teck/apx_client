import { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.apxteck.com';
const API_URL = process.env.NEXT_PUBLIC_NODEJS_API_URL || 'https://api.apxteck.com/api/v1';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Define Static Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/insights-news`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/careers`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/disclaimer`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  // Helper to safely extract arrays from various API wrapper formats
  const extractArray = (res: any): any[] => {
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (res.data && Array.isArray(res.data)) return res.data;
    if (res.data && res.data.data && Array.isArray(res.data.data)) return res.data.data;
    if (res.posts && Array.isArray(res.posts)) return res.posts;
    return [];
  };

  const dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    // 2. Fetch Dynamic Data in Parallel
    // Using cache: 'no-store' ensures it fetches live data straight from the backend every time
    const [blogsRes, servicesRes, portfoliosRes] = await Promise.allSettled([
      fetch(`${API_URL}/blog/public/posts`, { cache: 'no-store' }),
      fetch(`${API_URL}/service/getAll`, { cache: 'no-store' }),
      fetch(`${API_URL}/portfolio/public`, { cache: 'no-store' }),
    ]);

    // Process Blogs -> /insights-news/[slug]
    if (blogsRes.status === 'fulfilled' && blogsRes.value.ok) {
      const data = await blogsRes.value.json();
      const blogs = extractArray(data);
      const blogRoutes = blogs.map((blog: any) => ({
        url: `${BASE_URL}/insights-news/${blog?.slug || blog?.id}`,
        lastModified: new Date(blog?.updatedAt || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.8, // Increased priority for blogs for better SEO
      }));
      dynamicRoutes.push(...blogRoutes);
    }

    // Process Services -> /services/[slug]
    if (servicesRes.status === 'fulfilled' && servicesRes.value.ok) {
      const data = await servicesRes.value.json();
      const services = extractArray(data);
      const serviceRoutes = services.map((service: any) => ({
        url: `${BASE_URL}/services/${service?.slug || service?.id}`,
        lastModified: new Date(service?.updatedAt || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.9, // High priority for service pages
      }));
      dynamicRoutes.push(...serviceRoutes);
    }

    // Process Portfolios -> /portfolio/[slug]
    if (portfoliosRes.status === 'fulfilled' && portfoliosRes.value.ok) {
      const data = await portfoliosRes.value.json();
      const portfolios = extractArray(data);
      const portfolioRoutes = portfolios.map((portfolio: any) => ({
        url: `${BASE_URL}/portfolio/${portfolio?.slug || portfolio?.id}`,
        lastModified: new Date(portfolio?.updatedAt || new Date()),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));
      dynamicRoutes.push(...portfolioRoutes);
    }
  } catch (error) {
    console.error('Error fetching dynamic routes for sitemap:', error);
  }

  // 3. Combine Static and Dynamic Routes
  return [...staticRoutes, ...dynamicRoutes];
}
