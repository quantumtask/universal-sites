import { ClientSiteConfig, PricingTier, GalleryItem } from '../types';

export function escapeHtml(value: string): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/** Webflow-style service rows */
export function renderItems(items: Array<{ title: string; description: string }>): string {
  if (!Array.isArray(items) || items.length === 0) {
    return '<p style="color:var(--color-muted)">No services available yet.</p>';
  }
  return items
    .map(
      (item, i) =>
        `<div class="product-link-block reveal" style="--i:${i}">
          <div class="product-card-left-wrap">
            <div class="product-title">${escapeHtml(item.title)}</div>
            <p>${escapeHtml(item.description)}</p>
          </div>
          <div class="product-card-details-wrap">
            <div class="product-card-details-wrapper">
              <div class="price-title">Available 24/7</div>
              <span class="price-badge">Free Quote</span>
            </div>
          </div>
        </div>`,
    )
    .join('');
}

/** Webflow-style testimonial cards */
export function renderReviews(reviews: ClientSiteConfig['reviews']): string {
  if (!Array.isArray(reviews) || reviews.length === 0) {
    return '<p style="color:var(--color-muted)">No reviews yet.</p>';
  }
  const stars =
    '<div class="stars-wrap" aria-label="5 out of 5 stars">' +
    '<span class="star" aria-hidden="true">&#9733;</span>'.repeat(5) +
    '</div>';
  return reviews
    .map(
      (review, i) =>
        `<div class="testimonial-card reveal" style="--i:${i}">
          <div class="testimonial-text-wrapper">
            ${stars}
            <p class="testimonial-text">&ldquo;${escapeHtml(review.quote)}&rdquo;</p>
            <div class="testimonial-title">${escapeHtml(review.name)}</div>
            ${review.role ? `<div class="client-info">${escapeHtml(review.role)}</div>` : ''}
          </div>
        </div>`,
    )
    .join('');
}

/** Webflow blog-card style FAQ (image + question + answer) */
export function renderFaq(faqs: ClientSiteConfig['faqs'], coverImg?: string): string {
  if (!Array.isArray(faqs) || faqs.length === 0) {
    return '<p style="color:var(--color-muted)">No FAQs yet.</p>';
  }
  return faqs
    .map(
      (faq, i) =>
        `<div class="blog-collection-item reveal" style="--i:${i}">
          <div class="blog-link-block">
            ${
              coverImg
                ? `<img class="blog-card-cover" src="${escapeHtml(coverImg)}" alt="${escapeHtml(faq.question)}" loading="lazy">`
                : '<div class="blog-card-placeholder"></div>'
            }
          </div>
          <div class="blog-card-text-wrap">
            <div class="blog-post-text-link">${escapeHtml(faq.question)}</div>
            <p>${escapeHtml(faq.answer)}</p>
          </div>
        </div>`,
    )
    .join('');
}

/** Webflow-style pricing tiers */
export function renderPricingSection(pricing: PricingTier[] | undefined, ctaUrl: string): string {
  if (!Array.isArray(pricing) || pricing.length === 0) return '';

  const tiers = pricing
    .map(
      (tier, i) =>
        `<div class="pricing-card${tier.highlight ? ' pricing-card--popular' : ''} reveal" style="--i:${i}">
          ${tier.highlight ? '<div class="pricing-badge">Most Popular</div>' : ''}
          <div class="pricing-tier">${escapeHtml(tier.tier)}</div>
          <div class="pricing-price">
            ${tier.unit ? `<span class="pricing-unit">${escapeHtml(tier.unit)}</span>` : ''}
            <span class="pricing-amount">${escapeHtml(tier.price)}</span>
          </div>
          <ul class="pricing-features">
            ${tier.features.map((f) => `<li>${escapeHtml(f)}</li>`).join('')}
          </ul>
          <a href="${escapeHtml(ctaUrl)}" class="primary-link-button" style="margin-top:auto;align-self:flex-start;">
            <span class="button-text">${escapeHtml(tier.cta ?? 'Get Started')}</span>
          </a>
        </div>`,
    )
    .join('');

  return `
<section class="section" id="pricing">
  <div class="base-container">
    <div class="section-title-wrap reveal">
      <span class="section-label">Pricing</span>
      <h2>Simple, Transparent Pricing</h2>
      <p style="color:var(--color-muted);font-size:1rem;margin-top:12px;">No hidden fees. No surprises. Just clear, upfront pricing.</p>
    </div>
    <div class="pricing-grid">${tiers}</div>
  </div>
</section>`;
}

