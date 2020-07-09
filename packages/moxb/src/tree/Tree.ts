import { Value } from '../value/Value';

export interface TreeNode {
    key: string;
    title: string;
    children?: TreeNode[];
}

export interface Tree extends Value<string[]> {
    /**
     * The nodes available in the tree.
     */
    readonly nodes: TreeNode[];

    /**
     * The selected tree nodes are designated by the string[] value.
     */

    /**
     * Should the selected nodes be expanded, regardless of their depth?
     */
    readonly expandValues: boolean;

    /**
     * For the definition of strict mode, see here: https://ant.design/components/tree/
     */
    readonly strictSelect: boolean;
}
