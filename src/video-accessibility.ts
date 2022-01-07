import {
    EventType,
    MediaPlayerHandler,
    MessageEvent,
    Scribit
} from "@scribit/feature/browser-extension";
import { Media } from "@scribit/shared/utils";
import { Observable } from "rxjs";

export class VideoAccessibilityHandler extends MediaPlayerHandler {
    constructor(watcher: Observable<MessageEvent>) {
        super(watcher, Object.values(Media.Framework));
        const event = new Event(EventType.Initialized);
        // Dispatch event after watcher is subscribed in super constructor
        setTimeout(() => document.dispatchEvent(event));
    }
}

if (!window.scribit) {
    window.scribit = {};
}

if (!window.scribit.extension) {
    const watcher = new Observable<MessageEvent>((observer) => {
        const handleListener = (event: Event) =>
            observer.next((event as CustomEvent<MessageEvent>).detail);
        document.addEventListener(EventType.Changed, handleListener, false);

        return () => document.removeEventListener(EventType.Changed, handleListener);
    });
    window.scribit.extension = new VideoAccessibilityHandler(watcher);
}

declare global {
    interface Window {
        scribit?: {
            extension?: VideoAccessibilityHandler;
            widget?: Scribit.Widget;
        };
    }
}
