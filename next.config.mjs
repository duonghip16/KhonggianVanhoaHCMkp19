import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';
import { firebaseWebConfig } from './scripts/firebase-web-config.mjs';

const nextConfig = {
  // Keep metadata in the initial head for sharing tools and HTML-only crawlers.
  htmlLimitedBots: /.*/,
};
// Development and production must not overwrite each other's webpack chunks.
export default (phase) => ({
  ...nextConfig,
  // Firebase Web config is public. Keep login and APIs configured without .env.local.
  // Explicit deployment configuration still takes precedence.
  env: firebaseWebConfig(),
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next-dev' : '.next',
});
