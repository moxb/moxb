import { when } from 'mobx';
import { createMemoryHistory } from 'history';
import { NativeUrlSchema } from '../../url-schema/NativeUrlSchema';
import { BasicLocationManagerImpl } from '../BasicLocationManagerImpl';
import { LocationManager, UpdateMethod } from '../LocationManager';

// A "localhost" prefix might make it into URLs, depending on the lib versions.
// We want to remove them, for uniform testing.
export const cleanLocalhost = (url: string): string => url.replace('http://localhost', '');

describe('The Basic Location Manager implementation', () => {
    const fakeHistory = createMemoryHistory();
    const blm = new BasicLocationManagerImpl({
        history: fakeHistory,
        urlSchema: new NativeUrlSchema(),
    });
    blm.watchHistory();
    const locationManager: LocationManager = blm;

    const foo = locationManager.defineStringArg('foo', 'foo-default');

    const sticky = locationManager.defineStringArg('sticky', '', true);

    it('Should provide path tokens', async () => {
        fakeHistory.push('/');
        await when(() => !locationManager.pathTokens.length);
        fakeHistory.push('/foo/bar');
        await when(() => !!locationManager.pathTokens.length);
        expect(locationManager.pathTokens).toEqual(['foo', 'bar']);
    });

    it('Should be able to set path tokens', async () => {
        fakeHistory.push('/');
        await when(() => !locationManager.pathTokens.length);
        fakeHistory.push('/nowhere?foo=bar&sticky=glue');
        await when(() => !!locationManager.pathTokens.length);
        expect(foo.value).toBe('bar');
        expect(sticky.value).toBe('glue');
        locationManager.doSetPathTokens(0, ['new1', 'new2']);
        expect(fakeHistory.location.pathname).toBe('/new1/new2');

        // Normal args will be dropped
        expect(locationManager._query.foo).toBeUndefined();
        expect(foo.defined).toBeFalsy(); // It is not defined
        expect(foo.value).toBe('foo-default'); // Lacking a value, it returns the default

        // Sticky args will stick around
        expect(locationManager._query.sticky).toBe('glue');
        expect(sticky.defined).toBeTruthy();
        expect(sticky.value).toBe('glue');
    });

    it('Should be able to set path tokens starting with a give number', async () => {
        fakeHistory.push('/');
        await when(() => !locationManager.pathTokens.length);
        locationManager.doSetPathTokens(0, ['new1', 'new2']);
        locationManager.doSetPathTokens(1, ['newer1', 'newer2']);
        expect(fakeHistory.location.pathname).toBe('/new1/newer1/newer2');
    });

    // TODO: doPathTokensMatch

    it('Should be able to provide URL for path tokens', async () => {
        fakeHistory.push('/');
        await when(() => !locationManager.pathTokens.length);
        fakeHistory.push('/some/where?foo=bar&sticky=glue');
        await when(() => !!locationManager.pathTokens.length);
        expect(
            cleanLocalhost(
                locationManager._getURLForPathTokens(
                    1, // First token will be preserved
                    ['place', 'else']
                )
            )
        ).toBe('/some/place/else?sticky=glue'); // Normal arg is dropped, permanent is preserved
    });

    it('Should provide url search arguments', async () => {
        fakeHistory.push('/');
        await when(() => !locationManager.pathTokens.length);
        fakeHistory.push('whatever?key1=value1&key2=value2');
        await when(() => !!locationManager.pathTokens.length);
        expect(locationManager._query).toEqual({
            key1: 'value1',
            key2: 'value2',
        });
    });

    it('Should be able to provide URL for query changes', async () => {
        fakeHistory.push('/');
        await when(() => !locationManager.pathTokens.length);
        fakeHistory.push('/some/where?foo=bar&sticky=glue');
        await when(() => !!locationManager.pathTokens.length);
        expect(
            cleanLocalhost(
                locationManager._getURLForQueryChanges([
                    {
                        key: 'sticky',
                        value: 'honey',
                    },
                    {
                        key: 'weather',
                        value: 'windy',
                    },
                ])
            )
        ).toBe('/some/where?foo=bar&sticky=honey&weather=windy'); // Path is preserved, args changed/added
    });

    it('Should be able to provide URL for a single query change', async () => {
        fakeHistory.push('/');
        await when(() => !locationManager.pathTokens.length);
        fakeHistory.push('/some/where?foo=bar&sticky=glue');
        await when(() => !!locationManager.pathTokens.length);
        expect(cleanLocalhost(locationManager._getURLForQueryChange('sticky', 'honey'))).toBe(
            '/some/where?foo=bar&sticky=honey'
        ); // Path is changed, single arg is changed
    });

    it('should be able to set url search arguments', async () => {
        fakeHistory.push('/');
        await when(() => !locationManager.pathTokens.length);
        fakeHistory.push('/some/path?a=a&b=b&c=c');
        await when(() => !!locationManager.pathTokens.length);
        locationManager._doSetQueries([
            {
                key: 'b',
                value: 'new-b',
            },
            {
                key: 'c',
                value: 'new-c',
            },
        ]);
        expect(locationManager.pathTokens).toEqual([
            // Path doesn't change
            'some',
            'path',
        ]);
        expect(locationManager._query).toEqual({
            // Some of the args change
            a: 'a',
            b: 'new-b',
            c: 'new-c',
        });
    });

    it('should be able to set a single search argument', async () => {
        fakeHistory.push('/');
        await when(() => !locationManager.pathTokens.length);
        fakeHistory.push('/some/path?a=a&b=b&c=c');
        await when(() => !!locationManager.pathTokens.length);
        locationManager._doSetQuery('b', 'new-b');
        expect(locationManager.pathTokens).toEqual([
            // Path doesn't change
            'some',
            'path',
        ]);
        expect(locationManager._query).toEqual({
            a: 'a',
            b: 'new-b', // This one changed
            c: 'c',
        });
    });

    it('should create new entries in history by default', async () => {
        fakeHistory.push('/');
        await when(() => !locationManager.pathTokens.length);
        const startLength = fakeHistory.index;
        locationManager.doSetPathTokens(0, ['go', 'here']);
        locationManager._doSetQuery('foo', 'bar');
        const endLength = fakeHistory.index;
        expect(endLength).toEqual(startLength + 2);
    });

    it('should be able to manipulate location without adding new entries to history', async () => {
        fakeHistory.push('/');
        await when(() => !locationManager.pathTokens.length);
        const startLength = fakeHistory.index;
        locationManager.doSetPathTokens(0, ['go', 'here'], UpdateMethod.REPLACE);
        locationManager._doSetQuery('foo', 'bar', UpdateMethod.REPLACE);
        const endLength = fakeHistory.index;
        expect(endLength).toEqual(startLength);
    });
});
