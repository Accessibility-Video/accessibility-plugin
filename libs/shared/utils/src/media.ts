import { Document } from './document';

/**
 * A namespace that contains all (multi)media related types.
 */

export namespace Media {
    /**
     * List of supported web-based (multi)media players.
     */
    export type Player = Framework | Platform

    /**
     *
     */
    export enum Framework {
        JW = 'JW Player',
        ME = 'MediaElement.js',
        VJS = 'Video.js',
    }

    /**
     * List of supported (multi)media platforms.
     */
    export enum Platform {
        Vimeo = 'Vimeo',
        YT = 'Youtube',
    }

    type Loader = {
        [key in Platform]: {
            loading?: boolean;
            readonly onReady: Function[];
            readonly getScript: () => string | undefined;
        };
    }

    const PlatformLoader: Loader = {
        [Platform.Vimeo]: {
            onReady: [],
            getScript: function() {
                return window.Vimeo ? undefined : 'player.vimeo.com/api/player.js';
            },
        },
        [Platform.YT]: {
            onReady: [],
            getScript: function() {
                return window.YT?.loading ? undefined : 'www.youtube.com/iframe_api';
            },
        },
    };

    /**
     *
     */
    export const platformMatchers: { [key in Media.Platform]: RegExp } = {
        [Media.Platform.Vimeo]: /player.vimeo.com\/video\/(\d+)/,
        [Media.Platform.YT]: /(?:www\.)?youtube(?:-nocookie)?\.com\/embed\/([a-zA-Z0-9\-_]+)/,
    };

    /**
     *
     */
    export function loadPlatformScript(platform: Platform, callback: Function): void {
        if (platform === Platform.YT && !window.YT?.loaded) {
            const innerCallback = callback;
            callback = () => window.YT.ready(() => innerCallback());
        }

        const scriptUrl = PlatformLoader[platform].getScript();
        if (scriptUrl) {
            if (!PlatformLoader[platform].loading) {
                const tag = document.createElement('script');
                tag.async = true;
                tag.src = 'https://' + scriptUrl;
                tag.onload = () => PlatformLoader[platform].onReady.forEach(cb => cb());
                Document.append(tag);
            }

            PlatformLoader[platform].loading = true;
            PlatformLoader[platform].onReady.push(callback);
        } else {
            callback();
        }
    }
}
