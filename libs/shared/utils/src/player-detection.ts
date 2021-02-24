import { Media } from './media';

const notImplemented = (): undefined => {
    throw new Error('Detection method for player is not implemented');
};

type PlayerImplementation = 'NATIVE' | 'EMBEDDED';
type PlayerFactoryMap<T = any> = {[key in Media.Player]: T};

export interface PlayerFactory<M extends PlayerFactoryMap<R>, R = any> {
    create<P extends Media.Player>(player: P): M[P]
}

/**
 *
 */
export function createMediaPlayerInstances<T extends PlayerFactory<PlayerFactoryMap>>(factory: T): ReturnType<T['create']>[] {
    let players: Media.Player[] = Object.values(Media.Platform);
    const amountOfMediaPlatforms = players.length;
    const instances: ReturnType<T['create']>[] = [];

    players = players.concat(Object.values(Media.Framework));

    for(let i=0; i < players.length; i++) {
        const implementation = detectPlayerImplementation(players[i]);
        if(!implementation) continue;

        const instance = factory.create(players[i]);
        if(!instance) continue;

        instances.push(instance);

        // When the implementation of a platform is native, we can assume that
        // the user is on a website where just one video is played at a time.
        if(i < amountOfMediaPlatforms && implementation === 'NATIVE') break;
    }

    return instances;
}

/**
 *
 */
function isJW(): PlayerImplementation | undefined {
    return notImplemented();
}

/**
 *
 */
function isME(): PlayerImplementation | undefined {
    return notImplemented();
}

/**
 *
 */
function isVJS(): PlayerImplementation | undefined {
    return notImplemented();
}

/**
 *
 */
function isVimeo(): PlayerImplementation | undefined{
    if(window.location.host.indexOf('.vimeo.') > -1) {

        return 'NATIVE';
    }

    return hasEmbeddedIframe(Media.Platform.Vimeo).length ? 'EMBEDDED' : undefined;
}

/**
 *
 */
function isYT(): PlayerImplementation | undefined {
    if(window.location.host.indexOf('.youtube.') > -1) {
        const player = document.getElementsByTagName('ytd-app')[0].querySelector('#player');
        if(player) {
            console.log(player);
        }

        return 'NATIVE';
    }

    return hasEmbeddedIframe(Media.Platform.YT).length ? 'EMBEDDED' : undefined;
}

/**
 *
 */
const playerDetectionMap: {[key in Media.Player]: () => PlayerImplementation | undefined} = {
    [Media.Framework.JW]: isJW,
    [Media.Framework.ME]: isME,
    [Media.Framework.VJS]: isVJS,

    [Media.Platform.Vimeo]: isVimeo,
    [Media.Platform.YT]: isYT,
}

/**
 *
 */
function detectPlayerImplementation(player: Media.Player): PlayerImplementation | undefined {
    try {
        return playerDetectionMap[player]();
    } catch (error) {
        // Todo: implement front-end logging
        // console.warn(error, player)
        console.log(error.message, player);
    }
    return undefined;
}

/**
 *
 */
const platformMatchers: { [key in Media.Platform]: RegExp } = {
    [Media.Platform.Vimeo]: /player.vimeo.com\/video\/(\d+)/,
    [Media.Platform.YT]: /(?:www\.)?youtube(?:-nocookie)?\.com\/embed\/([a-zA-Z0-9\-_]+)/,
};

/**
 *
 */
function hasEmbeddedIframe(platform: Media.Platform, elm: Element = document.body): HTMLIFrameElement[] {
    return Array.from(elm.getElementsByTagName('iframe')).filter(el => {
        const src = el.getAttribute('src');

        return src && src.match(platformMatchers[platform]) !== null;
    });
}
