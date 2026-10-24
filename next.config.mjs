import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';

const nextConfig = {
  // Keep metadata in the initial head for sharing tools and HTML-only crawlers.
  htmlLimitedBots: /.*/,
};
// Development and production must not overwrite each other's webpack chunks.
export default (phase) => ({
  ...nextConfig,
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next-dev' : '.next',
});
