import { EventType, MediaPlayerHandler, MessageEvent, MessageType } from '@scribit/feature/browser-extension';
import { Document, Media } from '@scribit/shared/utils';
import { Observable } from 'rxjs';
import { startWith, tap } from 'rxjs/operators';
import { browser } from 'webextension-polyfill-ts';
import { Storage, Watcher } from './helpers';

class VideoAccessibilityHandler extends MediaPlayerHandler {
    public constructor(watcher: Observable<MessageEvent>) {
        super(watcher, Object.values(Media.Platform));
    }
}

function onChange(detail: MessageEvent): boolean {
    let payload = { detail }
    // clones object in order to read the event detail in non-privileged (injected) code.
    // https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent#firing_from_privileged_code_to_non-privileged_code
    if (typeof cloneInto === 'function') {
        payload = cloneInto(payload, document.defaultView!);
    }
    return document.dispatchEvent(new CustomEvent(EventType.Changed, payload));
}

Promise.all([Storage.get(Storage.Key.UserPreference), Document.ready]).then(([preferences]) => {
    const messageType = MessageType.UpdatedUserPreferences;
    const messageEvent: MessageEvent = { messageType, preferences };
    document.addEventListener(EventType.Initialized, () => onChange(messageEvent));

    // Inject script
    const filePath = browser.runtime.getURL('video-accessibility.js');
    const script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', filePath);
    script.async = true;
    Document.append(script, 'body');

    const observable = Watcher.observable.pipe(tap(onChange), startWith(messageEvent));
    new VideoAccessibilityHandler(observable);
});

declare global {
    function cloneInto<T>(obj: T, targetScope: Window): T
}
