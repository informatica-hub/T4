import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

interface SeoProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: "website" | "article" | "product";
  noindex?: boolean;
  keywords?: string;
  jsonLd?: Record<string, any> | Record<string, any>[];
}

const SITE_URL = "https://t4mexico.com";
const DEFAULT_IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/Rptnp5jFllVT6KCJyjI2LxzwtY12/social-images/social-1771367429979-banner-hero.webp";

export const Seo = ({
  title,
  description,
  canonical,
  image = DEFAULT_IMAGE,
  type = "website",
  noindex = false,
  keywords,
  jsonLd,
}: SeoProps) => {
  const location = useLocation();
  const url = canonical || `${SITE_URL}${location.pathname}`;
  const safeTitle = title.length > 60 ? title.slice(0, 57) + "..." : title;
  const safeDesc =
    description.length > 160 ? description.slice(0, 157) + "..." : description;

  const ldArray = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : [];

  return (
    <Helmet>
      <title>{safeTitle}</title>
      <meta name="description" content={safeDesc} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={url} />
      <meta
        name="robots"
        content={noindex ? "noindex,nofollow" : "index,follow"}
      />
      <meta property="og:title" content={safeTitle} />
      <meta property="og:description" content={safeDesc} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="es_MX" />
      <meta property="og:site_name" content="T4" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={safeTitle} />
      <meta name="twitter:description" content={safeDesc} />
      <meta name="twitter:image" content={image} />
      <link rel="alternate" hrefLang="es-MX" href={url} />
      <link rel="alternate" hrefLang="x-default" href={url} />
      {ldArray.map((ld, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(ld)}
        </script>
      ))}
    </Helmet>
  );
};

export default Seo;
