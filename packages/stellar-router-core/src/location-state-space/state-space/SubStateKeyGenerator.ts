import { SubState } from './StateSpace';

/**
 * The task of the sub-state key generator is to generate unique keys for sub-states,
 * which can be used in menus.
 *
 * This is an implementation detail, applications shouldn't worry about this.
 */
export interface SubStateKeyGenerator {
    getKey: (parentPathTokens: string[], state: SubState<any, any, any>) => string;
}
