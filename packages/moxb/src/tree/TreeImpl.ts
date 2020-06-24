import { Tree, TreeNode } from './Tree';
import { ValueOrFunction } from '../bind/BindImpl';
import { ValueImpl, ValueOptions } from '../value/ValueImpl';
import { computed } from 'mobx';

export interface TreeOptions extends ValueOptions<TreeImpl, string[]> {
    nodes?: ValueOrFunction<TreeNode[]>;
    expandValues?: ValueOrFunction<boolean>;
    strictSelect?: ValueOrFunction<boolean>;
}

export class TreeImpl extends ValueImpl<TreeImpl, string[], TreeOptions> implements Tree {
    constructor(impl: TreeOptions) {
        super(impl);
    }

    @computed
    get nodes(): TreeNode[] {
        if (typeof this.impl.nodes === 'function') {
            return this.impl.nodes() || [];
        } else {
            return this.impl.nodes || [];
        }
    }

    @computed
    get expandValues(): boolean {
        if (typeof this.impl.expandValues === 'function') {
            return this.impl.expandValues() || false;
        } else {
            return this.impl.expandValues || false;
        }
    }

    @computed
    get strictSelect(): boolean {
        if (typeof this.impl.strictSelect === 'function') {
            return this.impl.strictSelect() || false;
        } else {
            return this.impl.strictSelect || false;
        }
    }
}
