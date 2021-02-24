export namespace Form {
    export interface ChangeEvent<T extends EventTarget = HTMLFormElement> extends Event {
        target: T;
    }
}
