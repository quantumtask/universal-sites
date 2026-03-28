export { generateAllSites, TemplateName } from './engine/generator';

if (require.main === module) {
  const args = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
  const selectedId = args[0];
  const all = process.argv.includes('--all');
  const templateFlag = process.argv.find(a => a.startsWith('--template='));
  const templateName = (templateFlag?.split('=')[1] ?? 'tailwind') as 'master' | 'tailwind';

  (async () => {
    try {
      const { generateAllSites } = await import('./engine/generator');
      const generated = await generateAllSites(all ? undefined : selectedId, templateName);
      console.log(`Generated ${generated.length} site(s) using "${templateName}" template:\n${generated.join('\n')}`);
    } catch (error) {
      console.error('Generation failed:', error);
      process.exit(1);
    }
  })();
}
