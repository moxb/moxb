import { LocationManager, TextImpl, TokenManager, UrlArg } from '@moxb/moxb';
import { UrlStore } from './UrlStore';

export class UrlStoreImpl implements UrlStore {
    readonly color: UrlArg<string>;
    readonly search: UrlArg<string>;
    readonly number: UrlArg<string>;
    readonly groupId: UrlArg<string>;
    readonly objectId: UrlArg<string>;
    readonly something: UrlArg<string>;

    readonly bindSearch = new TextImpl({
        id: 'sampleSearch',
        label: 'Search',
        setValue: (value) => this.search.doSet(value),
        getValue: () => this.search.value,
    });

    public constructor(location: LocationManager, tokens: TokenManager) {
        this.color = location.defineStringArg('color', 'red');
        this.search = location.defineStringArg('search', '', true);
        this.number = location.defineStringArg('numbers', '', true);

        this.groupId = tokens.defineStringArg('groupId');
        this.objectId = tokens.defineStringArg('objectId');
        this.something = tokens.defineStringArg('something');
    }
}
