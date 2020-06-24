import { Value } from '../value/Value';

export interface TreeNode {
    key: string;
    title: string;
    children?: TreeNode[];
}

export interface Tree extends Value<string[]> {
    readonly nodes: TreeNode[];
    readonly expandValues: boolean;
    readonly strictSelect: boolean;
}
