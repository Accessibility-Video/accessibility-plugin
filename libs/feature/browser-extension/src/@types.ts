import { A11y } from "@scribit/shared/types";

export type UserPreferences = Record<keyof typeof A11y.Feature, boolean>;

export enum MessageType {
    RequestTabPlayers,
    UpdateTabPlayers,
    UpdatedTab,
    UpdatedUserPreferences
}

interface MessageTypeMap {
    [MessageType.UpdatedUserPreferences]: {
        preferences: UserPreferences;
    };
}

type MessageTypeValue<T extends MessageType> = T extends keyof MessageTypeMap
    ? MessageTypeMap[T]
    : Record<string, unknown>;

export type MessageEvent<T extends MessageType = MessageType> = {
    messageType: T;
} & MessageTypeValue<T>;

export enum EventType {
    Initialized = "videoaccessibilityinitialized",
    Changed = "videoaccessibilitychanged"
}
