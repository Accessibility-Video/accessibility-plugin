import { Media } from "./media";
import { IPlayer } from "./i-player";
import { A11y } from "@scribit/shared/types";

export interface PlayerFactory {
    create(player: Media.Player): IPlayer & A11y.Toggle;
}

/**
 *
 */
export function getImplementedMediaPlayerInstances<U extends PlayerFactory>(
    element: Element,
    factory: U,
    players: Media.Player[]
) {
    const instances = [];

    for (let i = 0; i < players.length; i++) {
        if (!hasPlayerInElement(element, players[i])) continue;

        const instance = factory.create(players[i]);
        if (!instance) continue;

        instances.push(instance);
    }

    return instances;
}

/**
 *
 */
function isJW(element: Element): boolean {
    const window = element.ownerDocument.defaultView;
    const player = window?.jwplayer;

    return player !== undefined;
}

/**
 *
 */
function isME(element: Element): boolean {
    const window = element.ownerDocument.defaultView;
    const player = window?.mejs;

    return player !== undefined;
}

/**
 *
 */
function isVJS(element: Element): boolean {
    const window = element.ownerDocument.defaultView;
    const player = window?.videojs;

    return typeof player?.getPlayer === "function";
}

/**
 *
 */
function isSPW(element: Element): boolean {
    const window = element.ownerDocument.defaultView;
    const hasBar = window?.scribit?.widget?.hasBar;

    return typeof hasBar === "function";
}

/**
 *
 */
const playerDetectionMap: { [key in Media.Player]?: (element: Element) => boolean } = {
    [Media.Framework.JW]: isJW,
    [Media.Framework.ME]: isME,
    [Media.Framework.SPW]: isSPW,
    [Media.Framework.VJS]: isVJS
};

/**
 *
 */
function hasPlayerInElement(element: Element, player: Media.Player): boolean {
    const detectionCallback = playerDetectionMap[player];
    if (detectionCallback) {
        try {
            return detectionCallback(element);
        } catch (error) {
            // Todo: implement front-end logging
            console.log(error, player);
        }
    }

    return false;
}
