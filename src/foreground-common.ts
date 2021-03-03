import { EventType, MessageType, MessageEvent } from '@scribit/feature/browser-extension';
import { Document } from '@scribit/shared/utils';
import { browser } from 'webextension-polyfill-ts';
import { Storage, Watcher } from './helpers';

function onChange(detail: MessageEvent): void {
    document.dispatchEvent(new CustomEvent(EventType.Changed, { detail }));
}

document.addEventListener(EventType.Initialized, function() {
    const messageType = MessageType.UpdatedUserPreferences;
    Storage.get(Storage.Key.UserPreference).then(preferences => onChange({ messageType, preferences }));
});

Document.ready.then(function() {
    // Inject script
    const filePath = browser.extension.getURL('video-accessibility.js');
    const script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', filePath);
    script.async = true;

    Document.append(script, 'body');
    Watcher.observable.subscribe(onChange);
});
