import { FrameworkPlayer } from "./framework-player";
import { IPlayer } from "@scribit/shared/utils";
import { A11y } from "@scribit/shared/types";

export class MediaElementJS extends FrameworkPlayer<MeJS.Player> implements IPlayer, A11y.Toggle {
    /**
     * returns an array of objects, each object is a reference
     * to a MediaElement player instance.
     */
    protected getScanResults(): MeJS.Player[] {
        return Object.values(window.mejs?.players || []);
    }

    /**
     * @inheritDoc
     */
    protected toggleAudioDescription(enabled: boolean): void {
        this.adjustFeature("audio-description", enabled);
    }

    /**
     * @inheritDoc
     */
    protected toggleClosedCaptioning(enabled: boolean): void {
        this.adjustCC(enabled);
    }

    /**
     * @inheritDoc
     */
    protected toggleSignLanguage(enabled: boolean): void {
        this.adjustFeature("video-description", enabled);
    }

    /**
     * @inheritDoc
     */
    protected toggleTextAlternative(enabled: boolean): void {
        for (const player of this.players) {
            const position = MediaElementJS.getFeaturePosition(player, "transcript");
            if (position) {
                this.adjustFeature("transcript", enabled);
                continue;
            }

            const sibling: Element | null = player.container.nextElementSibling;
            if (!sibling || !sibling.classList.contains("transcript")) continue;

            const toggle = sibling.querySelector<HTMLElement>("[aria-expanded]");
            if (!toggle || !toggle.click || !toggle.getAttribute("id")) continue;

            const state = toggle.getAttribute("aria-expanded");
            if (!state) continue;

            const expanded = state === "true";
            if (enabled !== expanded) {
                toggle.dispatchEvent(new Event("mousedown"));
                toggle.click();
            }
        }
    }

    private static getFeaturePosition(player: MeJS.Player, feature: string): number | undefined {
        return player.featurePosition[feature];
    }

    /**
     *
     */
    private adjustFeature(feature: string, enabled: boolean): void {
        for (const player of this.players) {
            const position = MediaElementJS.getFeaturePosition(player, feature);
            if (!position) continue;

            const control = player.controls.children[position];
            const button = control.getElementsByTagName("button")[0];
            if (!button) continue;

            const state = control.classList.contains(`${feature}-on`);
            if (enabled !== state) {
                button.dispatchEvent(new Event("mousedown"));
                button.click();
            }
        }
    }

    /**
     *
     */
    private adjustCC(enabled: boolean): void {
        const feature = "tracks";
        for (const player of this.players) {
            const position = MediaElementJS.getFeaturePosition(player, feature);
            if (!position) continue;

            const control = player.controls.children[position];
            const button = control.getElementsByTagName("button")[0];
            if (!button) continue;

            const state = control.classList.contains(`mejs__captions-enabled`);
            if (enabled !== state) {
                button.dispatchEvent(new Event("mousedown"));
                button.click();
            }
        }
    }

    /**
     *
     */
    private adjustCC(enabled: boolean): void {
        const feature = "tracks";
        for (const player of this.players) {
            const position = MediaElementJS.getFeaturePosition(player, feature);
            if (!position) continue;

            const control = player.controls.children[position];
            const button = control.getElementsByTagName("button")[0];
            if (!button) continue;

            const state = control.classList.contains(`mejs__captions-enabled`);
            if (enabled !== state) {
                button.dispatchEvent(new Event("mousedown"));
                button.click();
            }
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace MeJS {
    export interface Player {
        container: HTMLDivElement;
        controls: HTMLDivElement;
        featurePosition: {
            [key: string]: number;
        };

        [key: string]: unknown;
    }

    export type Instance = {
        players: Player[];
    };
}

declare global {
    interface Window {
        mejs?: MeJS.Instance;
    }
}
