import { A11y } from "@scribit/shared/types";
import { IPlayer, Media, PlayerFactory } from "@scribit/shared/utils";
import { JWPlayer, MediaElementJS, VideoJS, ScribitProWidget } from "./players";

type FactoryResult = IPlayer & A11y.Toggle;

const checkPlayerIsFramework = (player: Media.Player): player is Media.Framework =>
    Object.values(Media.Framework).includes(player as Media.Framework);

/**
 *
 */
export class FrameworkFactory implements PlayerFactory {
    public static readonly instanceMap = {
        [Media.Framework.JW]: new JWPlayer(),
        [Media.Framework.ME]: new MediaElementJS(),
        [Media.Framework.SPW]: new ScribitProWidget(),
        [Media.Framework.VJS]: new VideoJS()
    };

    protected static instances: { [key in Media.Framework]?: FactoryResult } = {};

    private static instance: FrameworkFactory;

    /**
     *
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
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
    public create(player: Media.Player) {
        if (!checkPlayerIsFramework(player)) {
            throw new Error(`Player ${player} is not a framework`);
        }
        const instances = FrameworkFactory.instances;
        if (!instances[player] && FrameworkFactory.instanceMap[player]) {
            instances[player] = FrameworkFactory.instanceMap[player];
        }

        return instances[player] as FactoryResult;
    }
}
