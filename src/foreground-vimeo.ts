import { BasePlayer } from "@scribit/feature/browser-extension";
import { Options, Player } from "@vimeo/player";
import { A11yHandler } from "./helpers/a11y-handler";

class Vimeo extends BasePlayer {
    /**
     *
     */
    private get player(): Element {
        let player: Element | null;
        if (location.host.startsWith("player.")) {
            player = document.getElementById("player");
        } else {
            player = document.getElementById("main")!.querySelector(".player");
        }

        if (!player) {
            throw new Error("Could not get Vimeo player element");
        }

        return player;
    }

    /**
     * @inheritDoc
     */
    protected toggleClosedCaptioning(enabled: boolean): void {
        const toggleButton = this.player.querySelector<HTMLButtonElement>("button.toggle.cc");
        if (!toggleButton || toggleButton.classList.contains("on") === enabled) {
            return;
        }

        toggleButton.click();
        const menu = toggleButton.nextElementSibling;
        if (menu?.getAttribute("role") === "menu") {
            menu.querySelector("li")?.click();
            menu.querySelector("button")?.click();
        }
    }
}

new A11yHandler(new Vimeo());

declare global {
    interface Window {
        Vimeo: {
            Player: new (
                element: HTMLIFrameElement | HTMLElement | string,
                options?: Options
            ) => Player;
        };
    }
}
