import { Media, PlayerFactory as Factory } from '@scribit/shared/utils';
import { A11y } from '@scribit/shared/types';
import { BasePlayer, JWPlayer, MediaElement, VideoJs, Vimeo, Youtube } from '../players';

type FactoryMap = typeof PlayerFactory.instanceMap;
type FactoryResult = BasePlayer & A11y.Toggler

/**
 *
 */
export class PlayerFactory implements Factory<FactoryMap> {
    public static readonly instanceMap: Readonly<{[key in Media.Player]: any }> = {
        [Media.Framework.JW]: JWPlayer,
        [Media.Framework.ME]: MediaElement,
        [Media.Framework.VJS]: VideoJs,

        [Media.Platform.Vimeo]: Vimeo,
        [Media.Platform.YT]: Youtube,
    }

    private static instance: PlayerFactory;

    /**
     *
     */
    private constructor() {}

    /**
     *
     */
    public static getInstance(): PlayerFactory {
        if (!PlayerFactory.instance) {
            PlayerFactory.instance = new PlayerFactory();
        }

        return PlayerFactory.instance;
    }

    /**
     *
     */
    create(player: Media.Player): FactoryResult {
        return new PlayerFactory.instanceMap[player];
    }
}
