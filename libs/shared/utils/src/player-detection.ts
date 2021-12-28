import { Media } from './media';

type PlayerFactoryMap<T = any> = { [key in Media.Player]?: T };

export interface PlayerFactory<M extends PlayerFactoryMap<R>, R = any> {
    create<P extends Media.Player>(player: P): M[P]
}

/**
 *
 */
export function getImplementedMediaPlayerInstances<T extends PlayerFactory<PlayerFactoryMap>>(element: Element, factory: T, players: Media.Player[]): ReturnType<T['create']>[] {
    const instances: ReturnType<T['create']>[] = [];

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
    const window: any = element.ownerDocument.defaultView;

    return typeof window['jwplayer'] === 'function';
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

    return player && typeof player.getPlayer === 'function';
}

/**
 *
 */
function isSPW(element: Element): boolean {
    const window = element.ownerDocument.defaultView;
    const hasBar = window?.scribit?.widget?.hasBar;

    return typeof hasBar === 'function';
}

/**
 *
 */
const playerDetectionMap: { [key in Media.Player]?: (element: Element) => boolean } = {
    [Media.Framework.JW]: isJW,
    [Media.Framework.ME]: isME,
    [Media.Framework.SPW]: isSPW,
    [Media.Framework.VJS]: isVJS,
};

/**
 *
 */
function hasPlayerInElement(element: Element, player: Media.Player): boolean {
    const detectionCallback = playerDetectionMap[player];
    if(detectionCallback) {
        try {
            return detectionCallback(element);
        } catch (error) {
            // Todo: implement front-end logging
            console.log(error, player);
        }
    }

    return false;
}
