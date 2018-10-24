import { UrlArg, UrlArgImpl, URLARG_TYPE_STRING, LocationManager, TextImpl } from '@moxb/moxb';
import { UrlStore } from './UrlStore';

export class UrlStoreImpl implements UrlStore {
    public readonly color: UrlArg<string>;
    public readonly search: UrlArg<string>;
    readonly bindSearch = new TextImpl({
        id: 'sampleSearch',
        label: 'Search',
        setValue: value => (this.search.value = value),
        getValue: () => this.search.value,
    });

    public constructor(location: LocationManager) {
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
    }
}
