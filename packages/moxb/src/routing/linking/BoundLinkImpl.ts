import { computed } from 'mobx';
import { BoundLink } from './BoundLink';
import { ArgChange } from '../url-arg';
import { StringOrFunction } from '../../bind/BindImpl';
import { t } from '../../i18n/i18n';

export interface BoundLinkOptions {
    id: string;
    label?: StringOrFunction;
    invisible?(): boolean;

    /**
     * Functions to get the target of the link.
     * See CoreLinkProps for detailed explanation.
     */
    to?(): string[] | undefined;
    argChanges?(): ArgChange<any>[];
    position?(): number | undefined;
    removeTokenCount?(): number | undefined;
    appendTokens?(): string[] | undefined;
}

/**
 * This object implements the background component that is able to provide
 * the data required to display a link.
 */
export class BoundLinkImpl implements BoundLink {
    readonly id: string;

    constructor(protected readonly impl: BoundLinkOptions) {
        this.id = impl.id;
    }

    @computed
    get label() {
        return typeof this.impl.label === 'function' ? this.impl.label()! : t(this.id + '.label', this.impl.label!);
    }

    @computed
    get to() {
        if (this.impl.to) {
            return this.impl.to();
        }
        return undefined;
    }

    @computed
    get appendTokens() {
        if (this.impl.appendTokens) {
            return this.impl.appendTokens();
        }
        return undefined;
    }

    @computed
    get argChanges() {
        if (this.impl.argChanges) {
            return this.impl.argChanges();
        }
        return [];
    }

    @computed
    get position() {
        if (this.impl.position) {
            return this.impl.position();
        }
        return undefined;
    }

    @computed
    get removeTokenCount() {
        if (this.impl.removeTokenCount) {
            return this.impl.removeTokenCount();
        }
        return undefined;
    }

    @computed
    get invisible() {
        if (this.impl.invisible) {
            return this.impl.invisible();
        }
        return false;
    }
}
