import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        svelte(),
        tsconfigPaths(),
        crx({ manifest })
    ]
})
