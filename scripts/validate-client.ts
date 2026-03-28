import { loadClientConfig } from '../src/data/client-data';
import { validateClientConfig } from '../src/engine/validate';

const slug = process.argv[2] || 'plumbify-london';

(async () => {
  try {
    const cfg = await loadClientConfig(`${slug}.json`);
    console.log('client:', cfg.id);
    const errors = validateClientConfig(cfg);
    if (errors.length === 0) {
      console.log('validation: OK');
    } else {
      console.error('validation errors:', errors);
    }
    console.log('theme colors', cfg.theme_colors);
    console.log('cta', cfg.cta_text, cfg.cta_url);
    console.log('hero cta', cfg.hero_cta_text ?? cfg.cta_text, cfg.hero_cta_url ?? cfg.cta_url);
    process.exit(errors.length === 0 ? 0 : 1);
  } catch (e) {
    console.error('error', e);
    process.exit(1);
  }
})();
