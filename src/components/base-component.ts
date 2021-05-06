import { LitElement } from 'lit';

export class BaseComponent extends LitElement {
    /**
     * @inheritDoc
     */
    protected createRenderRoot() {
        return this;
    }
}
