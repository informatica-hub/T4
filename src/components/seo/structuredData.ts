const SITE_URL = "https://t4mexico.com";
const LOGO =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/Rptnp5jFllVT6KCJyjI2LxzwtY12/uploads/1771007388798-LogotipoT4.svg";

export const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "T4",
  alternateName: "T4 México",
  url: SITE_URL,
  logo: LOGO,
  email: "secuenciacion@t4mexico.com",
  telephone: "+52-462-624-0364",
  address: {
    "@type": "PostalAddress",
    addressCountry: "MX",
    addressRegion: "México",
  },
  areaServed: { "@type": "Country", name: "México" },
};

export const localBusinessLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}#localbusiness`,
  name: "T4",
  image: LOGO,
  url: SITE_URL,
  telephone: "+52-462-624-0364",
  email: "secuenciacion@t4mexico.com",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressCountry: "MX",
    addressRegion: "México",
  },
  areaServed: { "@type": "Country", name: "México" },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
  ],
};

export const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "T4 México",
  url: SITE_URL,
  inLanguage: "es-MX",
};

export const breadcrumbLd = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: it.url.startsWith("http") ? it.url : `${SITE_URL}${it.url}`,
  })),
});

export const productLd = (p: {
  name: string;
  description: string;
  image?: string;
  category?: string;
  url: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: p.name,
  description: p.description,
  image: p.image || LOGO,
  category: p.category,
  brand: { "@type": "Brand", name: "T4" },
  manufacturer: { "@type": "Organization", name: "T4" },
  url: p.url.startsWith("http") ? p.url : `${SITE_URL}${p.url}`,
  offers: {
    "@type": "Offer",
    availability: "https://schema.org/InStock",
    areaServed: { "@type": "Country", name: "México" },
    priceCurrency: "MXN",
    price: "0",
    priceSpecification: {
      "@type": "PriceSpecification",
      priceCurrency: "MXN",
      description: "Cotización personalizada bajo solicitud",
    },
    seller: { "@type": "Organization", name: "T4" },
  },
});

export const serviceLd = (s: {
  name: string;
  description: string;
  url: string;
  serviceType?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: s.name,
  description: s.description,
  serviceType: s.serviceType || s.name,
  provider: { "@type": "Organization", name: "T4", url: SITE_URL },
  areaServed: { "@type": "Country", name: "México" },
  url: s.url.startsWith("http") ? s.url : `${SITE_URL}${s.url}`,
});

export const faqLd = (faqs: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});
