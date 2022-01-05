import { Observable, debounceTime } from "rxjs";
import { runtime, tabs, Tabs } from "webextension-polyfill";
import { Storage, mapUserPreferences } from "./helpers";
import { MessageType } from "@scribit/feature/browser-extension";

/**
 *
 */
runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") {
        const preferences = mapUserPreferences({}, true);
        Storage.set(Storage.Key.UserPreference, preferences).catch((error: unknown) =>
            console.warn("could not set initial preferences", error)
        );
    }

    sendHartBeat(true);
});

/**
 *
 */
function sendHartBeat(force = false): void {
    const shouldSend = force
        ? Promise.resolve()
        : Storage.get(Storage.Key.Heartbeat).then((value: string | undefined) => {
              const oneWeekAgo = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);

              if (!value || new Date(value) > oneWeekAgo) {
                  return Promise.reject("time is within threshold");
              }
              return;
          });

    shouldSend
        .then(() => {
            const options = apiRequestOptions(
                setRequestData({
                    id: runtime.id
                })
            );
            options.method = "OPTIONS";
            return fetch("https://accessibility.video", options).then(() =>
                Storage.set(Storage.Key.Heartbeat, new Date().toISOString())
            );
        })
        .catch((err: unknown) => console.warn("hart beat not send", err));
}

/**
 *
 */
function setRequestData(data: Record<string, unknown>): Pick<RequestInit, "body" | "headers"> {
    let body: RequestInit["body"];
    const headers: Headers = new Headers();

    switch (typeof data) {
        case "object":
            headers.set("Content-Type", "application/json");
            body = JSON.stringify(data);
            break;
    }

    return { body, headers };
}

/**
 *
 */
function apiRequestOptions(options?: Partial<RequestInit>): RequestInit {
    const defaultRequestOptions: RequestInit = {
        method: "POST",
        headers: {},
        mode: "cors"
    };

    return { ...defaultRequestOptions, ...options };
}

/**
 *
 */
new Observable<number>((subscriber) => {
    const callback = (tabId: number, changeInfo: Tabs.OnUpdatedChangeInfoType, tab: Tabs.Tab) =>
        changeInfo?.status === "complete" &&
        tab.url?.match(/https?:\/\//g) &&
        subscriber.next(tabId);

    tabs.onUpdated.addListener(callback);

    return () => tabs.onUpdated.removeListener(callback);
})
    .pipe(debounceTime(1000))
    .subscribe({
        next: async (tabId) =>
            tabs
                .sendMessage(tabId, MessageType.UpdatedTab)
                .catch((err: unknown) => console.warn(err))
    });
