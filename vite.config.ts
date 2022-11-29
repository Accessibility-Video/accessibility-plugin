import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import webExtension from "vite-plugin-web-extension";
import * as path from "path";

export default defineConfig({
    root: "src",
    // Because we set the root, we need to configure the output directory
    build: {
        outDir: path.resolve(__dirname, "dist"),
        emptyOutDir: true
    },
    plugins: [
        svelte(),
        tsconfigPaths({
            root: path.resolve(__dirname)
        }),
        webExtension({
            browser: process.env.TARGET_BROWSER,
            manifest: path.resolve(__dirname, "src/manifest.json"),
            assets: "assets",
            additionalInputs: ["video-accessibility.ts"]
        })
    ]
});
