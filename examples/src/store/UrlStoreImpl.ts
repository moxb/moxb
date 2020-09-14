import {
    LocationManager,
    TextImpl,
    TokenManager,
    UrlArg,
    URLARG_TYPE_STRING,
    UrlArgImpl,
    UrlTokenImpl,
} from '@moxb/moxb';
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
        this.color = new UrlArgImpl(location, {
            key: 'color',
            valueType: URLARG_TYPE_STRING,
            defaultValue: 'red',
        });

        this.search = new UrlArgImpl(location, {
            key: 'search',
            valueType: URLARG_TYPE_STRING,
            defaultValue: '',
            permanent: true,
        });

        this.number = new UrlArgImpl(location, {
            key: 'numbers',
            valueType: URLARG_TYPE_STRING,
            defaultValue: '',
            permanent: true,
        });

        this.groupId = new UrlTokenImpl(tokens, {
            key: 'groupId',
            valueType: URLARG_TYPE_STRING,
            defaultValue: '',
        });

        this.objectId = new UrlTokenImpl(tokens, {
            key: 'objectId',
            valueType: URLARG_TYPE_STRING,
            defaultValue: '',
        });

        this.something = new UrlTokenImpl(tokens, {
            key: 'something',
            valueType: URLARG_TYPE_STRING,
            defaultValue: '',
        });
    }
}
