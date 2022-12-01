import { computed, makeObservable } from 'mobx';
import { BoundLink } from './BoundLink';
import { ArgChange } from '../url-arg';
import { AnyDecision, notDecision, readDecision, readReason, t } from '@moxb/util';
import { StringOrFunction } from '@moxb/util';
import { NavRef, NavRefCall } from '../navigation-references';

export interface BoundLinkOptions {
    id: string;
    label?: StringOrFunction;

    help?: StringOrFunction;

    /**
     * When should this be hidden?
     */
    invisible?: () => AnyDecision;

    /**
     * When should this be disabled?
     *
     * Don't use this together with enabled.
     */
    disabled?: () => AnyDecision;

    /**
     * When should this be enabled?
     *
     * Don't use this together with disabled.
     */
    enabled?: () => AnyDecision;

    /**
     * Functions to get the target of the link.
     * See CoreLinkProps for detailed explanation.
     */
    to?(): string[] | undefined;

    argChanges?(): ArgChange<any>[];

    position?(): number | undefined;

    removeTokenCount?(): number | undefined;

    appendTokens?(): string[] | undefined;

    toRef?(): NavRef<void | Record<string, string>> | NavRefCall<any>;
}

/**
 * This object implements the background component that is able to provide
 * the data required to display a link.
 */
export class BoundLinkImpl implements BoundLink {
    readonly id: string;

    constructor(protected readonly impl: BoundLinkOptions) {
        makeObservable(this);
        this.id = impl.id;
    }

    @computed
    get label(): string {
        return typeof this.impl.label === 'function'
            ? this.impl.label() || ''
            : t(this.id + '.label', this.impl.label || '');
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
    get toRef() {
        if (this.impl.toRef) {
            return this.impl.toRef();
        }
        return undefined;
    }

    @computed
    get invisible() {
        if (this.impl.invisible) {
            return readDecision(this.impl.invisible());
        }
        return false;
    }

    @computed
    get disabled() {
        if (this.impl.disabled) {
            return this.impl.disabled();
        } else if (this.impl.enabled) {
            return notDecision(this.impl.enabled());
        }
        return false;
    }

    @computed
    get help() {
        const disabled = this.disabled;
        if (readDecision(disabled)) {
            const reason = readReason(disabled);
            if (reason) {
                return reason;
            }
        }
        if (this.impl.help) {
            return typeof this.impl.help === 'function' ? this.impl.help() : t(this.id + '.help', this.impl.help!);
        }
        return undefined;
    }
}
