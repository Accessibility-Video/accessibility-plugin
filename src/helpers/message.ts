import { MessageType } from '@scribit/feature/browser-extension';
import { Implements } from '@scribit/shared/types';
import { browser, Runtime } from 'webextension-polyfill-ts';

export namespace Message {
    interface ValueMap extends Implements<Record<MessageType, any>, ValueMap> {
        [MessageType.UpdatedTab]: void;
        [MessageType.RequestTabPlayers]: { [key: string]: any; }[];
        [MessageType.UpdateTabPlayers]: { [key: string]: any; }[];
        [MessageType.UpdatedUserPreferences] : void
    }

    /**
     *
     */
    export function addListener<T extends MessageType>(callback: (message: T, sender: Runtime.MessageSender) => Promise<ValueMap[T]> | void): void {
        return browser.runtime.onMessage.addListener(callback);
    }

    /**
     *
     */
    export function send<T extends MessageType>(message: T): Promise<ValueMap[T]> {
        return browser.runtime.sendMessage(message);
    }
}
