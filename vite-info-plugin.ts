import manifest from './manifest.json' with { type: "json" };

export default function buildInfoPlugin() {
    const print_break_line = () => console.log('─'.repeat(50));
    return {
        name: "build-info",
        configResolved(config) {
            print_break_line();
            console.log('🚀 Build Information:')
      console.log(`📦 App: ${manifest.name}`)
      console.log(`🏷️  Version: ${manifest.version}`)
      console.log(`🎯 Mode: ${config.mode || 'development'}`)
      
      // Afficher les features activées
      const features = Object.entries(config.env)
  .filter(([key]) => key.startsWith('VITE_FEATURES_'))
  .map(([key, value]) => {
    // retirer le préfixe
    const name = key.replace(/^VITE_FEATURES_/, '');

    // mettre en Title Case (FEATURE_XYZ -> Feature Xyz)
    const pretty = name
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());

      // With icons
      const icon = value === 'true' ? '✅' : '❌';

    return `  • ${pretty}: ${icon}`;
  })
  .join('\n');
      

      print_break_line();
      if (features) {
        console.log('⚡ Features:')
        console.log(features)
      }
      print_break_line();
        },
    }
}