import { getImplementedMediaPlayerInstances, Media } from "@scribit/shared/utils";
import { debounceTime, Observable, tap } from "rxjs";
import { MessageEvent, MessageType } from "./@types";
import { A11yHandler } from "./a11y-handler";
import { FrameworkFactory } from "./framework-factory";

export abstract class MediaPlayerHandler extends A11yHandler {
    protected constructor(
        watcher: Observable<MessageEvent>,
        protected readonly players: Media.Player[]
    ) {
        super(watcher);
    }

    /**
     *
     */
    scan(element: Element = document.body) {
        this.toggleInstances = [];
        const factory = FrameworkFactory.getInstance();
        getImplementedMediaPlayerInstances(element, factory, this.players).forEach((instance) => {
            instance.scan(element);
            if (instance.hasPlayers) {
                this.toggleInstances.push(instance);
            }
        });
    }

    /**
     * @inheritDoc
     */
    protected transformWatcher(watcher: Observable<MessageEvent>): Observable<MessageEvent> {
        return watcher.pipe(
            debounceTime(0),
            tap((event) => {
                if (!this.preferences || event.messageType === MessageType.UpdatedTab) {
                    return this.scan();
                }
            })
        );
    }
}
