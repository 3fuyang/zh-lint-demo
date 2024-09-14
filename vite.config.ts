import { vitePlugin as remix } from '@remix-run/dev'
import { defineConfig } from 'vite'
import { installGlobals } from '@remix-run/node'
import { netlifyPlugin } from '@netlify/remix-adapter/plugin'
import tsconfigPaths from 'vite-tsconfig-paths'
import { visualizer } from "rollup-plugin-visualizer";

installGlobals()

export default defineConfig({
  plugins: [
    remix(),
    netlifyPlugin(),
    tsconfigPaths(),
    process.env.NODE_ENV === 'production' && visualizer({ emitFile: true }),
  ],
  resolve: {
    alias: {
      zhlint: 'zhlint/dist/zhlint.es.js',
    },
  },
  build: {
    cssMinify: 'lightningcss',
  },
})
