import { StateSpaceHandlerImpl } from '../StateSpaceHandlerImpl';
import { testStateSpace } from './TestStateSpace';

describe('State-Space Handler implementation', () => {
    const handler = new StateSpaceHandlerImpl({
        subStates: testStateSpace,
        filterCondition: state => !(state.data && state.data.secret), // in menus, we will hide the "secret" items
        id: 'test state space',
        // debug: true,
    });

    it('Should be able to find the root state', () => {
        expect(handler.findRoot().label).toBe('Root state');
    });

    it('When given no tokens, should return the root state', () => {
        expect(handler.findSubStateForTokens([], 0)!.label).toBe('Root state');
    });

    it('Should handle empty tokens as non-existent', () => {
        expect(handler.findSubStateForTokens([''], 0)!.label).toBe('Root state');
    });

    it('Should handle null tokens as non-existent', () => {
        expect(handler.findSubStateForTokens([null], 0)!.label).toBe('Root state');
    });

    it('When all tokens have been consumed, should return the root state', () => {
        expect(handler.findSubStateForTokens(['foo', 'bar'], 2)!.label).toBe('Root state');
    });

    it('should be able to find simple sub-states', () => {
        expect(handler.findSubStateForTokens(['foo'], 0)!.label).toBe('Foo');
    });

    it('should return null when asking for a non-existent sub-state', () => {
        expect(handler.findSubStateForTokens(['unicorn'], 0)).toBe(null);
    });

    it('should be able to find simple sub-states starting from an offset on the token string', () => {
        expect(handler.findSubStateForTokens(['alien', 'foo'], 1)!.label).toBe('Foo');
    });

    it('should be able to find embedded sub-states', () => {
        expect(handler.findSubStateForTokens(['group1', 'child1'], 0)!.label).toBe('Child 1');
    });

    it('should not find embedded sub-states where they do not belong', () => {
        expect(handler.findSubStateForTokens(['child1'], 0)).toBe(null);
    });

    it('should be able to find children from flat sub-states', () => {
        expect(handler.findSubStateForTokens(['child3'], 0)!.label).toBe('Child 3');
    });

    it('should not find flat sub-states where they do not belong', () => {
        expect(handler.findSubStateForTokens(['group2', 'child3'], 0)).toBe(null);
    });

    it('when the tokens address a group, should return the root of that group', () => {
        expect(handler.findSubStateForTokens(['group1'], 0)!.label).toBe('Group 1 Root');
    });

    it('should correctly report the number of used tokens, when finding simple sub-states', () => {
        expect(handler.findSubStateForTokens(['foo'], 0)!.totalPathTokens.length).toBe(1);
    });

    it('should correctly report the number of used tokens, when finding embedded children', () => {
        expect(handler.findSubStateForTokens(['group1', 'child1'], 0)!.totalPathTokens.length).toBe(2);
    });

    it('should correctly report the number of used tokens, when finding flat children', () => {
        expect(handler.findSubStateForTokens(['child3'], 0)!.totalPathTokens.length).toBe(1);
    });

    it('should correctly report the number of used tokens, when finding the root of a group', () => {
        expect(handler.findSubStateForTokens(['group1'], 0)!.totalPathTokens.length).toBe(1);
    });

    it('should be able to enumerate the non-hidden top-level sub-states', () => {
        expect(handler.getFilteredSubStates().map(state => state.label)).toEqual([
            'Root state',
            'Foo',
            // Bar is hidden
            'Group 1',
            'Group 2',
        ]);
    });

    it('should be able to do the visible filtering recursively', () => {
        expect(
            handler
                .getFilteredSubStates()[3] // this is Group 2
                .subStates!.map(state => state.label)
        ).toEqual([
            'Child 3',
            // Child 4 is secret, so the filtering function will hide it
        ]);
    });
});
