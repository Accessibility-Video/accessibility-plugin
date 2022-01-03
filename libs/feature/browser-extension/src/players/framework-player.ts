import { BasePlayer } from "./base-player";

export abstract class FrameworkPlayer<T> extends BasePlayer {
    protected players: T[] = [];

    /**
     * Amount of players
     */
    public get hasPlayers(): boolean {
        return this.players.length > 0;
    }

    /*
     * Should detect player elements within the given element.
     */
    public scan(element: Element): void {
        this.players = this.getScanResults(element);
    }

    /**
     * Should return a array of the given type,
     * where each entry should represent a instance of the player.
     */
    protected abstract getScanResults(element: Element): T[];
}
