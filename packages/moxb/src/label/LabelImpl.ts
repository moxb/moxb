import { computed, makeObservable } from 'mobx';
import { t } from '..';
import { BindImpl, BindOptions, StringOrFunction } from '../bind/BindImpl';
import { Label } from './Label';

export interface LabelOptions extends BindOptions {
    /**
     * The text which should be displayed in the label
     */
    text?: StringOrFunction;

    /**
     * With this property you can show the raw input string without any escaping or parsing.
     */
    showRawText?: boolean;
}

export class LabelImpl extends BindImpl<LabelOptions> implements Label {
    constructor(impl: LabelOptions) {
        super(impl);
        makeObservable(this);
    }

    get showRawText() {
        if (this.impl.showRawText != null) {
            return this.impl.showRawText;
        }
        return undefined;
    }

    @computed
    get text() {
        return this.getText();
    }

    protected getText() {
        if (typeof this.impl.text === 'function') {
            return this.impl.text();
        }
        if (this.impl.text != null) {
            return t(this.id + '.text', this.impl.text);
        }
        return undefined;
    }
}
