import { createMemoryHistory } from 'history';
import { LocationDependentStateSpaceHandlerImpl } from '../LocationDependentStateSpaceHandlerImpl';
import { testStateSpace } from './TestStateSpace';
import { BasicLocationManagerImpl } from '../BasicLocationManagerImpl';
import { NativeUrlSchema } from '../NativeUrlSchema';
import { LocationManager } from '../LocationManager';
import { UrlArgImpl } from '../UrlArgImpl';
import { URLARG_TYPE_STRING } from '../UrlArgTypes';

describe('Location-Dependent State-Space-Handler implementation, powered by path', () => {
    const fakeHistory = createMemoryHistory();
    const blm = new BasicLocationManagerImpl({
        history: fakeHistory,
        urlSchema: new NativeUrlSchema(),
    });
    blm.watchHistory();
    const locationManager: LocationManager = blm;

    const handler = new LocationDependentStateSpaceHandlerImpl({
        locationManager,
        subStates: testStateSpace,
        filterCondition: state => !(state.custom && state.custom.secret), // in menus, we will hide the "secret" items
        id: 'test loc dep state-space handler 1 (path based)',
        // no parsed tokens first
    });

    it('Should be able to find the root state, when there are no tokens', () => {
        fakeHistory.push('/');
        expect(handler.getActiveSubState()!.label).toBe('Root state');
    });

    it('should be able to find simple sub-states', () => {
        fakeHistory.push('/foo');
        const state = handler.getActiveSubState();
        expect(state).not.toBeNull();
        expect(state!.label).toBe('Foo');
    });

    it('should return null when asking for a non-existent sub-state', () => {
        fakeHistory.push('/unicorn');
        expect(handler.getActiveSubState()).toBeNull();
    });

    it('should be able to find embedded sub-states', () => {
        fakeHistory.push('/group1/child1');
        const state = handler.getActiveSubState();
        expect(state).not.toBeNull();
        expect(state!.label).toBe('Child 1');
    });

    it('should not find embedded sub-states where they do not belong', () => {
        fakeHistory.push('/child1');
        expect(handler.getActiveSubState()).toBeNull();
    });

    it('should be able to find children from flat sub-states', () => {
        fakeHistory.push('/child3');
        const state = handler.getActiveSubState();
        expect(state).not.toBeNull();
        expect(state!.label).toBe('Child 3');
    });

    it('should not find flat sub-states where they do not belong', () => {
        fakeHistory.push('/group2/child3');
        const state = handler.getActiveSubState();
        expect(state).toBeNull();
    });

    it('when the tokens address a group, should return the root of that group', () => {
        fakeHistory.push('/group1');
        expect(handler.getActiveSubState()!.label).toBe('Group 1 Root');
    });

    it('should correctly report the number of used tokens, when finding simple sub-states', () => {
        fakeHistory.push('/foo');
        expect(handler.getActiveSubState()!.totalPathTokens.length).toBe(1);
    });

    it('should correctly report the number of used tokens, when finding embedded children', () => {
        fakeHistory.push('/group1/child1');
        expect(handler.getActiveSubState()!.totalPathTokens.length).toBe(2);
    });

    it('should correctly report the number of used tokens, when finding flat children', () => {
        fakeHistory.push('/child3');
        expect(handler.getActiveSubState()!.totalPathTokens.length).toBe(1);
    });

    it('should correctly report the number of used tokens, when finding the root of a group', () => {
        fakeHistory.push('/group1');
        expect(handler.getActiveSubState()!.totalPathTokens.length).toBe(1);
    });
});

