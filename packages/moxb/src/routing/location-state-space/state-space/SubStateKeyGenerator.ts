/**
 * The task of the sub-state key generator is to generate unique keys for sub-states,
 * which can be used in menus.
 */
import { SubState } from './StateSpace';

export interface SubStateKeyGenerator {
    getKey: (parentPathTokens: string[], state: SubState<any, any, any>) => string;
}
