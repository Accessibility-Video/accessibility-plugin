import { A11y } from '@scribit/shared/types';
import { FrameworkPlayer } from './framework-player';

export class JWPlayer extends FrameworkPlayer<jwplayer.JWPlayer> implements A11y.Toggle {
    /**
     * @inheritDoc
     */
    protected getScanResults(element: Element): jwplayer.JWPlayer[] {
        return Array.from(element.querySelectorAll('.jwplayer'))
            .map(container => jwplayer(container))
            .filter(player => player.getState());
    }

    /**
     * @inheritDoc
     */
    protected toggleClosedCaptioning(enabled: boolean): void {
        for (let player of this.players) {
            if (this.toggleCaptionsTrack(enabled, player) !== undefined) {
                return;
            }

            // If none of the player tracks is used for captions, we add a
            // listener which will listen until a captions text track is added.
            const handleCaptionsListEvent = () => {
                if (this.toggleCaptionsTrack(enabled, player) !== undefined) {
                    player.off('captionsList', handleCaptionsListEvent);
                }
            };
            player.on('captionsList', handleCaptionsListEvent);
        }
    }

    private toggleCaptionsTrack(enabled: boolean, player: jwplayer.JWPlayer): boolean | undefined {
        const captionsList = player.getCaptionsList();
        if (!captionsList.length) {
            return undefined;
        }

        for (let listItem of captionsList) {
            if ((enabled && listItem.id !== 'off') || (!enabled && listItem.id === 'off')) {
                player.setCurrentCaptions(listItem.id);
            }
        }

        return enabled;
    }
}
