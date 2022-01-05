/**
 * A namespace that contains all accessibility related types.
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace A11y {
    /**
     * List of supported accessibility features.
     */
    export enum Feature {
        CC = "closed captioning",
        SL = "sign language",
        AD = "audio description",
        TA = "text alternative"
    }

    /**
     * A interface for toggling a accessibility feature.
     */
    export interface Toggle {
        /**
         * A method which enables a specific accessibility feature.
         */
        enable(feature: Feature): Promise<boolean | void>;

        /**
         * A method which disables a specific accessibility feature.
         */
        disable(feature: Feature): Promise<boolean | void>;
    }
}
