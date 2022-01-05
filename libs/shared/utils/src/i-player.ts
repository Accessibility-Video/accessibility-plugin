export interface IPlayer {
    get hasPlayers(): boolean;
    scan(element: Element): void;
}
