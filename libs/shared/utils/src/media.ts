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
        SPW = 'Scribit Pro widget',
    }

    /**
     * List of supported (multi)media platforms.
     */
    export enum Platform {
        Vimeo = 'Vimeo',
        YT = 'Youtube',
    }
}
