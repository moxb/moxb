import { SubStateKeyGenerator } from './SubStateKeyGenerator';
import { SubStateInContext } from './StateSpace';

export class SubStateKeyGeneratorImpl implements SubStateKeyGenerator {
    public getKey(state: SubStateInContext) {
        const { key, root, subStates, parentPathTokens } = state;
        if (parentPathTokens === undefined) {
            console.log('oops');
        }
        const parents = parentPathTokens.join('.') + (parentPathTokens.length ? '.' : '');
        const current = !!subStates ? 'group_' + key : root ? '_root_' : key;
        return parents + current;
    }
}
