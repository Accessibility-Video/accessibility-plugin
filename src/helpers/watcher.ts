import { MessageEvent, MessageType } from "@scribit/feature/browser-extension";
import { Observable, share, Subscriber } from "rxjs";
import { Message } from "./message";
import { Storage } from "./storage";

const handleListener =
    (subscriber: Subscriber<MessageEvent>) => async (messageType: MessageType) => {
        switch (messageType) {
            case MessageType.UpdatedUserPreferences:
            case MessageType.UpdatedTab:
                subscriber.next({
                    messageType,
                    preferences: await Storage.get(Storage.Key.UserPreference)
                });
                break;
        }
    };

export class Watcher {
    public static get observable(): Observable<MessageEvent> {
        return new Observable<MessageEvent>((subscriber) => {
            const listener = handleListener(subscriber);
            Message.addListener(listener);

            return () => Message.removeListener(listener);
        }).pipe(share());
    }
}
