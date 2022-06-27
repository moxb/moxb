import { MyLocation } from '../../location-manager';
import { NativeUrlSchema } from '../NativeUrlSchema';

describe('Native URL schema', () => {
    const testLocation: MyLocation = {
        pathname: '/foo/bar/',
        search: '?key1=value1&key2=value2',
        hash: '#tag1',
    };

    const testLocation2: MyLocation = {
        pathname: 'foo/bar',
        search: '?key1=value1&key2=value2',
        hash: '#tag1',
    };

    const schema = new NativeUrlSchema();

    it('Should extract path tokens', () => {
        expect(schema.getPathTokens(testLocation)).toEqual(['foo', 'bar']);
    });

    it('The number of slashes should not matter', () => {
        expect(schema.getPathTokens(testLocation)).toEqual(schema.getPathTokens(testLocation2));
    });

    it('Should extract url arguments', () => {
        expect(schema.getQuery(testLocation)).toEqual({
            key1: 'value1',
            key2: 'value2',
        });
    });

    it('should be able to encode normal path and arguments in location', () => {
        expect(
            schema.getLocation(testLocation, ['token1', 'token2'], {
                q1: 'v1',
                q2: 'v2',
            })
        ).toEqual({
            pathname: '/token1/token2',
            search: '?q1=v1&q2=v2',
            hash: '#tag1',
            state: undefined,
        });
    });

    it('should add a slashes when the path is empty', () => {
        expect(schema.getLocation(testLocation, [], {}).pathname).toEqual('/');
    });

    it('should not be confused if there is only one argument', () => {
        expect(schema.getLocation(testLocation, [], { q1: 'v1' }).search).toEqual('?q1=v1');
    });

    it('should not be confused if there are no arguments', () => {
        expect(schema.getLocation(testLocation, [], {}).search).toEqual('');
    });
});