/** Gallery section */
export function renderGallerySection(gallery: GalleryItem[] | undefined): string {
  if (!Array.isArray(gallery) || gallery.length === 0) return '';

  const items = gallery
    .map(
      (item, i) =>
        `<div class="gallery-item reveal" style="--i:${i}">
          <img src="${escapeHtml(item.img)}" alt="${escapeHtml(item.alt ?? item.caption)}" loading="lazy">
          <div class="gallery-caption">${escapeHtml(item.caption)}</div>
        </div>`,
    )
    .join('');

  return `
<section class="section" id="gallery">
  <div class="base-container">
    <div class="section-title-wrap reveal">
      <span class="section-label">Our Work</span>
      <h2>Gallery</h2>
    </div>
    <div class="gallery-grid">${items}</div>
  </div>
</section>`;
}

/** Standards grid — dark premium cards with SVG icons */
export function renderStandardsSection(differentiators: string[] | undefined): string {
  if (!Array.isArray(differentiators) || differentiators.length === 0) return '';

  const svgs = [
    // Shield-check — quality/guarantee
    `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>`,
    // Zap — speed/response
    `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    // Star — excellence
    `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    // Wrench — expertise
    `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>`,
    // Users — trusted team
    `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>`,
    // Award — certified
    `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>`,
  ];

  const items = differentiators
    .map((d, i) => {
      const num = String(i + 1).padStart(2, '0');
      const svg = svgs[i % svgs.length];
      return `<div class="rule-card reveal" data-num="${num}" style="--i:${i}">
        <div class="rule-card-header">
          <div class="rule-icon-wrapper" aria-hidden="true">${svg}</div>
          <span class="rule-card-number">${num}</span>
        </div>
        <p>${escapeHtml(d)}</p>
      </div>`;
    })
    .join('');

  return `
<section class="section without-top-spacing" id="standards">
  <div class="base-container">
    <div class="section-title-wrap reveal">
      <span class="section-label">Why Choose Us</span>
      <h2>Our Standards</h2>
    </div>
    <div class="rules-grid">${items}</div>
  </div>
</section>`;
}

/* ═══════════════════════════════════════════════════════════════
   TAILWIND TEMPLATE RENDERERS
   ═══════════════════════════════════════════════════════════════ */

/** Tailwind service cards — modern card grid */
export function renderTwServices(items: Array<{ title: string; description: string }>, images?: Record<string, string>): string {
  if (!Array.isArray(items) || items.length === 0) return '<p class="text-gray-400">No services available yet.</p>';

  const icons = [
    `<svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>`,
    `<svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    `<svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>`,
    `<svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>`,
    `<svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    `<svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>`,
  ];

  return items.map((item, i) => {
    const imgKey = `service${i + 1}` as string;
    const imgUrl = images?.[imgKey];
    const icon = icons[i % icons.length];
    return `<div class="reveal service-card group bg-surface rounded-2xl overflow-hidden border border-gray-100 hover:border-accent/20" style="--i:${i}">
      ${imgUrl ? `<div class="h-48 overflow-hidden"><img src="${escapeHtml(imgUrl)}" alt="${escapeHtml(item.title)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy"></div>` : ''}
      <div class="p-7">
        <div class="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-5 group-hover:bg-accent group-hover:text-white transition-all">${icon}</div>
        <h3 class="font-display text-lg font-bold mb-2">${escapeHtml(item.title)}</h3>
        <p class="text-gray-500 text-sm leading-relaxed mb-4">${escapeHtml(item.description)}</p>
        <div class="flex items-center justify-between pt-4 border-t border-gray-100">
          <span class="text-xs text-gray-400 font-medium">Available 24/7</span>
          <span class="text-xs font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full">Free Quote</span>
        </div>
      </div>
    </div>`;
  }).join('');
}

