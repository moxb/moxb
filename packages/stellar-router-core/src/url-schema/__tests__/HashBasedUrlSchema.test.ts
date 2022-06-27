import { MyLocation } from '../../location-manager';
import { HashBasedUrlSchema } from '../HashBasedUrlSchema';

describe('Hash-based URL schema', () => {
    const testLocation: MyLocation = {
        pathname: '/alienPath',
        search: '?alienKey=alienValue',
        hash: '#foo/bar?key1=value1&key2=value2',
    };

    const testLocation2: MyLocation = {
        pathname: '/alienPath',
        search: '?alienKey=alienValue',
        hash: '#/foo/bar/?key1=value1&key2=value2',
    };

    const schema = new HashBasedUrlSchema();

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
            pathname: '/alienPath',
            search: '?alienKey=alienValue',
            hash: '#/token1/token2?q1=v1&q2=v2',
            state: undefined,
        });
    });

    it('should not add the path when the path is empty', () => {
        expect(schema.getLocation(testLocation, [], { q1: 'v1', q2: 'v2' }).hash).toEqual('#?q1=v1&q2=v2');
    });

    it('should not be confused if there are no arguments', () => {
        expect(schema.getLocation(testLocation, ['token1', 'token2'], {}).hash).toEqual('#/token1/token2');
    });

    it('should not be confused if there are is no path or arguments', () => {
        expect(schema.getLocation(testLocation, [], {}).hash).toEqual('');
    });

    it('should not needlessly escape "," and "/" characters', () => {
        expect(
            schema.getLocation(testLocation, [], {
                commaTest: 'foo,bar',
                slashTest: 'foo/bar',
            }).hash
        ).toEqual('#?commaTest=foo,bar&slashTest=foo/bar');
    });
});
