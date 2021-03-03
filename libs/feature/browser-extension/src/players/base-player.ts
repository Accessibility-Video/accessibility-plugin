import { A11y } from '@scribit/shared/types';

type A11yToggleReturnType = ReturnType<A11y.Toggle['enable'] & A11y.Toggle['disable']>;
type A11yFeatureReturnType = boolean | void | A11yToggleReturnType

function NotImplementedError(feature: keyof typeof A11y.Feature, enabled: boolean): string {
    const action = enabled ? 'enable' : 'disable';

    return `Could not ${action} '${A11y.Feature[feature]}'`;
}

export abstract class BasePlayer {
    protected readonly toggles: { [key in A11y.Feature]: (enabled: boolean) => A11yFeatureReturnType } = {
        [A11y.Feature.AD]: this.toggleAudioDescription,
        [A11y.Feature.CC]: this.toggleClosedCaptioning,
        [A11y.Feature.TA]: this.toggleTextAlternative,
        [A11y.Feature.SL]: this.toggleSignLanguage,
    };

    protected readonly ready?: Promise<void>;

    /**
     *
     */
    public enable(feature: A11y.Feature): ReturnType<A11y.Toggle['enable']> {
        return this.adjustA11yFeature(feature, true);
    }

    /**
     *
     */
    public disable(feature: A11y.Feature): ReturnType<A11y.Toggle['disable']> {
        return this.adjustA11yFeature(feature, false);
    }


    /**
     *
     */
    protected toggleAudioDescription(enabled: boolean): A11yFeatureReturnType {
        throw NotImplementedError('AD', enabled);
    }

    /**
     *
     */
    protected toggleClosedCaptioning(enabled: boolean): A11yFeatureReturnType {
        throw NotImplementedError('CC', enabled);
    }

    /**
     *
     */
    protected toggleSignLanguage(enabled: boolean): A11yFeatureReturnType {
        throw NotImplementedError('SL', enabled);
    }

    /**
     *
     */
    protected toggleTextAlternative(enabled: boolean): A11yFeatureReturnType {
        throw NotImplementedError('TA', enabled);
    }


    /**
     *
     */
    private async adjustA11yFeature(feature: A11y.Feature, enabled: boolean): A11yToggleReturnType {
        if (this.ready) {
            await this.ready;
        }
        try {
            return this.toggles[feature].call(this, enabled);
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