/** Tailwind review cards */
export function renderTwReviews(reviews: ClientSiteConfig['reviews']): string {
  if (!Array.isArray(reviews) || reviews.length === 0) return '<p class="text-gray-400">No reviews yet.</p>';

  const stars = '<div class="flex gap-0.5 mb-3">' + '<span class="star text-lg">&#9733;</span>'.repeat(5) + '</div>';
  const avatarColors = ['bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500', 'bg-rose-500'];

  return reviews.map((review, i) => {
    const initial = review.name.charAt(0).toUpperCase();
    const color = avatarColors[i % avatarColors.length];
    const body = (review as unknown as Record<string, unknown>).body as string | undefined;
    return `<div class="reveal testi-card bg-surface rounded-2xl p-7 border border-gray-100" style="--i:${i}">
      ${stars}
      <p class="text-gray-600 leading-relaxed mb-6">&ldquo;${escapeHtml(body ?? review.quote)}&rdquo;</p>
      <div class="flex items-center gap-3 pt-4 border-t border-gray-100">
        <div class="w-10 h-10 rounded-full ${color} text-white flex items-center justify-center font-bold text-sm shrink-0">${initial}</div>
        <div>
          <div class="font-semibold text-sm">${escapeHtml(review.name)}</div>
          ${review.role ? `<div class="text-gray-400 text-xs">${escapeHtml(review.role)}</div>` : ''}
        </div>
      </div>
    </div>`;
  }).join('');
}

/** Tailwind FAQ accordion */
export function renderTwFaqs(faqs: ClientSiteConfig['faqs']): string {
  if (!Array.isArray(faqs) || faqs.length === 0) return '<p class="text-gray-400">No FAQs yet.</p>';

  return faqs.map((faq, i) =>
    `<div class="reveal bg-surface rounded-2xl border border-gray-100 overflow-hidden" style="--i:${i}">
      <input type="checkbox" id="faq-${i}" class="faq-toggle hidden">
      <label for="faq-${i}" class="faq-label flex items-center justify-between px-5 py-4 sm:px-6 sm:py-5 cursor-pointer hover:bg-gray-50/80 transition-colors gap-4">
        <div class="flex items-center gap-3.5">
          <span class="shrink-0 w-7 h-7 rounded-full bg-accent/10 text-accent text-xs font-bold flex items-center justify-center font-display">${i + 1}</span>
          <span class="font-semibold text-sm sm:text-base">${escapeHtml(faq.question)}</span>
        </div>
        <svg class="faq-chevron w-5 h-5 text-gray-400 shrink-0 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M19 9l-7 7-7-7"/></svg>
      </label>
      <div class="faq-body px-5 sm:px-6 text-gray-500 text-sm leading-relaxed pl-[60px] sm:pl-[68px]">${escapeHtml(faq.answer)}</div>
    </div>`
  ).join('');
}