describe('Location-Dependent State-Space-Handler implementation, powered by url arg', () => {
    const fakeHistory = createMemoryHistory();
    const blm = new BasicLocationManagerImpl({
        history: fakeHistory,
        urlSchema: new NativeUrlSchema(),
    });
    blm.watchHistory();
    const locationManager: LocationManager = blm;

    const where = new UrlArgImpl(locationManager, {
        key: 'where',
        valueType: URLARG_TYPE_STRING,
        defaultValue: '',
    });

    const handler = new LocationDependentStateSpaceHandlerImpl({
        locationManager,
        subStates: testStateSpace,
        filterCondition: state => !(state.custom && state.custom.secret), // in menus, we will hide the "secret" items
        id: 'test loc dep state-space handler 2 (arg based)',
        arg: where,
    });

    it('Should be able to find the root state, when there are no tokens', () => {
        fakeHistory.push('/');
        expect(handler.getActiveSubState()!.label).toBe('Root state');
    });

    it('should be able to find simple sub-states', () => {
        fakeHistory.push('/?where=foo');
        const state = handler.getActiveSubState();
        expect(state).not.toBeNull();
        expect(state!.label).toBe('Foo');
    });

    it('should return null when asking for a non-existent sub-state', () => {
        fakeHistory.push('/?where=unicorn');
        expect(handler.getActiveSubState()).toBeNull();
    });

    it('should be able to find embedded sub-states', () => {
        fakeHistory.push('/?where=group1,child1');
        const state = handler.getActiveSubState();
        expect(state).not.toBeNull();
        expect(state!.label).toBe('Child 1');
    });

    it('should not find embedded sub-states where they do not belong', () => {
        fakeHistory.push('/?where=child1');
        expect(handler.getActiveSubState()).toBeNull();
    });

    it('should be able to find children from flat sub-states', () => {
        fakeHistory.push('/?where=child3');
        const state = handler.getActiveSubState();
        expect(state).not.toBeNull();
        expect(state!.label).toBe('Child 3');
    });

    it('should not find flat sub-states where they do not belong', () => {
        fakeHistory.push('/?where=group2,child3');
        const state = handler.getActiveSubState();
        expect(state).toBeNull();
    });

    it('when the tokens address a group, should return the root of that group', () => {
        fakeHistory.push('/?where=group1');
        expect(handler.getActiveSubState()!.label).toBe('Group 1 Root');
    });

    it('should correctly report the number of used tokens, when finding simple sub-states', () => {
        fakeHistory.push('/?where=foo');
        expect(handler.getActiveSubState()!.totalPathTokens.length).toBe(1);
    });

    it('should correctly report the number of used tokens, when finding embedded children', () => {
        fakeHistory.push('/?where=group1,child1');
        expect(handler.getActiveSubState()!.totalPathTokens.length).toBe(2);
    });

    it('should correctly report the number of used tokens, when finding flat children', () => {
        fakeHistory.push('/?where=child3');
        expect(handler.getActiveSubState()!.totalPathTokens.length).toBe(1);
    });

    it('should correctly report the number of used tokens, when finding the root of a group', () => {
        fakeHistory.push('/?where=group1');
        expect(handler.getActiveSubState()!.totalPathTokens.length).toBe(1);
    });
});

describe('Location-Dependent State-Space-Handler implementation, powered by path, with prefix', () => {
    const fakeHistory = createMemoryHistory();
    const blm = new BasicLocationManagerImpl({
        history: fakeHistory,
        urlSchema: new NativeUrlSchema(),
    });
    blm.watchHistory();
    const locationManager: LocationManager = blm;

    const handler = new LocationDependentStateSpaceHandlerImpl({
        locationManager,
        subStates: testStateSpace,
        filterCondition: state => !(state.custom && state.custom.secret), // in menus, we will hide the "secret" items
        id: 'test loc dep state-space handler 3 (path based, with prefix)',
        parsedTokens: 1, // The first token on the path will be ignored
    });

    it('Should be able to find the root state, when there are no tokens', () => {
        fakeHistory.push('/root');
        expect(handler.getActiveSubState()!.label).toBe('Root state');
    });

    it('should be able to find simple sub-states', () => {
        fakeHistory.push('/root/foo');
        const state = handler.getActiveSubState();
        expect(state).not.toBeNull();
        expect(state!.label).toBe('Foo');
    });

    it('should return null when asking for a non-existent sub-state', () => {
        fakeHistory.push('/root/unicorn');
        expect(handler.getActiveSubState()).toBeNull();
    });

    it('should be able to find embedded sub-states', () => {
        fakeHistory.push('/root/group1/child1');
        const state = handler.getActiveSubState();
        expect(state).not.toBeNull();
        expect(state!.label).toBe('Child 1');
    });

    it('should not find embedded sub-states where they do not belong', () => {
        fakeHistory.push('/root/child1');
        expect(handler.getActiveSubState()).toBeNull();
    });

    it('should be able to find children from flat sub-states', () => {
        fakeHistory.push('/root/child3');
        const state = handler.getActiveSubState();
        expect(state).not.toBeNull();
        expect(state!.label).toBe('Child 3');
    });

    it('should not find flat sub-states where they do not belong', () => {
        fakeHistory.push('/root/group2/child3');
        const state = handler.getActiveSubState();
        expect(state).toBeNull();
    });

    it('when the tokens address a group, should return the root of that group', () => {
        fakeHistory.push('/root/group1');
        expect(handler.getActiveSubState()!.label).toBe('Group 1 Root');
    });

    it('should correctly report the number of used tokens, when finding simple sub-states', () => {
        fakeHistory.push('/root/foo');
        expect(handler.getActiveSubState()!.totalPathTokens.length).toBe(1);
    });

    it('should correctly report the number of used tokens, when finding embedded children', () => {
        fakeHistory.push('/root/group1/child1');
        expect(handler.getActiveSubState()!.totalPathTokens.length).toBe(2);
    });

    it('should correctly report the number of used tokens, when finding flat children', () => {
        fakeHistory.push('/root/child3');
        expect(handler.getActiveSubState()!.totalPathTokens.length).toBe(1);
    });

    it('should correctly report the number of used tokens, when finding the root of a group', () => {
        fakeHistory.push('/root/group1');
        expect(handler.getActiveSubState()!.totalPathTokens.length).toBe(1);
    });
});
