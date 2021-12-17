import { Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { browser, Tabs } from 'webextension-polyfill-ts';
import { mapUserPreferences, Storage } from './helpers';

/**
 *
 */
browser.runtime.onInstalled.addListener(details => {
    if (details.reason === 'install') {
        const preferences = mapUserPreferences({}, true);
        Storage.set(Storage.Key.UserPreference, preferences)
            .catch(error => console.warn('could not set initial preferences', error));
    }

    sendHartBeat(true);
});

/**
 *
 */
function sendHartBeat(force: boolean = false): void {
    const shouldSend = force ? Promise.resolve() : Storage.get(Storage.Key.Heartbeat).then(value => {
        const oneWeekAgo = new Date(new Date().getTime() - (7 * 24 * 60 * 60 * 1000));

        if (!value || new Date(value) > oneWeekAgo) {
            return Promise.reject('time is within threshold');
        }
        return;
    });

    shouldSend.then(() => {
        const options = apiRequestOptions(setRequestData({
            id: browser.runtime.id,
        }));
        options.method = 'OPTIONS';
        return fetch('https://accessibility.video', options)
            .then(() => Storage.set(Storage.Key.Heartbeat, new Date().toISOString()));
    }).catch(err => console.warn('hart beat not send', err));

}

/**
 *
 */
function setRequestData(data: any): Pick<RequestInit, 'body' | 'headers'> {
    let body: RequestInit['body'];
    let headers: Headers = new Headers();

    switch (typeof data) {
        case 'object':
            headers.set('Content-Type', 'application/json');
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
        method: 'POST',
        headers: {},
        mode: 'cors',
    };

    return { ...defaultRequestOptions, ...options };
}

/**
 *
 */
new Observable<number>(observer => {
    const callback = function(tabId: number, changeInfo: Tabs.OnUpdatedChangeInfoType) {
        if (changeInfo?.status === 'complete') observer.next(tabId);
    };

    browser.tabs.onUpdated.addListener(callback);

    return () => browser.tabs.onUpdated.removeListener(callback);
}).pipe(debounceTime(1000)).subscribe(tabId => {
    browser.tabs.sendMessage(tabId, 'UpdatedTab').catch(err => console.warn(err));
});
