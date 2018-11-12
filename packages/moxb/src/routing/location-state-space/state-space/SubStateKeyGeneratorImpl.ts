import { SubStateKeyGenerator } from './SubStateKeyGenerator';
import { SubState } from './StateSpace';

export class SubStateKeyGeneratorImpl implements SubStateKeyGenerator {
    public getKey(parentPathTokens: string[], state: SubState<any, any>) {
        const { key, root, subStates } = state;
        if (parentPathTokens === undefined) {
            console.log('oops');
        }
        const parents = parentPathTokens.join('.') + (parentPathTokens.length ? '.' : '');
        const current = !!subStates ? 'group_' + key : root ? '_root_' : key;
        return parents + current;
    }
}
