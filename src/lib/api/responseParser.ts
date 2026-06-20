/**
 * Extracts an array of items from various common backend response wrapper formats.
 * @param response The JSON response from the API (usually `response.data` in Axios)
 * @returns The extracted array or an empty array if not found
 */
export function extractDataArray<T = any>(response: any): T[] {
  if (!response) return [];

  // Direct array
  if (Array.isArray(response)) return response;

  // Common wrapper paths
  if (response.data && Array.isArray(response.data)) return response.data;
  if (response.data?.data && Array.isArray(response.data.data)) return response.data.data;
  if (response.data?.data?.data && Array.isArray(response.data.data.data)) return response.data.data.data;

  // Specific common keys
  const possibleKeys = [
    'payments', 'roles', 'users', 'enquiries', 'assets', 'items', 'rows', 'data',
    'categories', 'posts', 'services', 'requests', 'plans', 'features', 'tickets',
    'invoices', 'testimonials', 'faqs', 'leads', 'portfolio', 'tasks', 'task',
    'reimbursements', 'reimbursement', 'claims'
  ];
  for (const key of possibleKeys) {
    if (response[key] && Array.isArray(response[key])) return response[key];
    if (response.data?.[key] && Array.isArray(response.data[key])) return response.data[key];
    if (response.data?.data?.[key] && Array.isArray(response.data.data[key])) return response.data.data[key];
  }

  return [];
}

/**
 * Extracts pagination details from various common backend response wrapper formats.
 * @param response The JSON response from the API
 * @param fallbackTotal A fallback total in case it's not found (e.g. array length)
 * @returns An object with total, page, and totalPages
 */
export function extractPagination(response: any, fallbackTotal: number = 0) {
  const defaultPagination = { total: fallbackTotal, page: 1, totalPages: 1 };
  if (!response) return defaultPagination;

  // Search for pagination object
  const p =
    response.pagination ||
    response.data?.pagination ||
    response.data?.data?.pagination ||
    response.meta ||
    response.data?.meta;

  if (p) {
    return {
      total: p.total || fallbackTotal,
      page: p.page || p.currentPage || 1,
      totalPages: p.totalPages || Math.ceil((p.total || fallbackTotal) / (p.limit || 10)) || 1,
    };
  }

  // Direct fields
  const total = response.total ?? response.data?.total ?? response.data?.data?.total ?? fallbackTotal;
  const page = response.page ?? response.data?.page ?? response.data?.data?.page ?? 1;
  const totalPages =
    response.totalPages ?? response.data?.totalPages ?? response.data?.data?.totalPages ?? 1;

  return { total, page, totalPages };
}

/**
 * Extracts a singular object from common backend response wrapper formats.
 * @param response The JSON response from the API
 * @returns The extracted object or null
 */
export function extractDataObject<T = any>(response: any): T | null {
  if (!response) return null;

  // If there's a nested data property that is an object but not an array
  if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
    if (response.data.data && typeof response.data.data === 'object' && !Array.isArray(response.data.data)) {
      return response.data.data as T;
    }
    return response.data as T;
  }

  // Handle success wrapper with undefined data
  if (response.success !== undefined && response.data === undefined) {
    return null;
  }

  return response as T;
}
