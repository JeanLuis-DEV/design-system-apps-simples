import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Necessário para a entrada CSS independente da API TypeScript.
    cssCodeSplit: true,
    lib: {
      entry: {
        index: 'src/index.ts',
        style: 'src/styles/index.css',
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
      cssFileName: 'style',
    },
    rolldownOptions: {
      // Inclui subpaths como react/jsx-runtime e react-dom/client.
      external: /^react(?:-dom)?(?:\/|$)/,
    },
  },
})
