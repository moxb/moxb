import { Tree, TreeNode } from './Tree';
import { ValueOrFunction } from '../bind/BindImpl';
import { ValueImpl, ValueOptions } from '../value/ValueImpl';
import { computed } from 'mobx';

export interface TreeOptions extends ValueOptions<TreeImpl, string[]> {
    nodes?: ValueOrFunction<TreeNode[]>;
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
}
