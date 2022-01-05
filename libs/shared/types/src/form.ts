// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Form {
    export interface ChangeEvent<T extends EventTarget = HTMLFormElement> extends Event {
        target: T;
    }
}
