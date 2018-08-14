import {
    containsFieldValue,
    getFieldFilter,
    getFieldValue,
    getFieldValueString,
    getTopLevelFields,
    parseQuery,
    parseQueryString,
    replaceRegexObject,
    setSearchField,
} from '../QueryStringParser';

describe('parseQuery', function() {
    it('should return empty query on empty string', function() {
        expect(parseQuery('', null, ['foo', 'bar.baz'])).toEqual({});
    });
    it('should return the additional query', function() {
        expect(parseQuery('', { whatever: 'xxx' }, ['foo', 'bar.baz'])).toEqual({ whatever: 'xxx' });
    });
    it('should use reges on each field', function() {
        expect(parseQuery('', null, [])).toEqual({});
    });
    it('should return the parsed query', function() {
        const queryString = 'a:<1 b:<=2 c:=3 d:==4 e:!=5 f:">= 6" g:">7"';
        expect(parseQuery(queryString, undefined, ['foo', 'bar.baz'])).toEqual(parseQueryString(queryString).filter);
    });

    it('should return regex for each field on a search term', function() {
        expect(parseQuery('test', undefined, ['bar.baz', 'name'])).toEqual({
            $or: [{ 'bar.baz': /test/i }, { name: /test/i }],
        });
    });
    it('should return regex for each field', function() {
        expect(parseQuery('a -b c.*', undefined, ['foo', 'bar.baz'])).toEqual({
            $and: [
                { $or: [{ foo: /a/i }, { 'bar.baz': /a/i }] },
                { $and: [{ foo: { $not: /b/i } }, { 'bar.baz': { $not: /b/i } }] },
                { $or: [{ foo: /c.*/i }, { 'bar.baz': /c.*/i }] },
            ],
        });
    });

    it('should combine all three', function() {
        expect(parseQuery('a -b c.* foo>3 -date:>@2017', { whatever: 'xxx' }, ['foo', 'bar.baz'])).toEqual({
            $and: [
                { $or: [{ foo: /a/i }, { 'bar.baz': /a/i }] },
                { $and: [{ foo: { $not: /b/i } }, { 'bar.baz': { $not: /b/i } }] },
                { $or: [{ foo: /c.*/i }, { 'bar.baz': /c.*/i }] },
                { $or: [{ foo: /foo>3/i }, { 'bar.baz': /foo>3/i }] },
                { date: { $not: { $gt: new Date('2017-01-01T00:00:00.000Z') } } },
                { whatever: 'xxx' },
            ],
        });
    });
});

