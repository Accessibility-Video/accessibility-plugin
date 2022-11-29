import { ManifestV3Export } from "@crxjs/vite-plugin";

export const manifest: ManifestV3Export = {
    name: "accessibility.video",
    default_locale: "en",
    description: "__MSG_extensionDescription__",
    homepage_url: "https://accessibility.video",
    version: "1.3.0",
    manifest_version: 3,
    icons: {
        16: "src/icon-16x16.png",
        32: "src/icon-32x32.png",
        48: "src/icon-48x48.png",
        128: "src/icon-128x128.png"
    },
    background: {
        service_worker: "src/background.ts"
    },
    options_ui: {
        page: "src/pages/options.html"
    },
    permissions: ["storage", "tabs"],
    host_permissions: ["http://*/*", "https://*/*"],
    content_scripts: [
        {
            all_frames: true,
            exclude_matches: [
                "http://player.vimeo.com/static/*",
                "https://player.vimeo.com/static/*"
            ],
            matches: [
                "http://vimeo.com/*",
                "https://vimeo.com/*",
                "http://player.vimeo.com/*",
                "https://player.vimeo.com/*"
            ],
            js: ["src/foreground-vimeo.ts"]
        },
        {
            all_frames: true,
            matches: [
                "http://m.youtube.com/*",
                "https://m.youtube.com/*",
                "http://www.youtube.com/*",
                "https://www.youtube.com/*",
                "http://www.youtube-nocookie.com/*",
                "https://www.youtube-nocookie.com/*"
            ],
            js: ["src/foreground-youtube.ts"]
        },
        {
            all_frames: true,
            exclude_matches: [
                "http://vimeo.com/*",
                "https://vimeo.com/*",
                "http://player.vimeo.com/*",
                "https://player.vimeo.com/*",
                "http://m.youtube.com/*",
                "https://m.youtube.com/*",
                "http://www.youtube.com/*",
                "https://www.youtube.com/*",
                "http://www.youtube-nocookie.com/*",
                "https://www.youtube-nocookie.com/*",
                "https://plus.google.com/hangouts/*",
                "https://hangouts.google.com/*",
                "https://meet.google.com/*"
            ],
            matches: ["http://*/*", "https://*/*"],
            js: ["src/foreground-common.ts"]
        }
    ],
    web_accessible_resources: [
        {
            resources: [
                "src/assets/fonts/scribit-icons.svg",
                "src/assets/fonts/scribit-icons.ttf",
                "src/assets/fonts/scribit-icons.woff",
                "src/assets/images/logo.png",
                "src/assets/images/icon.svg",
                "src/assets/styles/variables.css"
            ],
            matches: ["<all_urls>"]
        }
    ]
};
