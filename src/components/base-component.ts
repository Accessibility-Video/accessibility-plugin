import { LitElement } from 'lit-element';

export class BaseComponent extends LitElement {
    /**
     * @inheritDoc
     */
    protected createRenderRoot() {
        return this;
    }
}
