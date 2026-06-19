import { Helmet } from 'react-helmet-async';

// Centralised SEO: title, description, Open Graph, Twitter cards, and
// optional JSON-LD structured data (Phase 14).
const Seo = ({ title, description, image, url, type = 'website', jsonLd }) => {
  const fullTitle = title || 'Portfolio publisher';
  const desc = (description || 'A premium developer portfolio.').slice(0, 200);
  const canonical = url || (typeof window !== 'undefined' ? window.location.href : '');

  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      {canonical && <link rel="canonical" href={canonical} />}

      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      {canonical && <meta property="og:url" content={canonical} />}
      {image && <meta property="og:image" content={image} />}

      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      {image && <meta name="twitter:image" content={image} />}

      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
};

export default Seo;
