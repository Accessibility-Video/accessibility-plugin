import { MessageType, MessageEvent } from '@scribit/feature/browser-extension';
import { Observable, Subject } from 'rxjs';
import { finalize, share, tap } from 'rxjs/operators';
import { browser } from 'webextension-polyfill-ts';
import { Message } from './message';
import { Storage } from './storage';

/**
 *
 */
export class Watcher {
    private static readonly subject = new Subject<MessageEvent>();

    /**
     *
     */
    public static get observable(): Observable<MessageEvent> {
        return Watcher.subject.asObservable().pipe(
            share(),
            tap(() => {
                if (Watcher.subject.observers.length === 1) {
                    Message.addListener(Watcher.handleListener);
                }
            }),
            finalize(() => {
                if (!Watcher.subject.observers.length) {
                    browser.runtime.onMessage.removeListener(Watcher.handleListener);
                }
            }),
        );
    }

    /**
     *
     */
    private static handleListener(messageType: MessageType) {
        switch (messageType) {
            case MessageType.UpdatedUserPreferences:
                Storage.get(Storage.Key.UserPreference).then(preferences => Watcher.subject.next({
                    messageType,
                    preferences,
                }));
                break;
            case MessageType.UpdatedTab:
                Watcher.subject.next({ messageType });
                break;
        }
    }
}
