import { toId } from '../toId';

describe('toId', function () {
    it('should be empty if id is empty', function () {
        expect(toId('')).toBe('');
        expect(toId('', '')).toBe('');
    });
    it('should be a noop if string is already an id', function () {
        expect(toId('foo.barBaz')).toBe('foo.barBaz');
    });
    it('should join parts with `.`', function () {
        expect(toId('foo', 'barBaz', 'and.this', '', 'and', 'that')).toBe('foo.barBaz.and.this.and.that');
    });
    it('should join multiple `.` inot one', function () {
        expect(toId('foo.', 'bar')).toBe('foo.bar');
        expect(toId('foo.', 'bar', '...baz...')).toBe('foo.bar.baz');
        expect(toId('foo.', 'bar', '...baz..._is.one')).toBe('foo.bar.baz.is.one');
    });
    it('should not have . at the ends ', function () {
        expect(toId('...foo..')).toBe('foo');
        expect(toId('.__..foo.-_..')).toBe('foo');
    });
    it('should convert ._ to . ', function () {
        expect(toId('foo._bar._baz')).toBe('foo.bar.baz');
        expect(toId('foo._bar', '_baz')).toBe('foo.bar.baz');
        expect(toId('foo._bar.', '_baz')).toBe('foo.bar.baz');
    });
    it('should convert _. to . ', function () {
        expect(toId('foo_._bar_.', '_baz')).toBe('foo_bar_baz');
        expect(toId('foo__...__bar_', 'baz')).toBe('foo_bar_baz');
    });
    it('should convert ü to u', function () {
        expect(toId('über rüber')).toBe('uber_ruber');
    });
    it('should convert non word to _', function () {
        expect(toId('&^%4/aha_*&123___x')).toBe('4_aha_123_x');
    });
});
