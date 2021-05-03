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
        playerLoop: for (let player of this.players) {
            for (let listItem of player.getCaptionsList()) {
                if ((enabled && listItem.id !== 'off') || (!enabled && listItem.id === 'off')) {
                    player.setCurrentCaptions(listItem.id);
                    continue playerLoop;
                }
            }
        }
    }
}
