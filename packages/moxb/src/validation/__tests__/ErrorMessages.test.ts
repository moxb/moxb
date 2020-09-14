import { extractErrorString } from '../ErrorMessage';

describe('extractErrorString', function () {
    it('should return the error.message string', function () {
        expect(extractErrorString(new Error('oops'))).toEqual('oops');
    });
    it('should concat child messages', function () {
        const err = new Error('oops');
        (err as any).details = [new Error('e1'), new Error('e2')];
        expect(extractErrorString(err)).toEqual('e1\ne2');
    });
});
