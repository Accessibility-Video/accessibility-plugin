import { i18n } from "webextension-polyfill";

export function t(messageName: string): string {
    return i18n.getMessage(messageName);
}
