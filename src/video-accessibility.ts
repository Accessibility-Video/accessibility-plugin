import { A11yHandler, EventType, MessageType, PlayerFactory, MessageEvent } from '@scribit/feature/browser-extension';
import { getImplementedMediaPlayerInstances } from '@scribit/shared/utils';
import { Observable } from 'rxjs';
import { share, tap } from 'rxjs/operators';

class VideoAccessibilityHandler extends A11yHandler {
    constructor(watcher: Observable<MessageEvent>) {
        watcher = watcher.pipe(tap(event => {
            if (!this.preferences || event.messageType === MessageType.UpdatedTab) {
                return this.scan();
            }
        }))
        super(watcher);

        const event = document.createEvent('Event');
        event.initEvent(EventType.Initialized);
        document.dispatchEvent(event);
    }

    public scan(element: Element = document.body) {
        this.toggleInstances = [];
        const factory = PlayerFactory.getInstance();
        getImplementedMediaPlayerInstances(element, factory).forEach((instance) => {
            instance.scan(element);
            if(instance.hasPlayers) {
                this.toggleInstances.push(instance);
            }
        });
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
    }).pipe(share());
    window.scribit.extension = new VideoAccessibilityHandler(watcher);
}

declare global {
    interface Window {
        scribit: {
            extension: VideoAccessibilityHandler;
        };
    }
}

