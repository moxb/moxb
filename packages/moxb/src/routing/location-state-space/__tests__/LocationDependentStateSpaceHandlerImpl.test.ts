import { when } from 'mobx';
import { createMemoryHistory } from 'history';
import { BasicLocationManagerImpl, LocationManager } from '../../location-manager';
import { URLARG_TYPE_STRING, UrlArgImpl } from '../../url-arg';
import { NativeUrlSchema } from '../../url-schema';
import { LocationDependentStateSpaceHandler } from '../LocationDependentStateSpaceHandler';
import { LocationDependentStateSpaceHandlerImpl } from '../LocationDependentStateSpaceHandlerImpl';
import { TestData, testStateSpace } from '../state-space/__tests__/TestStateSpace';

describe('Location-Dependent State-Space-Handler implementation, powered by path', () => {
    const fakeHistory = createMemoryHistory();
    const blm = new BasicLocationManagerImpl({
        history: fakeHistory,
        urlSchema: new NativeUrlSchema(),
    });
    blm.watchHistory();
    const locationManager: LocationManager = blm;

    const handler: LocationDependentStateSpaceHandler<
        string,
        any,
        TestData
    > = new LocationDependentStateSpaceHandlerImpl({
        locationManager,
        subStates: testStateSpace,
        filterCondition: data => !(data && data.secret), // in menus, we will hide the "secret" items
        id: 'test loc dep state-space handler 1 (path based)',
        // no parsed tokens first
    });

    it('Should be able to find the root state, when there are no tokens', () => {
        fakeHistory.push('/');
        expect(handler.getActiveSubState()!.label).toBe('Root state');
    });

    it('should be able to find simple sub-states', async () => {
        fakeHistory.push('/');
        await when(() => !locationManager.pathTokens.length);
        fakeHistory.push('/foo');
        await when(() => !!locationManager.pathTokens.length);
        const state = handler.getActiveSubState();
        expect(state).not.toBeNull();
        expect(state!.label).toBe('Foo');
    });

    it('should return null when asking for a non-existent sub-state', async () => {
        fakeHistory.push('/');
        await when(() => !locationManager.pathTokens.length);
        fakeHistory.push('/unicorn');
        await when(() => !!locationManager.pathTokens.length);
        expect(handler.getActiveSubState()).toBeNull();
    });

    it('should be able to find embedded sub-states', async () => {
        fakeHistory.push('/');
        await when(() => !locationManager.pathTokens.length);
        fakeHistory.push('/group1/child1');
        await when(() => !!locationManager.pathTokens.length);
        const state = handler.getActiveSubState();
        expect(state).not.toBeNull();
        expect(state!.label).toBe('Child 1');
    });

    it('should not find embedded sub-states where they do not belong', async () => {
        fakeHistory.push('/');
        await when(() => !locationManager.pathTokens.length);
        fakeHistory.push('/child1');
        await when(() => !!locationManager.pathTokens.length);
        expect(handler.getActiveSubState()).toBeNull();
    });

    it('should be able to find children from flat sub-states', async () => {
        fakeHistory.push('/');
        await when(() => !locationManager.pathTokens.length);
        fakeHistory.push('/child3');
        await when(() => !!locationManager.pathTokens.length);
        const state = handler.getActiveSubState();
        expect(state).not.toBeNull();
        expect(state!.label).toBe('Child 3');
    });

    it('should not find flat sub-states where they do not belong', async () => {
        fakeHistory.push('/');
        await when(() => !locationManager.pathTokens.length);
        fakeHistory.push('/group2/child3');
        await when(() => !!locationManager.pathTokens.length);
        const state = handler.getActiveSubState();
        expect(state).toBeNull();
    });

    it('when the tokens address a group, should return the root of that group', async () => {
        fakeHistory.push('/');
        await when(() => !locationManager.pathTokens.length);
        fakeHistory.push('/group1');
        await when(() => !!locationManager.pathTokens.length);
        expect(handler.getActiveSubState()!.label).toBe('Group 1 Root');
    });

    it('should correctly report the number of used tokens, when finding simple sub-states', async () => {
        fakeHistory.push('/');
        await when(() => !locationManager.pathTokens.length);
        fakeHistory.push('/foo');
        await when(() => !!locationManager.pathTokens.length);
        expect(handler.getActiveSubState()!.totalPathTokens.length).toBe(1);
    });

    it('should correctly report the number of used tokens, when finding embedded children', async () => {
        fakeHistory.push('/');
        await when(() => !locationManager.pathTokens.length);
        fakeHistory.push('/group1/child1');
        await when(() => !!locationManager.pathTokens.length);
        expect(handler.getActiveSubState()!.totalPathTokens.length).toBe(2);
    });

    it('should correctly report the number of used tokens, when finding flat children', async () => {
        fakeHistory.push('/');
        await when(() => !locationManager.pathTokens.length);
        fakeHistory.push('/child3');
        await when(() => !!locationManager.pathTokens.length);
        expect(handler.getActiveSubState()!.totalPathTokens.length).toBe(1);
    });

    it('should correctly report the number of used tokens, when finding the root of a group', async () => {
        fakeHistory.push('/');
        await when(() => !locationManager.pathTokens.length);
        fakeHistory.push('/group1');
        await when(() => !!locationManager.pathTokens.length);
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
        filterCondition: data => !(data && data.secret), // in menus, we will hide the "secret" items
        id: 'test loc dep state-space handler 2 (arg based)',
        arg: where,
    });

    it('Should be able to find the root state, when there are no tokens', async () => {
        fakeHistory.push('/whatever');
        await when(() => !!locationManager.pathTokens.length);
        fakeHistory.push('/');
        await when(() => !locationManager.pathTokens.length);
        expect(handler.getActiveSubState()!.label).toBe('Root state');
    });

    it('should be able to find simple sub-states', async () => {
        fakeHistory.push('/');
        await when(() => !locationManager.query.where);
        fakeHistory.push('/?where=foo');
        await when(() => !!locationManager.query.where);
        const state = handler.getActiveSubState();
        expect(state).not.toBeNull();
        expect(state!.label).toBe('Foo');
    });

    it('should return null when asking for a non-existent sub-state', async () => {
        fakeHistory.push('/');
        await when(() => !locationManager.query.where);
        fakeHistory.push('/?where=unicorn');
        await when(() => !!locationManager.query.where);
        expect(handler.getActiveSubState()).toBeNull();
    });

    it('should be able to find embedded sub-states', async () => {
        fakeHistory.push('/');
        await when(() => !locationManager.query.where);
        fakeHistory.push('/?where=group1,child1');
        await when(() => !!locationManager.query.where);
        const state = handler.getActiveSubState();
        expect(state).not.toBeNull();
        expect(state!.label).toBe('Child 1');
    });

    it('should not find embedded sub-states where they do not belong', async () => {
        fakeHistory.push('/');
        await when(() => !locationManager.query.where);
        fakeHistory.push('/?where=child1');
        await when(() => !!locationManager.query.where);
        expect(handler.getActiveSubState()).toBeNull();
    });

    it('should be able to find children from flat sub-states', async () => {
        fakeHistory.push('/');
        await when(() => !locationManager.query.where);
        fakeHistory.push('/?where=child3');
        await when(() => !!locationManager.query.where);
        const state = handler.getActiveSubState();
        expect(state).not.toBeNull();
        expect(state!.label).toBe('Child 3');
    });

    it('should not find flat sub-states where they do not belong', async () => {
        fakeHistory.push('/');
        await when(() => !locationManager.query.where);
        fakeHistory.push('/?where=group2,child3');
        await when(() => !!locationManager.query.where);
        const state = handler.getActiveSubState();
        expect(state).toBeNull();
    });

    it('when the tokens address a group, should return the root of that group', async () => {
        fakeHistory.push('/');
        await when(() => !locationManager.query.where);
        fakeHistory.push('/?where=group1');
        await when(() => !!locationManager.query.where);
        expect(handler.getActiveSubState()!.label).toBe('Group 1 Root');
    });

    it('should correctly report the number of used tokens, when finding simple sub-states', async () => {
        fakeHistory.push('/');
        await when(() => !locationManager.query.where);
        fakeHistory.push('/?where=foo');
        await when(() => !!locationManager.query.where);
        expect(handler.getActiveSubState()!.totalPathTokens.length).toBe(1);
    });

    it('should correctly report the number of used tokens, when finding embedded children', async () => {
        fakeHistory.push('/');
        await when(() => !locationManager.query.where);
        fakeHistory.push('/?where=group1,child1');
        await when(() => !!locationManager.query.where);
        expect(handler.getActiveSubState()!.totalPathTokens.length).toBe(2);
    });

    it('should correctly report the number of used tokens, when finding flat children', async () => {
        fakeHistory.push('/');
        await when(() => !locationManager.query.where);
        fakeHistory.push('/?where=child3');
        await when(() => !!locationManager.query.where);
        expect(handler.getActiveSubState()!.totalPathTokens.length).toBe(1);
    });

    it('should correctly report the number of used tokens, when finding the root of a group', async () => {
        fakeHistory.push('/');
        await when(() => !locationManager.query.where);
        fakeHistory.push('/?where=group1');
        await when(() => !!locationManager.query.where);
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
        filterCondition: data => !(data && data.secret), // in menus, we will hide the "secret" items
        id: 'test loc dep state-space handler 3 (path based, with prefix)',
        parsedTokens: 1, // The first token on the path will be ignored
    });

    it('Should be able to find the root state, when there are no tokens', async () => {
        fakeHistory.push('/');
        await when(() => !locationManager.pathTokens.length);
        fakeHistory.push('/root');
        await when(() => !!locationManager.pathTokens.length);
        expect(handler.getActiveSubState()!.label).toBe('Root state');
    });

    it('should be able to find simple sub-states', async () => {
        fakeHistory.push('/');
        await when(() => !locationManager.pathTokens.length);
        fakeHistory.push('/root/foo');
        await when(() => !!locationManager.pathTokens.length);
        const state = handler.getActiveSubState();
        expect(state).not.toBeNull();
        expect(state!.label).toBe('Foo');
    });

    it('should return null when asking for a non-existent sub-state', async () => {
        fakeHistory.push('/');
        await when(() => !locationManager.pathTokens.length);
        fakeHistory.push('/root/unicorn');
        await when(() => !!locationManager.pathTokens.length);
        expect(handler.getActiveSubState()).toBeNull();
    });

    it('should be able to find embedded sub-states', async () => {
        fakeHistory.push('/');
        await when(() => !locationManager.pathTokens.length);
        fakeHistory.push('/root/group1/child1');
        await when(() => !!locationManager.pathTokens.length);
        const state = handler.getActiveSubState();
        expect(state).not.toBeNull();
        expect(state!.label).toBe('Child 1');
    });

    it('should not find embedded sub-states where they do not belong', async () => {
        fakeHistory.push('/');
        await when(() => !locationManager.pathTokens.length);
        fakeHistory.push('/root/child1');
        await when(() => !!locationManager.pathTokens.length);
        expect(handler.getActiveSubState()).toBeNull();
    });

    it('should be able to find children from flat sub-states', async () => {
        fakeHistory.push('/');
        await when(() => !locationManager.pathTokens.length);
        fakeHistory.push('/root/child3');
        await when(() => !!locationManager.pathTokens.length);
        const state = handler.getActiveSubState();
        expect(state).not.toBeNull();
        expect(state!.label).toBe('Child 3');
    });

    it('should not find flat sub-states where they do not belong', async () => {
        fakeHistory.push('/');
        await when(() => !locationManager.pathTokens.length);
        fakeHistory.push('/root/group2/child3');
        await when(() => !!locationManager.pathTokens.length);
        const state = handler.getActiveSubState();
        expect(state).toBeNull();
    });

    it('when the tokens address a group, should return the root of that group', async () => {
        fakeHistory.push('/');
        await when(() => !locationManager.pathTokens.length);
        fakeHistory.push('/root/group1');
        await when(() => !!locationManager.pathTokens.length);
        expect(handler.getActiveSubState()!.label).toBe('Group 1 Root');
    });

    it('should correctly report the number of used tokens, when finding simple sub-states', async () => {
        fakeHistory.push('/');
        await when(() => !locationManager.pathTokens.length);
        fakeHistory.push('/root/foo');
        await when(() => !!locationManager.pathTokens.length);
        expect(handler.getActiveSubState()!.totalPathTokens.length).toBe(1);
    });

    it('should correctly report the number of used tokens, when finding embedded children', async () => {
        fakeHistory.push('/');
        await when(() => !locationManager.pathTokens.length);
        fakeHistory.push('/root/group1/child1');
        await when(() => !!locationManager.pathTokens.length);
        expect(handler.getActiveSubState()!.totalPathTokens.length).toBe(2);
    });

    it('should correctly report the number of used tokens, when finding flat children', async () => {
        fakeHistory.push('/');
        await when(() => !locationManager.pathTokens.length);
        fakeHistory.push('/root/child3');
        await when(() => !!locationManager.pathTokens.length);
        expect(handler.getActiveSubState()!.totalPathTokens.length).toBe(1);
    });

    it('should correctly report the number of used tokens, when finding the root of a group', async () => {
        fakeHistory.push('/');
        await when(() => !locationManager.pathTokens.length);
        fakeHistory.push('/root/group1');
        await when(() => !!locationManager.pathTokens.length);
        expect(handler.getActiveSubState()!.totalPathTokens.length).toBe(1);
    });
});
