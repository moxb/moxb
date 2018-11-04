import { doTokenStringsMatch } from '../tokens';

describe('doTokenStringsMatch() function', () => {
    it('should be able to match empty strings', () => {
        expect(doTokenStringsMatch([], [], 0, false)).toBeTruthy();
        expect(doTokenStringsMatch([], [], 0, true)).toBeTruthy();
    });

    it('should be able to match empty to the end of strings', () => {
        expect(doTokenStringsMatch(['a', 'b'], [], 2, false)).toBeTruthy();
        expect(doTokenStringsMatch(['a', 'b'], [], 2, true)).toBeTruthy();
    });

    it('should confirm basic matches', () => {
        expect(doTokenStringsMatch(['a', 'b'], ['a'], 0, false)).toBeTruthy();
    });

    it('should confirm basic matches with offset', () => {
        expect(doTokenStringsMatch(['alien', 'a', 'b'], ['a'], 1, false)).toBeTruthy();
    });

    it('should consider the exact flag', () => {
        expect(doTokenStringsMatch(['a'], ['a'], 0, true)).toBeTruthy();
        expect(doTokenStringsMatch(['a', 'b'], ['a'], 0, true)).toBeFalsy();
    });

    it('should consider the exact flag, with offset, too', () => {
        expect(doTokenStringsMatch(['alien', 'a'], ['a'], 1, true)).toBeTruthy();
        expect(doTokenStringsMatch(['alien', 'a', 'b'], ['a'], 1, true)).toBeFalsy();
    });

    it('should confirm multi-token matches', () => {
        expect(doTokenStringsMatch(['a', 'b', 'c'], ['a', 'b'], 0, false)).toBeTruthy();
    });

    it('should consider the exact flag on multi-token matches', () => {
        expect(doTokenStringsMatch(['a', 'b', 'c'], ['a', 'b'], 0, true)).toBeFalsy();
    });

    it('should confirm multi-token matches with offset', () => {
        expect(doTokenStringsMatch(['alien', 'a', 'b', 'c'], ['a', 'b'], 1, false)).toBeTruthy();
    });

    it('should consider the exact flag on multi-token matches with offset', () => {
        expect(doTokenStringsMatch(['a', 'b', 'c'], ['a', 'b'], 1, true)).toBeFalsy();
    });
});
