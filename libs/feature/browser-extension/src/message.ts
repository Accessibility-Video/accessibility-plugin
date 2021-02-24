import { browser, Runtime } from 'webextension-polyfill-ts';

export interface ToBeDefinedInterface {
    [key: string]: any;
}

export namespace Message {
    export enum Type {
        UpdatedTab,
        RequestTabPlayers,
        UpdateTabPlayers,
    }

    interface ValueMap {
        [Type.UpdatedTab]: void;
        [Type.RequestTabPlayers]: ToBeDefinedInterface[];
        [Type.UpdateTabPlayers]: ToBeDefinedInterface[];
    }

    export function addListener<T extends keyof ValueMap>(callback: (message: T, sender: Runtime.MessageSender) => Promise<ValueMap[T]> | void): void {
        return browser.runtime.onMessage.addListener(callback);
    }

    export function send<T extends keyof ValueMap>(message: T): Promise<ValueMap[T]> {
        return browser.runtime.sendMessage(message);
    }
}


