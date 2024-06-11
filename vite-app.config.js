import { defineConfig } from "vite"
import path from "path"

export default defineConfig({
  build: {
    emptyOutDir: false,
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'src/app.ts'),
      },
      output: {
				manualChunks: undefined,
        entryFileNames: "app.js",
			},
    },
    outDir: "./dist/",
  },
})
