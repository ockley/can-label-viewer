import { defineConfig } from 'vite'

export default defineConfig({
    // Set base to '/' if using a custom domain, 
    // or '/repo-name/' if deploying to username.github.io/repo-name/
    base: '/can-label-viewer/',

    server: {
        host: true,
        open: true
    },

    build: {
        outDir: 'dist',
        emptyOutDir: true,
        sourcemap: true
    },

    // Ensure public directory is handled
    publicDir: 'public'
})
