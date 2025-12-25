/**
 * SEO Utilities for Next.js
 * Includes meta tags, structured data, and SEO helpers
 */

/**
 * Product structured data (Schema.org)
 */
export interface ProductStructuredData {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  rating?: {
    ratingValue: number;
    reviewCount: number;
  };
  availability: 'InStock' | 'OutOfStock' | 'PreOrder';
  category: string;
}

export const getProductStructuredData = (product: ProductStructuredData) => ({
  '@context': 'https://schema.org/',
  '@type': 'Product',
  name: product.name,
  description: product.description,
  image: product.image,
  brand: {
    '@type': 'Brand',
    name: 'TechStore',
  },
  offers: {
    '@type': 'Offer',
    url: typeof window !== 'undefined' ? window.location.href : '',
    priceCurrency: product.currency,
    price: product.price,
    availability: `https://schema.org/${product.availability}`,
  },
  ...(product.rating && {
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating.ratingValue,
      reviewCount: product.rating.reviewCount,
    },
  }),
});

/**
 * Organization structured data
 */
export const organizationStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'TechStore',
  url: 'https://techstore.com',
  logo: 'https://techstore.com/logo.png',
  description: 'Premium electronics and tech accessories store',
  sameAs: [
    'https://facebook.com/techstore',
    'https://twitter.com/techstore',
    'https://instagram.com/techstore',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-888-TECHSTORE',
    contactType: 'Customer Service',
  },
};

/**
 * Breadcrumb structured data
 */
export interface BreadcrumbItem {
  name: string;
  path: string;
}

export const getBreadcrumbStructuredData = (items: BreadcrumbItem[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: `https://techstore.com${item.path}`,
  })),
});

/**
 * Article structured data
 */
export interface ArticleData {
  title: string;
  description: string;
  image: string;
  author: string;
  publishDate: string;
  modifiedDate?: string;
}

export const getArticleStructuredData = (article: ArticleData) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: article.title,
  description: article.description,
  image: article.image,
  author: {
    '@type': 'Person',
    name: article.author,
  },
  datePublished: article.publishDate,
  ...(article.modifiedDate && { dateModified: article.modifiedDate }),
});

/**
 * FAQPage structured data
 */
export interface FAQItem {
  question: string;
  answer: string;
}

export const getFAQStructuredData = (items: FAQItem[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
});

/**
 * Generate sitemap index for large sites
 */
export const generateSitemapIndex = (sitemaps: string[]) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map((sitemap) => `  <sitemap>
    <loc>${sitemap}</loc>
  </sitemap>`).join('\n')}
</sitemapindex>`;
};

/**
 * Generate robots.txt
 */
export const generateRobotsTxt = (
  siteUrl: string,
  disallowedPaths: string[] = []
) => {
  return `User-agent: *
Allow: /

${disallowedPaths.map((path) => `Disallow: ${path}`).join('\n')}

Sitemap: ${siteUrl}/sitemap.xml
Sitemap: ${siteUrl}/sitemap-products.xml

# Crawl delay to avoid overloading server
Crawl-delay: 1

User-agent: GPTBot
Disallow: /

User-agent: CCBot
Disallow: /`;
};

/**
 * Generate canonical URL
 */
export const getCanonicalUrl = (pathname: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://techstore.com';
  return `${baseUrl}${pathname}`;
};

/**
 * Open Graph meta tags
 */
export interface OpenGraphData {
  title: string;
  description: string;
  image: string;
  url: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishDate?: string;
}

export const getOpenGraphMeta = (data: OpenGraphData) => ({
  'og:title': data.title,
  'og:description': data.description,
  'og:image': data.image,
  'og:url': data.url,
  'og:type': data.type || 'website',
  'og:site_name': 'TechStore',
  ...(data.author && { 'article:author': data.author }),
  ...(data.publishDate && { 'article:published_time': data.publishDate }),
});

/**
 * Twitter Card meta tags
 */
export interface TwitterCardData {
  title: string;
  description: string;
  image: string;
  creator?: string;
}

export const getTwitterCardMeta = (data: TwitterCardData) => ({
  'twitter:card': 'summary_large_image',
  'twitter:title': data.title,
  'twitter:description': data.description,
  'twitter:image': data.image,
  ...(data.creator && { 'twitter:creator': data.creator }),
});

/**
 * Standard SEO meta tags
 */
export interface SEOMetaData {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  robots?: string;
}

export const getSEOMeta = (data: SEOMetaData) => ({
  title: data.title,
  description: data.description,
  ...(data.keywords && { keywords: data.keywords.join(', ') }),
  ...(data.canonical && { canonical: data.canonical }),
  ...(data.robots && { robots: data.robots }),
});

/**
 * Generate XML sitemap for products
 */
export interface SitemapItem {
  url: string;
  lastModified?: string;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const generateSitemap = (items: SitemapItem[]) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items
  .map(
    (item) => `  <url>
    <loc>${item.url}</loc>
    ${item.lastModified ? `<lastmod>${item.lastModified}</lastmod>` : ''}
    ${item.changeFrequency ? `<changefreq>${item.changeFrequency}</changefreq>` : ''}
    ${item.priority ? `<priority>${item.priority}</priority>` : '<priority>0.8</priority>'}
  </url>`
  )
  .join('\n')}
</urlset>`;
};

/**
 * Structured data for local business
 */
export const localBusinessStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'TechStore',
  image: 'https://techstore.com/logo.png',
  description: 'Premium electronics and tech accessories store',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '123 Tech Avenue',
    addressLocality: 'San Francisco',
    addressRegion: 'CA',
    postalCode: '94105',
    addressCountry: 'US',
  },
  telephone: '+1-888-TECHSTORE',
  url: 'https://techstore.com',
  priceRange: '$$',
};

/**
 * Hreflang alternate links for internationalization
 */
export interface HrefLangLink {
  hrefLang: string;
  href: string;
}

export const generateHrefLangLinks = (
  currentPath: string,
  languages: HrefLangLink[]
) => {
  return languages.map((lang) => ({
    rel: 'alternate',
    hrefLang: lang.hrefLang,
    href: lang.href,
  }));
};

/**
 * Mobile web app meta tags
 */
export const getMobileAppMeta = () => ({
  'viewport': 'width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover',
  'apple-mobile-web-app-capable': 'yes',
  'apple-mobile-web-app-status-bar-style': 'black-translucent',
  'apple-mobile-web-app-title': 'TechStore',
});

/**
 * Security and verification meta tags
 */
export const getSecurityMeta = () => ({
  'X-UA-Compatible': 'IE=edge',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
});

/**
 * Preconnect to important external domains
 */
export const getPreconnectLinks = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  { rel: 'preconnect', href: 'https://res.cloudinary.com' },
  { rel: 'dns-prefetch', href: 'https://analytics.google.com' },
];
