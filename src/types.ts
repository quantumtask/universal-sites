export type Currency = 'USD' | 'GBP' | 'EUR' | 'AUD' | 'CAD' | 'ZAR';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  surface: string;
}

export interface ServiceItem {
  title: string;
  description: string;
}

export interface ReviewItem {
  name: string;
  quote: string;
  role?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface PricingTier {
  tier: string;
  price: string;
  unit?: string;
  features: string[];
  highlight?: boolean;
  cta?: string;
}

export interface GalleryItem {
  img: string;
  caption: string;
  alt?: string;
}

export interface ClientSiteConfig {
  id: string;
  business_name: string;
  niche: string;
  city: string;
  domain: string;
  logo_path: string;

  phone: string;
  email: string;

  headline: string;
  subheadline: string;
  about_text: string;

  services: ServiceItem[];
  reviews: ReviewItem[];
  faqs: FAQItem[];

  cta_text: string;
  cta_url: string;
  hero_cta_text?: string;
  hero_cta_url?: string;

  theme_colors: ThemeColors;

  // stats
  jobs_count?: string;
  jobs_text?: string;

  // optional rich sections
  pricing?: PricingTier[];
  gallery?: GalleryItem[];

  // additional local-service SEO/data slots
  metadata?: {
    title?: string;
    description?: string;
    locale?: string;
    currency?: Currency;
    opening_hours?: string;
    address?: string;
  };

  service_area_text?: string;
  differentiators?: string[];
  trust_proof?: string[];

  // optional media assets
  images?: {
    banner?: string;
    about_main?: string;
    about_side?: string;
    form_bg?: string;
    footer_bg?: string;
  };

  // typography style preset key (see TEXT_STYLES in template.ts)
  text_style?: string;

  // social media profile URLs (all optional — hidden if empty)
  social?: {
    facebook?:  string;
    instagram?: string;
    linkedin?:  string;
    google?:    string;
  };
}