/** Tailwind pricing section */
export function renderTwPricingSection(pricing: PricingTier[] | undefined, ctaUrl: string): string {
  if (!Array.isArray(pricing) || pricing.length === 0) return '';

  const tiers = pricing.map((tier, i) => {
    const hl = tier.highlight;
    return `<div class="reveal ${hl ? 'pricing-highlight relative overflow-hidden' : 'relative'} bg-surface rounded-2xl p-8 border ${hl ? 'border-accent/60' : 'border-gray-100'} flex flex-col" style="--i:${i}">
      ${hl ? `<div class="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-accent via-accent to-accent/60 rounded-t-2xl"></div>
      <div class="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-accent text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md shadow-accent/30 whitespace-nowrap">Most Popular</div>` : ''}
      <div class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ${hl ? 'mt-2' : ''}">${escapeHtml(tier.tier)}</div>
      <div class="flex items-baseline gap-1 mb-7">
        ${tier.unit ? `<span class="text-base text-gray-400 font-medium">${escapeHtml(tier.unit)}</span>` : ''}
        <span class="font-display text-5xl font-bold tracking-tight">${escapeHtml(tier.price)}</span>
      </div>
      <ul class="space-y-3.5 mb-8 flex-1">
        ${tier.features.map(f => `<li class="flex items-start gap-3 text-sm text-gray-600"><svg class="w-4.5 h-4.5 text-accent shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7"/></svg>${escapeHtml(f)}</li>`).join('')}
      </ul>
      <a href="${escapeHtml(ctaUrl)}" class="${hl ? 'bg-accent text-white shadow-lg shadow-accent/25 hover:brightness-110' : 'bg-gray-900 text-white hover:bg-gray-800'} font-semibold py-3.5 rounded-full text-center text-sm transition-all">
        ${escapeHtml(tier.cta ?? 'Get Started')}
      </a>
    </div>`;
  }).join('');

  return `<section id="pricing" class="py-24 lg:py-32 bg-bg">
  <div class="max-w-7xl mx-auto px-5 lg:px-8">
    <div class="reveal text-center mb-16">
      <span class="inline-block text-accent text-sm font-semibold tracking-widest uppercase mb-3">Pricing</span>
      <h2 class="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">Simple, Transparent Pricing</h2>
      <p class="text-gray-500 mt-4 max-w-lg mx-auto">No hidden fees. No surprises. Just clear, upfront pricing.</p>
    </div>
    <div class="grid md:grid-cols-${pricing.length} gap-6 max-w-4xl mx-auto">${tiers}</div>
  </div>
</section>`;
}

/** Tailwind gallery section */
export function renderTwGallerySection(gallery: GalleryItem[] | undefined): string {
  if (!Array.isArray(gallery) || gallery.length === 0) return '';

  const items = gallery.map((item, i) =>
    `<div class="reveal group relative rounded-2xl overflow-hidden" style="--i:${i}">
      <img src="${escapeHtml(item.img)}" alt="${escapeHtml(item.alt ?? item.caption)}" class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
        <span class="text-white text-sm font-medium">${escapeHtml(item.caption)}</span>
      </div>
    </div>`
  ).join('');

  return `<section id="gallery" class="py-24 lg:py-32 bg-surface">
  <div class="max-w-7xl mx-auto px-5 lg:px-8">
    <div class="reveal text-center mb-16">
      <span class="inline-block text-accent text-sm font-semibold tracking-widest uppercase mb-3">Our Work</span>
      <h2 class="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">Gallery</h2>
    </div>
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">${items}</div>
  </div>
</section>`;
}

