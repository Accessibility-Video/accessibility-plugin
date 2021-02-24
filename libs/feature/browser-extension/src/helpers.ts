import { browser } from 'webextension-polyfill-ts';

export function t(messageName: string): string {
    return browser.i18n.getMessage(messageName);
}



