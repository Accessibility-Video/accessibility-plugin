import { A11y } from '@scribit/shared/types';
import { FrameworkPlayer } from './framework-player';

export class VideoJS extends FrameworkPlayer<any> implements A11y.Toggle {
    /**
     * @inheritDoc
     */
    protected getScanResults(): any[] {
        return [];
    }
}

declare global {
    interface Window {
        videojs: any;
    }
}
