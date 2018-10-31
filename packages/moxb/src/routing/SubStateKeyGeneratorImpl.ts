import { SubStateKeyGenerator } from './SubStateKeyGenerator';
import { SubState } from './StateSpace';

export class SubStateKeyGeneratorImpl implements SubStateKeyGenerator {
    public getKey(parentPathTokens: string[], subState: SubState) {
        const { key, root, subStates } = subState;
        const parents = parentPathTokens.join('.') + (parentPathTokens.length ? '.' : '');
        const current = !!subStates ? 'group_' + key : root ? '_root_' : key;
        return parents + current;
    }
}
