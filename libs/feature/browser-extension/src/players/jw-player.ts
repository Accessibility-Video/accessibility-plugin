import { A11y } from '@scribit/shared/types';
import { FrameworkPlayer } from './framework-player';

export class JWPlayer extends FrameworkPlayer<any> implements A11y.Toggle {
    /**
     * @inheritDoc
     */
    protected getScanResults(): any[] {
        return [];
    }
}
