import { FrameworkPlayer } from "./framework-player";
import { IPlayer } from "@scribit/shared/utils";
import { A11y } from "@scribit/shared/types";

export class ScribitProWidget extends FrameworkPlayer<Scribit.Bar> implements IPlayer, A11y.Toggle {
    /**
     * returns a array of objects, each object is a reference
     * to a VideoJS player instance.
     */
    protected getScanResults(): Scribit.Bar[] {
        return window.scribit.widget?.bars || [];
    }
    /**
     * @inheritDoc
     */
    protected toggleAudioDescription(enabled: boolean): void {
        this.adjustFeature("AD", enabled);
    }

    /**
     * @inheritDoc
     */
    protected toggleTextAlternative(enabled: boolean): void {
        this.adjustFeature("TA", enabled);
    }

    /**
     *
     */
    private adjustFeature(feature: keyof typeof ScribitA11yFeature, enabled: boolean): void {
        for (const bar of this.players) {
            if (!bar.buttons[feature]) {
                continue;
            }
            const toggle = bar.buttons[feature];

            const state = toggle.getAttribute("aria-pressed");
            if (!state) continue;

            const expanded = state === "true";
            if (enabled !== expanded) {
                toggle.dispatchEvent(new Event("mousedown"));
                toggle.click();
            }
        }
    }
}

enum ScribitA11yFeature {
    AD = "audio description",
    TA = "text alternative"
}

type ScribitA11yButtons = Record<keyof typeof ScribitA11yFeature, HTMLButtonElement>;

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Scribit {
    export interface Bar {
        buttons: ScribitA11yButtons;
        audioElement: HTMLAudioElement;
    }

    export interface Widget {
        bars: Bar[];
        hasBar: () => boolean;

        [key: string]: unknown;
    }
}