/** Tailwind standards/differentiators section — premium dark bento cards */
export function renderTwStandardsSection(differentiators: string[] | undefined): string {
  if (!Array.isArray(differentiators) || differentiators.length === 0) return '';

  const icons = [
    `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>`,
    `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>`,
    `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>`,
    `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>`,
  ];

  const items = differentiators.map((d, i) => {
    const num = String(i + 1).padStart(2, '0');
    const icon = icons[i % icons.length];
    return `<div class="sc reveal group" style="--i:${i}">
      <!-- top accent line: slides in from left on hover -->
      <div class="sc-line"></div>
      <!-- watermark number -->
      <span class="sc-num" aria-hidden="true">${num}</span>
      <!-- icon -->
      <div class="sc-icon-wrap">
        <div class="sc-icon">${icon}</div>
        <span class="sc-dot" aria-hidden="true"></span>
      </div>
      <!-- body text -->
      <p class="sc-text">${escapeHtml(d)}</p>
      <!-- arrow -->
      <div class="sc-arrow-wrap" aria-hidden="true">
        <svg class="sc-arrow" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
      </div>
    </div>`;
  }).join('');

  return `<section id="standards" class="relative py-16 sm:py-24 lg:py-32 overflow-hidden" style="background:var(--c-primary)">

  <!-- dot-grid texture -->
  <div class="absolute inset-0" style="background-image:radial-gradient(circle,rgba(255,255,255,0.035) 1px,transparent 1px);background-size:28px 28px;" aria-hidden="true"></div>

  <!-- centre glow -->
  <div class="absolute inset-0 pointer-events-none flex items-center justify-center" aria-hidden="true">
    <div style="width:660px;height:460px;border-radius:50%;filter:blur(110px);opacity:0.09;background:var(--c-accent);"></div>
  </div>

  <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    <!-- section header -->
    <div class="reveal mb-10 sm:mb-14 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
      <div>
        <div class="inline-flex items-center gap-2.5 mb-4">
          <span style="display:inline-block;width:20px;height:1px;background:var(--c-accent);"></span>
          <span style="color:var(--c-accent);font-size:0.7rem;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;">Why Choose Us</span>
        </div>
        <h2 class="font-display text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">Our Standards</h2>
      </div>
      <p class="text-white/30 text-sm max-w-xs leading-relaxed sm:text-right hidden sm:block">Every promise we make is backed by our commitment to quality workmanship.</p>
    </div>

    <!-- cards -->
    <div class="sc-grid">${items}</div>
  </div>

  <style>
    /* ── Standards card system ─────────────────── */
    .sc-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
    }
    @media (min-width: 640px)  { .sc-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (min-width: 1024px) { .sc-grid { grid-template-columns: repeat(3, 1fr); } }

    /* Card base */
    .sc {
      position: relative;
      overflow: hidden;
      border-radius: 16px;
      border: 1px solid rgba(255,255,255,0.07);
      background: rgba(255,255,255,0.04);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      padding: 28px;
      display: flex;
      flex-direction: column;
      gap: 18px;
      cursor: default;
      /* Single unified transition — everything moves together */
      transition:
        transform      500ms cubic-bezier(.25,.46,.45,.94),
        box-shadow     500ms cubic-bezier(.25,.46,.45,.94),
        border-color   500ms ease,
        background     500ms ease;
      will-change: transform;
    }
    @media (hover: hover) {
      .sc:hover {
        transform: translateY(-6px);
        border-color: rgba(var(--c-accent-rgb), 0.28);
        background: rgba(255,255,255,0.06);
        box-shadow:
          0 24px 64px rgba(0,0,0,0.32),
          0 0 0 1px rgba(var(--c-accent-rgb), 0.14),
          0 0 40px rgba(var(--c-accent-rgb), 0.06);
      }
    }

    /* Top accent line — slides in from left */
    .sc-line {
      position: absolute;
      top: 0; left: 0;
      height: 2px;
      width: 0%;
      background: linear-gradient(90deg, var(--c-accent) 0%, rgba(var(--c-accent-rgb), 0.25) 100%);
      transition: width 550ms cubic-bezier(.25,.46,.45,.94);
    }
    @media (hover: hover) {
      .sc:hover .sc-line { width: 100%; }
    }

    /* Watermark number */
    .sc-num {
      position: absolute;
      bottom: -8px; right: 4px;
      font-family: 'Space Grotesk', sans-serif;
      font-weight: 900;
      font-size: 88px;
      line-height: 1;
      color: rgba(255,255,255,0.038);
      user-select: none;
      pointer-events: none;
      transition: color 500ms ease;
    }
    @media (hover: hover) {
      .sc:hover .sc-num { color: rgba(255,255,255,0.065); }
    }

    /* Icon wrapper */
    .sc-icon-wrap { position: relative; width: fit-content; }

    .sc-icon {
      width: 40px; height: 40px;
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      color: var(--c-accent);
      border: 1px solid rgba(var(--c-accent-rgb), 0.22);
      background: rgba(var(--c-accent-rgb), 0.08);
      transition:
        background  450ms ease,
        border-color 450ms ease,
        transform   450ms cubic-bezier(.34,1.56,.64,1);
    }
    @media (hover: hover) {
      .sc:hover .sc-icon {
        background: rgba(var(--c-accent-rgb), 0.18);
        border-color: rgba(var(--c-accent-rgb), 0.5);
        transform: scale(1.06);
      }
    }

    /* Dot — fades + scales in (no ping) */
    .sc-dot {
      position: absolute;
      top: -3px; right: -3px;
      width: 8px; height: 8px;
      border-radius: 50%;
      background: var(--c-accent);
      opacity: 0;
      transform: scale(0.4);
      transition: opacity 350ms ease, transform 350ms cubic-bezier(.34,1.56,.64,1);
    }
    @media (hover: hover) {
      .sc:hover .sc-dot { opacity: 1; transform: scale(1); }
    }

    /* Body text */
    .sc-text {
      position: relative;
      font-size: 0.875rem;
      line-height: 1.8;
      color: rgba(255,255,255,0.5);
      transition: color 450ms ease;
      flex: 1;
    }
    @media (hover: hover) {
      .sc:hover .sc-text { color: rgba(255,255,255,0.82); }
    }

    /* Arrow */
    .sc-arrow-wrap { display: flex; justify-content: flex-end; margin-top: auto; }
    .sc-arrow {
      width: 15px; height: 15px;
      color: rgba(255,255,255,0.12);
      transition:
        color     400ms ease,
        transform 400ms cubic-bezier(.25,.46,.45,.94);
    }
    @media (hover: hover) {
      .sc:hover .sc-arrow {
        color: var(--c-accent);
        transform: translate(3px, -3px);
      }
    }
  </style>
</section>`;
}

