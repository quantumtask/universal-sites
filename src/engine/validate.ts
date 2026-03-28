import { ClientSiteConfig } from '../types';

const nonEmpty = (value: unknown) => typeof value === 'string' && value.trim().length > 0;

export function validateClientConfig(config: ClientSiteConfig): string[] {
  const errors: string[] = [];

  const requiredStrings = [
    ['id', config.id],
    ['business_name', config.business_name],
    ['niche', config.niche],
    ['city', config.city],
    ['domain', config.domain],
    ['logo_path', config.logo_path],
    ['phone', config.phone],
    ['email', config.email],
    ['headline', config.headline],
    ['subheadline', config.subheadline],
    ['about_text', config.about_text],
    ['cta_text', config.cta_text],
    ['cta_url', config.cta_url],
  ];

  requiredStrings.forEach(([key, value]) => {
    if (!nonEmpty(value)) {
      errors.push(`Missing or invalid required field: ${key}`);
    }
  });

  if (!Array.isArray(config.services) || config.services.length === 0) {
    errors.push('services must be a non-empty array');
  }

  if (!Array.isArray(config.reviews) || config.reviews.length === 0) {
    errors.push('reviews must be a non-empty array');
  }

  if (!Array.isArray(config.faqs) || config.faqs.length === 0) {
    errors.push('faqs must be a non-empty array');
  }

  if (!config.theme_colors || !nonEmpty(config.theme_colors.primary) || !nonEmpty(config.theme_colors.secondary) || !nonEmpty(config.theme_colors.accent)) {
    errors.push('theme_colors must include primary, secondary, accent colors');
  } else {
    const hexRegex = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
    (['primary', 'secondary', 'accent', 'background', 'text', 'surface'] as const).forEach((color) => {
      const value = config.theme_colors[color];
      if (value && !hexRegex.test(value)) {
        errors.push(`theme_colors.${color} value is invalid: ${value}`);
      }
    });
  }

  return errors;
}
