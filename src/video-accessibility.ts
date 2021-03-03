import { EventType, MediaPlayerHandler, MessageEvent } from '@scribit/feature/browser-extension';
import { Media } from '@scribit/shared/utils';
import { Observable } from 'rxjs';

class VideoAccessibilityHandler extends MediaPlayerHandler {
    constructor(watcher: Observable<MessageEvent>) {
        super(watcher, Object.values(Media.Framework));

        const event = document.createEvent('Event');
        event.initEvent(EventType.Initialized);
        // Dispatch event after watcher is subscribed in super constructor
        setTimeout(() => document.dispatchEvent(event));
    }
}

if (!window.scribit) {
    (<any>window).scribit = {};
}

if (!window.scribit.extension) {
    const watcher = new Observable<MessageEvent>(observer => {
        const handleListener = function(event: Event) {
            observer.next((event as CustomEvent<MessageEvent>).detail);
        };
        document.addEventListener(EventType.Changed, handleListener, false);

        return () => document.removeEventListener(EventType.Changed, handleListener);
    });
    window.scribit.extension = new VideoAccessibilityHandler(watcher);
}

declare global {
    interface Window {
        scribit: {
            extension: VideoAccessibilityHandler;
        };
    }
}