/** Tailwind trust marquee — duplicated for seamless loop */
export function renderTwTrustMarquee(trustProof: string[]): string {
  const items = trustProof.map(item =>
    `<span class="inline-flex items-center gap-2 text-white/70 text-sm font-medium whitespace-nowrap"><span class="w-1.5 h-1.5 rounded-full bg-accent"></span>${escapeHtml(item)}</span>`
  ).join('');
  return items + items; // duplicate for seamless marquee
}

/** Tailwind social icons */
function renderTwSocialIcons(config: ClientSiteConfig): string {
  const s = config.social ?? {};
  const icons: Array<{ url: string; label: string; svg: string }> = [];

  if (s.facebook) icons.push({ url: s.facebook, label: 'Facebook',
    svg: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>` });
  if (s.instagram) icons.push({ url: s.instagram, label: 'Instagram',
    svg: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>` });
  if (s.linkedin) icons.push({ url: s.linkedin, label: 'LinkedIn',
    svg: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>` });
  if (s.google) icons.push({ url: s.google, label: 'Google',
    svg: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>` });

  if (icons.length === 0) return '';
  return icons.map(i =>
    `<a href="${escapeHtml(i.url)}" class="w-9 h-9 rounded-full bg-white/10 text-white/60 hover:bg-accent hover:text-white flex items-center justify-center transition-all" aria-label="${i.label}" rel="noopener noreferrer" target="_blank">${i.svg}</a>`
  ).join('');
}

/** Render social media icon links — only outputs icons where a URL is provided. */
function renderSocialIcons(config: ClientSiteConfig): string {
  const s = config.social ?? {};
  const icons: Array<{ url: string; label: string; svg: string }> = [];

  if (s.facebook) icons.push({ url: s.facebook, label: 'Facebook',
    svg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>` });

  if (s.instagram) icons.push({ url: s.instagram, label: 'Instagram',
    svg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>` });

  if (s.linkedin) icons.push({ url: s.linkedin, label: 'LinkedIn',
    svg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>` });

  if (s.google) icons.push({ url: s.google, label: 'Google Reviews',
    svg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>` });

  if (icons.length === 0) return '';
  return icons
    .map(i => `<a href="${escapeHtml(i.url)}" class="footer-social-icon" aria-label="${i.label}" rel="noopener noreferrer" target="_blank">${i.svg}</a>`)
    .join('');
}

/** Decompose a 6-digit hex color to "R, G, B" for use in rgba() CSS vars. */
function hexToRgb(hex: string): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

