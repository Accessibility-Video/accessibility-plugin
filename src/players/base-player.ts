import { A11y } from '@scribit/shared/types';

export abstract class BasePlayer {
    enable<T = void>(feature: A11y.Feature): Promise<T> {
        console.log(feature);

        return Promise.reject(this.notImplemented())
    }

    disable<T = void>(): Promise<T> {
        return Promise.reject(this.notImplemented())
    }

    protected notImplemented(): void {
        throw new Error('Accessibility feature not implemented');
    }
}
