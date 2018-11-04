import { createMemoryHistory } from 'history';
import { BasicLocationManagerImpl } from '../BasicLocationManagerImpl';
import { NativeUrlSchema } from '../NativeUrlSchema';
import { LocationManager } from '../LocationManager';
import { UrlArgImpl } from '../UrlArgImpl';
import { URLARG_TYPE_STRING } from '../UrlArgTypes';

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

    const foo = new UrlArgImpl(locationManager, {
        key: 'foo',
        valueType: URLARG_TYPE_STRING,
        defaultValue: 'foo-default',
    });

    const sticky = new UrlArgImpl(locationManager, {
        key: 'sticky',
        valueType: URLARG_TYPE_STRING,
        permanent: true,
        defaultValue: '',
    });

    it('Should provide path tokens', () => {
        fakeHistory.push('/foo/bar');
        expect(locationManager.pathTokens).toEqual(['foo', 'bar']);
    });

    it('Should be able to set path tokens', () => {
        fakeHistory.push('/nowhere?foo=bar&sticky=glue');
        locationManager.setPathTokens(0, ['new1', 'new2']);
        expect(fakeHistory.location.pathname).toBe('/new1/new2');

        // Normal args will be dropped
        expect(locationManager.query.foo).toBeUndefined();
        expect(foo.defined).toBeFalsy(); // It is not defined
        expect(foo.value).toBe('foo-default'); // Lacking a value, it returns the default

        // Sticky args will stick around
        expect(locationManager.query.sticky).toBe('glue');
        expect(sticky.defined).toBeTruthy();
        expect(sticky.value).toBe('glue');
    });

    it('Should be able to set path tokens starting with a give number', () => {
        locationManager.setPathTokens(0, ['new1', 'new2']);
        locationManager.setPathTokens(1, ['newer1', 'newer2']);
        expect(fakeHistory.location.pathname).toBe('/new1/newer1/newer2');
    });

    // TODO: doPathTokensMatch

    it('Should be able to provide URL for path tokens', () => {
        fakeHistory.push('/some/where?foo=bar&sticky=glue');
        expect(
            cleanLocalhost(
                locationManager.getURLForPathTokens(
                    1, // First token will be preserved
                    ['place', 'else']
                )
            )
        ).toBe('/some/place/else?sticky=glue'); // Normal arg is dropped, permanent is preserved
    });

    it('Should provide url search arguments', () => {
        fakeHistory.push('?key1=value1&key2=value2');
        expect(locationManager.query).toEqual({
            key1: 'value1',
            key2: 'value2',
        });
    });

    it('Should be able to provide URL for query changes', () => {
        fakeHistory.push('/some/where?foo=bar&sticky=glue');
        expect(
            cleanLocalhost(
                locationManager.getURLForQueryChanges([
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

    it('Should be able to provide URL for a single query change', () => {
        fakeHistory.push('/some/where?foo=bar&sticky=glue');
        expect(cleanLocalhost(locationManager.getURLForQueryChange('sticky', 'honey'))).toBe(
            '/some/where?foo=bar&sticky=honey'
        ); // Path is changed, single arg is changed
    });

    it('should be able to set url search arguments', () => {
        fakeHistory.push('/some/path?a=a&b=b&c=c');
        locationManager.setQueries([
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
        expect(locationManager.query).toEqual({
            // Some of the args change
            a: 'a',
            b: 'new-b',
            c: 'new-c',
        });
    });

    it('should be able to set a single search argument', () => {
        fakeHistory.push('/some/path?a=a&b=b&c=c');
        locationManager.setQuery('b', 'new-b');
        expect(locationManager.pathTokens).toEqual([
            // Path doesn't change
            'some',
            'path',
        ]);
        expect(locationManager.query).toEqual({
            a: 'a',
            b: 'new-b', // This one changed
            c: 'c',
        });
    });

    it('should create new entries in history by default', () => {
        fakeHistory.push('/');
        const startLength = fakeHistory.entries.length;
        locationManager.setPathTokens(0, ['go', 'here']);
        locationManager.setQuery('foo', 'bar');
        const endLength = fakeHistory.entries.length;
        expect(endLength).toEqual(startLength + 2);
    });

    it('should be able to manipulate location without adding new entries to history', () => {
        fakeHistory.push('/');
        const startLength = fakeHistory.entries.length;
        locationManager.setPathTokens(0, ['go', 'here'], 'replace');
        locationManager.setQuery('foo', 'bar', 'replace');
        const endLength = fakeHistory.entries.length;
        expect(endLength).toEqual(startLength);
    });
});
