'use client';

import Head from 'next/head';
import {
  SEOMetaData,
  OpenGraphData,
  TwitterCardData,
  getOpenGraphMeta,
  getTwitterCardMeta,
  getCanonicalUrl,
  HrefLangLink,
  generateHrefLangLinks,
  getPreconnectLinks,
} from '@/lib/seo';

interface SEOHeadProps {
  seo: SEOMetaData;
  openGraph?: OpenGraphData;
  twitterCard?: TwitterCardData;
  structuredData?: Record<string, string | number | boolean | Record<string, unknown>>[];
  hrefLangs?: HrefLangLink[];
  children?: React.ReactNode;
}

/**
 * SEO Head Component
 * Manages all SEO-related meta tags and structured data
 */
export function SEOHead({
  seo,
  openGraph,
  twitterCard,
  structuredData = [],
  hrefLangs = [],
  children,
}: SEOHeadProps) {
  const canonical = seo.canonical || getCanonicalUrl('');
  const ogMeta = openGraph ? getOpenGraphMeta(openGraph) : {};
  const twitterMeta = twitterCard ? getTwitterCardMeta(twitterCard) : {};
  const hrefLangLinks = generateHrefLangLinks('', hrefLangs);
  const preconnectLinks = getPreconnectLinks();

  return (
    <Head>
      {/* Basic SEO */}
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      {seo.keywords && <meta name="keywords" content={seo.keywords.join(', ')} />}
      <meta name="robots" content={seo.robots || 'index, follow'} />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta charSet="utf-8" />

      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      {Object.entries(ogMeta).map(([key, value]) => (
        <meta key={key} property={key} content={String(value)} />
      ))}

      {/* Twitter Card */}
      {Object.entries(twitterMeta).map(([key, value]) => (
        <meta key={key} name={key} content={String(value)} />
      ))}

      {/* Preconnect to important domains */}
      {preconnectLinks.map((link, index) => (
        <link
          key={index}
          rel={link.rel}
          href={link.href}
          crossOrigin={link.crossOrigin === 'anonymous' ? 'anonymous' : undefined}
        />
      ))}

      {/* Alternate language versions */}
      {hrefLangLinks.map((link, index) => (
        <link key={index} rel={link.rel} hrefLang={link.hrefLang} href={link.href} />
      ))}

      {/* Structured data (JSON-LD) */}
      {structuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}

      {/* Additional meta tags */}
      <meta name="theme-color" content="#2563eb" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="TechStore" />

      {/* Security headers (meta tags for browsers) */}
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />

      {/* Favicon and app icons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.json" />

      {/* Additional children */}
      {children}
    </Head>
  );
}

/**
 * Product page SEO component
 */
interface ProductPageSEOProps {
  productId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating?: number;
  reviewCount?: number;
}

export function ProductPageSEO({
  productId,
  name,
  description,
  price,
  image,
  rating,
  reviewCount,
}: ProductPageSEOProps) {
  const productUrl = getCanonicalUrl(`/products/${productId}`);

  const seo: SEOMetaData = {
    title: `${name} | TechStore`,
    description: description.substring(0, 160),
    keywords: ['electronics', 'tech', 'products', name.toLowerCase()],
    canonical: productUrl,
  };

  const openGraph: OpenGraphData = {
    title: name,
    description,
    image,
    url: productUrl,
    type: 'product',
  };

  const structuredData = [
    {
      '@context': 'https://schema.org/',
      '@type': 'Product',
      name,
      description,
      image,
      brand: { '@type': 'Brand', name: 'TechStore' },
      offers: {
        '@type': 'Offer',
        url: productUrl,
        priceCurrency: 'USD',
        price: price.toString(),
        availability: 'https://schema.org/InStock',
      },
      ...(rating && reviewCount && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: rating.toString(),
          reviewCount: reviewCount.toString(),
        },
      }),
    },
  ];

  return (
    <SEOHead
      seo={seo}
      openGraph={openGraph}
      structuredData={structuredData}
    />
  );
}

/**
 * Article/Blog page SEO component
 */
interface ArticlePageSEOProps {
  title: string;
  description: string;
  image: string;
  author: string;
  publishDate: string;
  modifiedDate?: string;
}

export function ArticlePageSEO({
  title,
  description,
  image,
  author,
  publishDate,
  modifiedDate,
}: ArticlePageSEOProps) {
  const seo: SEOMetaData = {
    title: `${title} | TechStore Blog`,
    description,
    keywords: ['blog', 'tech', 'guide', title.toLowerCase()],
  };

  const openGraph: OpenGraphData = {
    title,
    description,
    image,
    url: typeof window !== 'undefined' ? window.location.href : '',
    type: 'article',
    author,
    publishDate,
  };

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description,
      image,
      author: { '@type': 'Person', name: author },
      datePublished: publishDate,
      ...(modifiedDate && { dateModified: modifiedDate }),
    },
  ];

  return (
    <SEOHead
      seo={seo}
      openGraph={openGraph}
      structuredData={structuredData}
    />
  );
}

/**
 * Category page SEO component
 */
interface CategoryPageSEOProps {
  categoryName: string;
  description: string;
  image?: string;
}

export function CategoryPageSEO({
  categoryName,
  description,
  image,
}: CategoryPageSEOProps) {
  const seo: SEOMetaData = {
    title: `${categoryName} | TechStore`,
    description,
    keywords: [categoryName.toLowerCase(), 'electronics', 'tech'],
  };

  const openGraph: OpenGraphData = {
    title: categoryName,
    description,
    image: image || '/default-category.png',
    url: typeof window !== 'undefined' ? window.location.href : '',
    type: 'website',
  };

  return (
    <SEOHead
      seo={seo}
      openGraph={openGraph}
    />
  );
}
