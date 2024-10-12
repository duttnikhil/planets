import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    base: '/planets/',  // Set the base path for GitHub Pages
    plugins: [vue()]    // Corrected syntax for the vue plugin
})
