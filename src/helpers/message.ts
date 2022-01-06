import { MessageType } from "@scribit/feature/browser-extension";
import { Implements } from "@scribit/shared/types";
import { Runtime, runtime, tabs } from "webextension-polyfill";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Message {
    interface ValueMap extends Implements<Record<MessageType, unknown>, ValueMap> {
        [MessageType.UpdatedTab]: void;
        [MessageType.RequestTabPlayers]: { [key: string]: unknown }[];
        [MessageType.UpdateTabPlayers]: { [key: string]: unknown }[];
        [MessageType.UpdatedUserPreferences]: void;
    }

    /**
     *
     */
    export function addListener<T extends MessageType>(
        callback: (message: T, sender: Runtime.MessageSender) => Promise<ValueMap[T]> | void
    ): void {
        return runtime.onMessage.addListener(callback);
    }

    export function removeListener<T extends MessageType>(
        callback: (message: T, sender: Runtime.MessageSender) => Promise<ValueMap[T]> | void
    ): void {
        return runtime.onMessage.removeListener(callback);
    }

    /**
     *
     */
    export async function send<T extends MessageType>(message: T): Promise<void> {
        const tabsResult = await tabs.query({});
        for (const tab of tabsResult) {
            if (tab.id && tab.url?.match(/https?:\/\//g)) {
                await tabs.sendMessage(tab.id, message).catch(console.warn);
            }
        }
    }
}
