import { UserPreferences } from '@scribit/feature/browser-extension';
import { A11y, Form } from '@scribit/shared/types';
import { html, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js'
import { camelCase } from 'lodash'
import { BaseComponent } from './base-component';
import { Storage, t } from '../helpers';

@customElement('scribit-extension-options')
export class Popup extends BaseComponent {
    private preferences!: UserPreferences;

    public connectedCallback() {
        super.connectedCallback();
    }

    protected async performUpdate() {
        this.preferences = await Storage.get(Storage.Key.UserPreference);
        super.performUpdate();
    }

    protected render() {
        return html`
            <div class="container centered">
                ${this.listPreferences(this.preferences)}
            </div>
        `;
    }

    private listPreferences(preferences?: UserPreferences): TemplateResult | undefined {
        if(!preferences) {
            return undefined;
        }

        const keys = Object.keys(preferences) as Array<keyof UserPreferences>;

        return html`
            <section>
                <header>
                    <h2>${t('accessibilityOptions')}</h2>
                </header>
                <div class="card">
                    ${keys.map(feat => this.listOption(feat, preferences[feat]))}
                </div>
            </section>
        `;
    }

    private listOption(feat: keyof typeof A11y.Feature, checked: boolean): TemplateResult {
        const preferenceKey = feat.toLowerCase();
        const translationKey = camelCase(A11y.Feature[feat]);

        return html`
            <div class="feature option row">
                <div class="scribit-icon ${preferenceKey}"></div>
                <div class="label-wrapper">
                    <div id="${preferenceKey}-label" class="label">${t(translationKey)}</div>
                    <div class="secondary label">${t(translationKey+'Explanation')}</div>
                </div>
                <div class="input">
                    <label class="switch">
                        <input type="checkbox" role="switch" name="${preferenceKey}" ?checked="${checked}"
                            @change="${this.updatePreference}" aria-labelledby="${preferenceKey}-label">
                        <span></span>
                    </label>
                </div>
            </div>`;
    }

    private updatePreference(event: Form.ChangeEvent<HTMLInputElement>) {
        const key = <keyof typeof A11y.Feature>event.target.getAttribute('name')!.toUpperCase();
        this.preferences[key] = event.target.checked;
        Storage.set(Storage.Key.UserPreference, this.preferences).catch(console.warn);
    }
}