describe('parseQueryString', function() {
    it('should parse a simple text', function() {
        const result = parseQueryString('test the west');
        expect(result).toEqual({ search: 'test the west' });
    });
    it('should parse colon list', function() {
        const result = parseQueryString('test  foo:bar the west');
        expect(result).toEqual({
            search: 'test the west',
            filter: {
                foo: 'bar',
            },
        });
    });
    it('should parse tow filters into and', function() {
        const result = parseQueryString('test  foo:bar the west other.xxx:filter');
        expect(result).toEqual({
            search: 'test the west',
            filter: {
                $and: [{ foo: 'bar' }, { 'other.xxx': 'filter' }],
            },
        });
    });
    it('should parse quoted strings', function() {
        const result = parseQueryString('test the f:>20 foo:bar west foo.bar:"this is a string:2"');
        expect(result).toEqual({
            search: 'test the west',
            filter: {
                $and: [{ f: { $gt: 20 } }, { foo: 'bar' }, { 'foo.bar': 'this is a string:2' }],
            },
        });
    });
    it('should parse operations', function() {
        const result = parseQueryString('a:<1 b:<=2 c:=3 d:==4 e:!=5 f:">= 6" g:">7"');
        expect(result).toEqual({
            filter: {
                $and: [
                    { a: { $lt: 1 } },
                    { b: { $lte: 2 } },
                    { c: { $eq: 3 } },
                    { d: { $eq: 4 } },
                    { e: { $ne: 5 } },
                    { f: { $gte: 6 } },
                    { g: { $gt: 7 } },
                ],
            },
        });
    });
    it('should parse negations correctly', function() {
        const result = parseQueryString('test  -foo:bar the west -other.xxx:filter -aaa.bbb:>4 -x:!=y');
        expect(result).toEqual({
            search: 'test the west',
            filter: {
                $and: [
                    { foo: { $ne: 'bar' } },
                    { 'other.xxx': { $ne: 'filter' } },
                    { 'aaa.bbb': { $not: { $gt: 4 } } },
                    { x: { $not: { $ne: 'y' } } },
                ],
            },
        });
    });
    it('should parse negations of bool and null correctly', function() {
        const result = parseQueryString('-foo:null -bar:true -baz:false');
        expect(result).toEqual({
            filter: {
                $and: [{ foo: { $ne: null } }, { bar: { $ne: true } }, { baz: { $ne: false } }],
            },
        });
    });
    it('should parse numbers and booleans', function() {
        const result = parseQueryString('test.bool1:true test.bool2:false negative:-12.4');
        expect(result).toEqual({
            filter: {
                $and: [{ 'test.bool1': true }, { 'test.bool2': false }, { negative: -12.4 }],
            },
        });
    });
    it('should parse sort', function() {
        const result = parseQueryString('sort:true field:12 sort:foo.bar-asc sort:bar-desc');
        expect(result).toEqual({
            filter: {
                $and: [{ sort: true }, { field: 12 }],
            },
            sort: {
                'foo.bar': 1,
                bar: -1,
            },
        });
    });
    it('should parse regex', function() {
        const result = parseQueryString('field1:/reg ex/ field2:/foo\\/bar/ -field3:/x "\t y/');
        expect(result).toEqual({
            filter: {
                $and: [{ field1: /reg ex/i }, { field2: /foo\/bar/i }, { field3: { $not: /x "	 y/i } }],
            },
        });
    });
    it('should parse regex tab', function() {
        const result = parseQueryString('field1:/"\t/');
        expect(result).toEqual({ filter: { field1: /"	/i } });
    });
    it('should parse dates', function() {
        // note zite zone parsing is a bit difficult, so we use Z to make the time neutral
        const result = parseQueryString('created:>@2017 updated:<=@2017-03-28T21:26Z');
        expect(result).toEqual({
            filter: {
                $and: [
                    { created: { $gt: new Date('2017-01-01T00:00:00.000Z') } },
                    { updated: { $lte: new Date('2017-03-28T21:26:00.000Z') } },
                ],
            },
        });
    });
});
describe('setSearchField', function() {
    it('should add a field', function() {
        const actual = setSearchField('foo:1 bar:"cool string"', 'hello', 'world');
        expect(actual).toEqual('foo:1 bar:"cool string" hello:world');
    });
    it('should replace the field only', function() {
        const actual = setSearchField('foo:1 bar:"cool string" baz:aha', 'bar', 'hello world');
        expect(actual).toEqual('foo:1 bar:"hello world" baz:aha');
    });

    it('should replace the first field only', function() {
        const actual = setSearchField('x:"a b" foo:1 a.b:"a:b" foo:2', 'foo', '3');
        expect(actual).toEqual('x:"a b" foo:3 a.b:"a:b" foo:2');
    });
    it('should remove it when value is null', function() {
        const actual = setSearchField('x:"a b" foo:1 a.b:"a:b" foo:2', 'foo', undefined);
        expect(actual).toEqual('x:"a b" a.b:"a:b" foo:2');
    });
    it('should deal with `.` in name correctly', function() {
        const actual = setSearchField('axb:1 a.b:2', 'a.b', '3');
        expect(actual).toEqual('axb:1 a.b:3');
    });
    it('should replace -field as if there is no -', function() {
        const actual = setSearchField('x:"a b" -foo:1 a.b:"a:b" foo:2', 'foo', '3');
        expect(actual).toEqual('x:"a b" foo:3 a.b:"a:b" foo:2');
    });
    it('should be cleared by an empty value', function() {
        const actual = setSearchField('x:"a b" -foo:1 a.b:"a:b" foo:2', 'foo', '');
        expect(actual).toEqual('x:"a b" a.b:"a:b" foo:2');
    });
});
describe('getFieldValue', function() {
    it('should get string value', function() {
        const actual = getFieldValue('x:"a b" foo:1 a.b:"a:b" foo:2', 'a.b');
        expect(actual).toEqual('a:b');
    });
    it('should get number value', function() {
        const actual = getFieldValue('x:"a b" foo:1 a.b:"a:b" foo:2', 'foo');
        expect(actual).toEqual(1);
    });

    it('should get undefinded if not in string', function() {
        const actual = getFieldValue('x:"a b" foo:1 a.b:"a:b" foo:2', 'xxx');
        // here we undefined and not null, because null is valid value
        expect(actual).toBeUndefined();
    });
});
describe('getFieldValueString', function() {
    it('should get string value', function() {
        const actual = getFieldValueString('x:"a b" foo:1 a.b:"a:b" foo:2', 'a.b');
        expect(actual).toEqual('a:b');
    });
    it('should get number value', function() {
        const actual = getFieldValueString('x:"a b" foo:1 a.b:"a:b" foo:2', 'foo');
        expect(actual).toEqual('1');
    });

    it('should get undefined if not in string', function() {
        const actual = getFieldValueString('x:"a b" foo:1 a.b:"a:b" foo:2', 'xxx');
        expect(actual).toBeUndefined();
    });

    it('should get undefined if query is negated', function() {
        const actual = getFieldValueString('x:"a b" -foo:1 a.b:"a:b"', 'foo');
        expect(actual).toBeUndefined();
    });
});
describe('containsFieldValue', function() {
    it('should return true if field is contained', function() {
        expect(containsFieldValue('x:"a b" foo:1 a.b:"a:b" foo:2', 'a.b')).toBe(true);
    });

    it('should return true if field is not contained', function() {
        expect(containsFieldValue('x:"a b" foo:1 axb:"a:b" foo:2', 'a.b')).toBe(false);
    });

    it('should return true if field is negated', function() {
        expect(containsFieldValue('x:"a b" foo:1 -axb:"a:b" foo:2', 'axb')).toBe(true);
    });
    it('should return false if field is negated and excludeNegations is set', function() {
        expect(containsFieldValue('x:"a b" foo:1 -axb:"a:b" foo:2', 'axb', true)).toBe(false);
    });
});
describe('replaceRegexObject', function() {
    it('should replace regex', function() {
        const query = parseQuery('test 123', null, ['emails.address', 'profile.fullName', 'currentOrganization.name']);
        expect(replaceRegexObject(query)).toEqual({
            $and: [
                {
                    $or: [
                        {
                            'emails.address': {
                                $regex: 'test',
                                $options: 'i',
                            },
                        },
                        {
                            'profile.fullName': {
                                $regex: 'test',
                                $options: 'i',
                            },
                        },
                        {
                            'currentOrganization.name': {
                                $regex: 'test',
                                $options: 'i',
                            },
                        },
                    ],
                },
                {
                    $or: [
                        {
                            'emails.address': {
                                $regex: '123',
                                $options: 'i',
                            },
                        },
                        {
                            'profile.fullName': {
                                $regex: '123',
                                $options: 'i',
                            },
                        },
                        {
                            'currentOrganization.name': {
                                $regex: '123',
                                $options: 'i',
                            },
                        },
                    ],
                },
            ],
        });
    });
});

describe('getFieldFilter', function() {
    it('should find all top level fields', function() {
        const nestedObj = {
            top: 'first',
            'top.foo': '3',
            'a.b.c': 1,
            $and: [
                { 'x.y': 'bla' },
                'm.s',
                {
                    $or: [
                        { g: 3 },
                        {
                            $and: { 'hello.happy.world': 'cool' },
                        },
                    ],
                },
            ],
        };
        expect(getFieldFilter(nestedObj)).toEqual({
            top: 1,
            a: 1,
            x: 1,
            g: 1,
            hello: 1,
        });
    });
});
describe('getTopLevelFields', function() {
    it('should return 0 Top level keys', function() {
        const fields = {};
        expect(getTopLevelFields(fields)).toEqual({});
    });
    it('should return 1 Top level keys', function() {
        const fields = {
            emails: 1,
            'emails.address': 1,
        };
        expect(getTopLevelFields(fields)).toEqual({
            emails: 1,
        });
    });
    it('should return 2 Top level key', function() {
        const fields = {
            'emails.address': 1,
            'currentOrganization.name': 1,
        };
        expect(getTopLevelFields(fields)).toEqual({
            emails: 1,
            currentOrganization: 1,
        });
    });

    it('should return 3 Top level key', function() {
        const fields = {
            emails: 1,
            currentOrganization: 1,
            profile: 1,
        };
        expect(getTopLevelFields(fields)).toEqual({
            emails: 1,
            currentOrganization: 1,
            profile: 1,
        });
    });
});
