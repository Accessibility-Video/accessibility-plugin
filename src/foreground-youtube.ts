import { BasePlayer } from '@scribit/feature/browser-extension';
import { A11yHandler } from './helpers';

class Youtube extends BasePlayer {
    /**
     *
     */
    private get container(): Element {
        let container: Element | null;
        if (location.pathname.startsWith('/embed/')) {
            container = document.getElementById('player');
        } else {
            container = document.body.querySelector('#container.ytd-player');
        }

        if (!container) {
            throw new Error('Could not get Youtube player element');
        }

        return container;
    }

    /**
     * @inheritDoc
     */
    protected toggleClosedCaptioning(enabled: boolean): void {
        const toggleButton = this.container.querySelector<HTMLButtonElement>('button.ytp-subtitles-button');
        if (toggleButton) {
            const currentState = toggleButton.getAttribute('aria-pressed');
            if (currentState === null) {
                // when the attribute isn't set on the CC button, we assume that the
                // button isn't initialized yet. Therefore we add a observer which
                // will detect style changes since we know that after initialization
                // the button will become visible.
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach(() => {
                        if (toggleButton.offsetWidth > 0 && toggleButton.offsetHeight > 0) {
                            observer.disconnect();
                            this.toggleClosedCaptioning(enabled);
                        }
                    });
                });
                return observer.observe(toggleButton, {
                    attributes: true,
                    attributeFilter: ['style'],
                });
            }
            if (currentState !== enabled.toString()) {
                toggleButton.click();
            }
        }
    }
}

new A11yHandler(new Youtube());

declare global {
    interface Window {
        YT: {
            ready: (callback: Function) => void;
            loading: 0 | 1;
            loaded: 0 | 1;
        }
    }
}
