import { MessageType, UserPreferences } from '@scribit/feature/browser-extension';
import { A11y, Implements } from '@scribit/shared/types';
import { storage } from 'webextension-polyfill';
import { Message } from './message';

export namespace Storage {
    export enum Key {
        Heartbeat = '318E0E47',
        UserPreference = '1B9D4A6F'
    }

    interface ValueMap extends Implements<Record<Key, any>, ValueMap> {
        [Key.Heartbeat]: string | undefined;
        [Key.UserPreference]: UserPreferences;
    }

    export async function get<T extends Key>(key: T): Promise<ValueMap[T]> {
        let value: any;
        try {
            const values = await storage.local.get(key);
            value = values[key];
        } catch (error) {
            console.warn(error);
        }

        switch (key) {
            case Key.UserPreference:
                return <ValueMap[T]>mapUserPreferences(value);
        }

        return value;
    }

    export function set<T extends Key>(key: T, value: ValueMap[T]): Promise<void> {
        const onSuccesCallbacks: Array<(key: T, value: any) => void> = [];
        switch (key) {
            case Key.UserPreference:
                value = <ValueMap[T]>filterUserPreferences(<UserPreferences>value);
                onSuccesCallbacks.push(function() {
                    Message.send(MessageType.UpdatedUserPreferences).catch(console.warn);
                });
                break;
        }

        return storage.local.set({ [key]: value }).then(() => {
            onSuccesCallbacks.forEach(cb => cb(key, value));
        });
    }
}

/**
 *
 */
function filterUserPreferences(preferences: UserPreferences): Partial<UserPreferences> {
    const keys = Object.keys(preferences) as Array<keyof UserPreferences>;
    for (const key of keys) {
        if (!preferences[key]) {
            delete preferences[key];
        }
    }

    return preferences;
}

/**
 *
 */
export function mapUserPreferences(preferences?: Partial<UserPreferences>, defaultsTo: boolean = false): UserPreferences {
    const keys = Object.keys(A11y.Feature) as Array<keyof UserPreferences>;
    const defaultUserPreferences = <UserPreferences>keys.reduce<Partial<UserPreferences>>((preferences, feature) => {
        preferences[feature] = defaultsTo;
        return preferences;
    }, {});

    return { ...defaultUserPreferences, ...preferences };
}
