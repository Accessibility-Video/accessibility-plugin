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
    export interface Toggle {
        /**
         * A method which enables a specific accessibility feature.
         */
        enable(feature: Feature): Promise<boolean | void>

        /**
         * A method which disables a specific accessibility feature.
         */
        disable(feature: Feature): Promise<boolean | void>
    }
}
