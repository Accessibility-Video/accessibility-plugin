import { A11y } from '@scribit/shared/types';
import { Observable } from 'rxjs';
import { MessageEvent, MessageType, UserPreferences } from './@types';

export abstract class A11yHandler implements A11y.Toggle {
    protected toggleInstances: A11y.Toggle[] = [];
    protected preferences?: UserPreferences;

    /**
     *
     */
    protected constructor(watcher: Observable<MessageEvent>) {
        watcher = this.transformWatcher(watcher);
        setTimeout(() => watcher.subscribe(event => {
            let disables = false;
            if (event.messageType === MessageType.UpdatedUserPreferences) {
                this.preferences = (event as MessageEvent<MessageType.UpdatedUserPreferences>).preferences;
                disables = true;
            }
            if (this.preferences) {
                const keys = Object.keys(this.preferences) as Array<keyof UserPreferences>;
                const handler = function(promise: Promise<any>) {
                    promise.catch(error => console.warn('', error));
                };

                for (const key of keys) {
                    const feature = A11y.Feature[key];
                    if (this.preferences[key]) {
                        handler(this.enable(feature));
                    } else if (disables) {
                        handler(this.disable(feature));
                    }
                }
            }
        }));
    }

    /**
     *
     */
    public disable(feature: A11y.Feature): Promise<any> {
        const promises = this.toggleInstances.map(instance => instance.disable(feature));

        return Promise.all(promises);
    }

    /**
     *
     */
    public enable(feature: A11y.Feature): Promise<any> {
        const promises = this.toggleInstances.map(instance => instance.enable(feature));

        return Promise.all(promises);
    }

    /**
     *
     */
    protected transformWatcher(watcher: Observable<MessageEvent>): Observable<MessageEvent> {
        return watcher;
    }
}
