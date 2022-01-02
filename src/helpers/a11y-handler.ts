import { A11yHandler as BaseA11yHandler, MessageType } from "@scribit/feature/browser-extension";
import { A11y } from '@scribit/shared/types';
import { Document } from '@scribit/shared/frontend-utils';
import { from, merge } from "rxjs";
import { Storage } from './storage';
import { Watcher } from "./watcher";

const initializer = Promise.all([
    Storage.get(Storage.Key.UserPreference),
    Document.ready,
]).then(([preferences, _]) => ({
    messageType: MessageType.UpdatedUserPreferences,
    preferences,
}));

export class A11yHandler extends BaseA11yHandler {
    constructor(toggle: A11y.Toggle) {
        super(merge(Watcher.observable, from(initializer)));

        this.toggleInstances.push(toggle);
    }
}