export function renderTemplate(template: string, config: ClientSiteConfig, styles: string): string {
  const theme = config.theme_colors;
  const pr = hexToRgb(theme.primary);
  const sr = hexToRgb(theme.secondary);
  const ar = hexToRgb(theme.accent);

  // Full theme override — MUST come last to win the CSS cascade
  const themeOverride = [
    ':root {',
    `  --color-primary:       ${theme.primary};`,
    `  --color-secondary:     ${theme.secondary};`,
    `  --color-accent:        ${theme.accent};`,
    `  --color-accent-bright: ${theme.accent};`,
    `  --color-bg:            ${theme.background};`,
    `  --color-text:          ${theme.text};`,
    `  --color-surface:       ${theme.surface};`,
    `  --color-primary-rgb:   ${pr};`,
    `  --color-secondary-rgb: ${sr};`,
    `  --color-accent-rgb:    ${ar};`,
    `  --color-border:        rgba(${pr}, 0.13);`,
    `  --glow-gold:           rgba(${ar}, 0.32);`,
    `  --glow-blue:           rgba(${sr}, 0.38);`,
    `  --sh-gold:    0 12px 36px rgba(${ar}, .38);`,
    `  --sh-gold-lg: 0 22px 56px rgba(${ar}, .52);`,
    `  --sh-blue:    0 16px 48px rgba(${pr}, .24);`,
    // Bridge Webflow alias vars to theme values
    `  --primary-dark:  ${theme.primary};`,
    `  --secondary:     ${theme.secondary};`,
    `  --primary-color: ${theme.accent};`,
    '}',
  ].join('\n');

  const metadata = config.metadata ?? {};

  const trustProof =
    Array.isArray(config.trust_proof) && config.trust_proof.length > 0
      ? config.trust_proof
      : config.reviews.slice(0, 4).map((r) => r.name + ' — 5★');

  const bannerImg =
    config.images?.banner ??
    'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1920&q=85&auto=format';

  const values: Record<string, string> = {
    locale:        metadata.locale ?? 'en-GB',
    title:         metadata.title ?? `${config.business_name} | ${config.niche} in ${config.city}`,
    description:   metadata.description ?? config.about_text,
    styles:        styles + '\n' + themeOverride,
    logo_path:     config.logo_path,
    business_name: config.business_name,
    niche:         config.niche,
    niche_lower:   config.niche.toLowerCase(),
    city:          config.city,
    domain:        config.domain,
    headline:      config.headline,
    subheadline:   config.subheadline,
    about_text:    config.about_text,
    about_headline:
      `${config.business_name} — ${config.city}'s trusted ${config.niche.toLowerCase()} specialists.`,
    service_area_text:
      config.service_area_text ?? `${config.niche} coverage across ${config.city} and surrounding areas.`,
    differentiators:
      Array.isArray(config.differentiators) && config.differentiators.length > 0
        ? `<ul>${config.differentiators.map((d) => `<li>${escapeHtml(d)}</li>`).join('')}</ul>`
        : '',

    // Image URLs
    banner_img_url:  bannerImg,
    about_img_large:
      config.images?.about_main ??
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=900&q=85&auto=format',
    about_img_small:
      config.images?.about_side ??
      'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&q=85&auto=format',
    form_bg_url:    config.images?.form_bg ?? bannerImg,
    footer_bg_url:  config.images?.footer_bg ?? bannerImg,

    // Form service dropdown — one <option> per service in the JSON
    form_services: (config.services || [])
      .map(s => `<option value="${escapeHtml(s.title)}">${escapeHtml(s.title)}</option>`)
      .join('\n'),

    // Social icons (only renders icons where a URL exists)
    social_icons: renderSocialIcons(config),

    // Rendered sections
    services:         renderItems(config.services),
    reviews:          renderReviews(config.reviews),
    faq:              renderFaq(config.faqs, bannerImg),
    gallery_section:  renderGallerySection(config.gallery),
    pricing_section:  renderPricingSection(config.pricing, config.cta_url),
    standards_section: renderStandardsSection(config.differentiators),

    // Nav items
    pricing_nav_item: Array.isArray(config.pricing) && config.pricing.length > 0
      ? '<li><a href="#pricing" class="nav-link">Pricing</a></li>'
      : '',
    standards_nav_item: Array.isArray(config.differentiators) && config.differentiators.length > 0
      ? '<li><a href="#standards" class="nav-link">Standards</a></li>'
      : '',

    // CTAs
    cta_text:      config.cta_text,
    cta_url:       config.cta_url,
    hero_cta_text: config.hero_cta_text ?? config.cta_text,
    hero_cta_url:  config.hero_cta_url ?? config.cta_url,
    cta_headline:  `${config.niche} in ${config.city} — Done Right`,
    cta_body:
      `Contact ${config.business_name} today. ` +
      (config.service_area_text ?? `Serving ${config.city} and surrounding areas.`),

    // Trust
    trustHeadline: `${config.business_name} is trusted in ${config.city} for ${config.niche.toLowerCase()}.`,
    trustItems:    trustProof
      .map((item) => `<span class="proof-item">${escapeHtml(item)}</span>`)
      .join(''),

    // Contact
    year:          String(new Date().getFullYear()),
    phone:         config.phone,
    phone_tel:     config.phone.replace(/\s/g, ''),   // spaces stripped for tel: URIs
    og_image:      bannerImg,
    email:         config.email,
    opening_hours: metadata.opening_hours ?? 'Mon–Fri 08:00–18:00; Sat 09:00–14:00',
    address:       metadata.address ?? `${config.city} service area`,

    // Legacy (clean template compat)
    jobs_count:    config.jobs_count ?? '500+',
    jobs_text:     config.jobs_text ?? `Jobs completed in ${config.city}`,
    banner_overlay: '',

    // ── Tailwind template variables ──────────────────────────
    color_primary:    theme.primary,
    color_secondary:  theme.secondary,
    color_accent:     theme.accent,
    color_background: theme.background,
    color_text:       theme.text,
    color_surface:    theme.surface,
    color_accent_rgb: ar,

    tw_services:      renderTwServices(config.services, config.images as Record<string, string> | undefined),
    tw_reviews:       renderTwReviews(config.reviews),
    tw_faqs:          renderTwFaqs(config.faqs),
    tw_pricing_section:  renderTwPricingSection(config.pricing, config.cta_url),
    tw_gallery_section:  renderTwGallerySection(config.gallery),
    tw_standards_section: renderTwStandardsSection(config.differentiators),
    tw_trust_marquee: renderTwTrustMarquee(trustProof),
    tw_social_icons:  renderTwSocialIcons(config),

    // Tailwind nav items (desktop)
    tw_pricing_nav: Array.isArray(config.pricing) && config.pricing.length > 0
      ? '<a href="#pricing" class="nav-link text-sm font-medium text-gray-500 hover:text-primary transition-colors">Pricing</a>'
      : '',
    tw_standards_nav: Array.isArray(config.differentiators) && config.differentiators.length > 0
      ? '<a href="#standards" class="nav-link text-sm font-medium text-gray-500 hover:text-primary transition-colors">Standards</a>'
      : '',

    // Tailwind nav items (mobile drawer)
    tw_pricing_nav_drawer: Array.isArray(config.pricing) && config.pricing.length > 0
      ? '<a href="#pricing" class="drawer-link">Pricing <svg class="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg></a>'
      : '',
    tw_standards_nav_drawer: Array.isArray(config.differentiators) && config.differentiators.length > 0
      ? '<a href="#standards" class="drawer-link">Standards <svg class="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg></a>'
      : '',

    // Tailwind footer items
    tw_pricing_footer: Array.isArray(config.pricing) && config.pricing.length > 0
      ? '<a href="#pricing" class="text-white/50 text-sm hover:text-white transition-colors">Pricing</a>'
      : '',
    tw_standards_footer: Array.isArray(config.differentiators) && config.differentiators.length > 0
      ? '<a href="#standards" class="text-white/50 text-sm hover:text-white transition-colors">Our Standards</a>'
      : '',
  };

  return Object.entries(values).reduce((result, [key, value]) => {
    return result.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }, template);
}
