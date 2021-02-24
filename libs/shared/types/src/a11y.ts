/**
 * A namespace that contains all accessibility related types.
 */
export namespace A11y {
    /**
     * List of supported accessibility features.
     */
    export enum Feature {
        AD = 'audio description',
        CC = 'closed captioning',
        SL = 'sign language',
        TA = 'text alternative',
    }

    /**
     * A interface for toggling a accessibility feature.
     */
    export interface Toggler {
        /**
         * A method which enables a specific accessibility feature.
         */
        enable<T = void>(feature: Feature): Promise<T>

        /**
         * A method which disables a specific accessibility feature.
         */
        disable<T = void>(feature: Feature): Promise<T>
    }
}
