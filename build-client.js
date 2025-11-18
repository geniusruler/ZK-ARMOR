const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['public/js/wallet-connector.js', 'public/js/crypto-utils.js', 'public/js/app.js'],
  bundle: true,
  outdir: 'public/js/dist',
  format: 'esm',
  platform: 'browser',
  sourcemap: true,
  external: [], // Bundle everything
}).catch(() => process.exit(1));
