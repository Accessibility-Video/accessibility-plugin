import { A11y } from "@scribit/shared/types";
import { IPlayer, Media, PlayerFactory } from "@scribit/shared/utils";
import { JWPlayer, MediaElementJS, VideoJS, ScribitProWidget } from "./players";

type FactoryResult = IPlayer & A11y.Toggle;

const checkPlayerIsFramework = (player: Media.Player): player is Media.Framework =>
    Object.values(Media.Framework).includes(player as Media.Framework);

/**
 *
 */
export class FrameworkFactory implements PlayerFactory<FactoryResult> {
    public static readonly instanceMap = {
        [Media.Framework.JW]: JWPlayer,
        [Media.Framework.ME]: MediaElementJS,
        [Media.Framework.SPW]: ScribitProWidget,
        [Media.Framework.VJS]: VideoJS
    };

    protected static instances: { [key in Media.Player]?: FactoryResult } = {};

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
            instances[player] = new FrameworkFactory.instanceMap[player]();
        }

        return instances[player];
    }
}
