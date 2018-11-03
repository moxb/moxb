import { doTokenStringsMatch } from '../tokens';

describe('doTokenStringsMatch() function', () => {
    it('should confirm basic matches', () => {
        expect(doTokenStringsMatch(['a', 'b'], ['a'], 0, false)).toBeTruthy();
    });

    it('should consider the exact flag', () => {
        expect(doTokenStringsMatch(['a', 'b'], ['a'], 0, true)).toBeFalsy();
    });

    it('should consider the exact flag', () => {
        expect(doTokenStringsMatch(['a'], ['a'], 0, true)).toBeTruthy();
    });

    it('should confirm multi-token matches', () => {
        expect(doTokenStringsMatch(['a', 'b', 'c'], ['a', 'b'], 0, false)).toBeTruthy();
    });

    it('should consider the exact flag', () => {
        expect(doTokenStringsMatch(['a', 'b', 'c'], ['a', 'b'], 0, true)).toBeFalsy();
    });

    // TODO: add more token tests
});
