import { A11y } from '@scribit/shared/types';
import { browser } from 'webextension-polyfill-ts';
import { UserPreferences } from './@types';

export namespace Storage {
    export enum Key {
        Heartbeat = '318E0E47',
        UserPreference = '1B9D4A6F'
    }

    interface ValueMap {
        [Key.Heartbeat]: string;
        [Key.UserPreference]: UserPreferences;
    }

    export async function get<T extends keyof ValueMap>(key: T): Promise<ValueMap[T] | undefined> {
        let value: any;
        try {
            const values = await browser.storage.local.get(key);
            value = values[key];
        } catch (error) {
            console.warn(error);
            return undefined;
        }

        switch (key) {
            case Key.UserPreference:
                return <ValueMap[T]>mapUserPreferences(value);
        }

        return value;
    }

    export function set<T extends keyof ValueMap>(key: T, value: ValueMap[T]): Promise<void> {
        switch (key) {
            case Key.UserPreference:
                value = <ValueMap[T]>filterUserPreferences(<UserPreferences>value);
        }
        return browser.storage.local.set({ [key]: value });
    }
}

function filterUserPreferences(preferences: UserPreferences): Partial<UserPreferences> {
    const keys = Object.keys(preferences) as Array<keyof UserPreferences>;
    for (const key of keys) {
        if (!preferences[key]) {
            delete preferences[key];
        }
    }

    return preferences;
}

function mapUserPreferences(preferences?: UserPreferences): UserPreferences {
    const defaultUserPreferences = <UserPreferences>Object.values(A11y.Feature).reduce<Partial<UserPreferences>>((preferences, feature) => {
        preferences[feature] = false;
        return preferences;
    }, {});

    return { ...defaultUserPreferences, ...preferences };
}
