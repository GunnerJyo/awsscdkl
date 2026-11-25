import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

// Static rendering and fixture tests share the project's shadcn import alias
// without starting the development server or its HTTP middleware.
export function createSsrModules() {
  return createServer({
    configFile: false,
    appType: 'custom',
    esbuild: { jsx: 'automatic' },
    resolve: { alias: { '@': fileURLToPath(new URL('../src', import.meta.url)) } },
    optimizeDeps: { noDiscovery: true },
    server: { middlewareMode: true, hmr: false, ws: false, watch: null },
    logLevel: 'error',
  })
}
