import videoAccessibility from './video-accessibility?script&module'
import {
    EventType,
    MediaPlayerHandler,
    MessageEvent,
    MessageType
} from "@scribit/feature/browser-extension";
import { Document } from "@scribit/shared/frontend-utils";
import { Observable } from "rxjs";
import { startWith, tap } from "rxjs/operators";
import { runtime } from "webextension-polyfill";
import { Storage, Watcher } from "./helpers";
import { Media } from "@scribit/shared/utils";

class VideoAccessibilityHandler extends MediaPlayerHandler {
    public constructor(watcher: Observable<MessageEvent>) {
        super(watcher, Object.values(Media.Platform));
    }
}

function onChange(detail: MessageEvent): boolean {
    let payload = { detail };
    // clones object in order to read the event detail in non-privileged (injected) code.
    // https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent#firing_from_privileged_code_to_non-privileged_code
    if (typeof cloneInto === "function") {
        payload = cloneInto(payload, document.defaultView as Window);
    }
    return document.dispatchEvent(new CustomEvent(EventType.Changed, payload));
}

Promise.all([Storage.get(Storage.Key.UserPreference), Document.ready]).then(([preferences]) => {
    const messageType = MessageType.UpdatedUserPreferences;
    const messageEvent: MessageEvent = { messageType, preferences };
    document.addEventListener(EventType.Initialized, () => onChange(messageEvent));

    // Inject script
    const filePath = runtime.getURL(videoAccessibility);
    const script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", filePath);
    script.type = "module";
    script.async = true;
    Document.append(script, "body");

    const observable = Watcher.observable.pipe(tap(onChange), startWith(messageEvent));
    new VideoAccessibilityHandler(observable);
});

declare global {
    function cloneInto<T>(obj: T, targetScope: Window): T;
}
