import { A11y } from '@scribit/shared/types';
import { Media, PlayerFactory } from '@scribit/shared/utils';
import { FrameworkPlayer, JWPlayer, MediaElementJS, VideoJS } from './players';

type FactoryMap = typeof FrameworkFactory.instanceMap;
type FactoryResult = FrameworkPlayer<any> & A11y.Toggle

/**
 *
 */
export class FrameworkFactory implements PlayerFactory<FactoryMap> {
    public static readonly instanceMap: Readonly<{ [key in Media.Player]?: any }> = {
        [Media.Framework.JW]: JWPlayer,
        [Media.Framework.ME]: MediaElementJS,
        [Media.Framework.VJS]: VideoJS,
    };

    protected static instances: { [key in Media.Player]?: FactoryResult } = {};

    private static instance: FrameworkFactory;

    /**
     *
     */
    private constructor() {}

    /**
     *
     */
    public static getInstance(): FrameworkFactory {
        if (!FrameworkFactory.instance) {
            FrameworkFactory.instance = new FrameworkFactory();
        }

        return FrameworkFactory.instance;
    }

    /**
     *
     */
    public create(player: Media.Player): FactoryResult {
        const instances = FrameworkFactory.instances;
        if (!instances[player] && FrameworkFactory.instanceMap[player]) {
            instances[player] = new FrameworkFactory.instanceMap[player];
        }

        return instances[player]!;
    }
}
