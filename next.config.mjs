import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';
import { readFileSync } from 'node:fs';

const firebaseProject = JSON.parse(readFileSync(new URL('./.firebaserc', import.meta.url), 'utf8')).projects.default;

const nextConfig = {
  // Keep metadata in the initial head for sharing tools and HTML-only crawlers.
  htmlLimitedBots: /.*/,
};
// Development and production must not overwrite each other's webpack chunks.
export default (phase) => ({
  ...nextConfig,
  // The project ID is public. Keep server APIs configured on hosts without .env.local.
  // Explicit deployment configuration still takes precedence.
  env: {
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || firebaseProject,
  },
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next-dev' : '.next',
});
