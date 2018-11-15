import { SubStateKeyGenerator } from './SubStateKeyGenerator';
import { SubState } from './StateSpace';

export class SubStateKeyGeneratorImpl implements SubStateKeyGenerator {
    public getKey(parentPathTokens: string[], state: SubState<any, any, any>) {
        const { key, root, subStates } = state;
        const parents = parentPathTokens.join('.') + (parentPathTokens.length ? '.' : '');
        const current = !!subStates ? 'group_' + key : (key ? key : 'no-key') + '_' + (root ? 'root' : '');
        const result = parents + current;
        return result;
    }
}
