import { A11y } from '@scribit/shared/types';
import { FrameworkPlayer } from './framework-player';

export class MediaElementJS extends FrameworkPlayer<MeJS.Player> implements A11y.Toggle {
    /**
     * returns a array of objects, each object is a reference
     * to a MediaElement player instance.
     */
    protected getScanResults(): MeJS.Player[] {
        return Object.values(window.mejs.players);
    }

    /**
     * @inheritDoc
     */
    protected toggleAudioDescription(enabled: boolean): void {
        this.adjustFeature('audio-description', enabled);
    }
    /**
     * @inheritDoc
     */
    protected toggleClosedCaptioning(enabled: boolean): void {
        for (let player of this.players) {
            if (enabled && player.tracks && player.tracks.length) {
                player.loadTrack(0);
                player.setTrack(player.tracks[0].trackId);
            }
        }
    }

    /**
     * @inheritDoc
     */
    protected toggleSignLanguage(enabled: boolean): void {
        this.adjustFeature('video-description', enabled);
    }

    /**
     * @inheritDoc
     */
    protected toggleTextAlternative(enabled: boolean): void {
        for (let player of this.players) {
            const sibling: Element | null = player.container.nextElementSibling;
            if (!sibling || !sibling.classList.contains('transcript')) continue;

            const toggle = sibling.querySelector<HTMLElement>('[aria-expanded]');
            if (!toggle || !toggle.click || !toggle.getAttribute('id')) continue;

            const state = toggle.getAttribute('aria-expanded');
            if (!state) continue;

            const expanded = state === 'true';
            if (enabled !== expanded) {
                toggle.dispatchEvent(new Event('mousedown'));
                toggle.click();
            }
        }
    }

    /**
     *
     */
    private adjustFeature(feature: string, enabled: boolean): void {
        for (let player of this.players) {
            const position = player.featurePosition[feature];
            if (!position) continue;

            const control = player.controls.children[position];
            const button = control.getElementsByTagName('button')[0];
            if (!button) continue;

            const state = control.classList.contains(`${feature}-on`);
            if (enabled !== state) {
                button.dispatchEvent(new Event('mousedown'));
                button.click();
            }
        }
    }
}


namespace MeJS {
    export interface Player {
        container: HTMLDivElement;
        controls: HTMLDivElement;
        featurePosition: {
            [key: string]: number;
        }

        [key: string]: any;
    }

    export type Instance = {
        players: Player[];
    }
}

declare global {
    interface Window {
        mejs: MeJS.Instance;
    }
}
