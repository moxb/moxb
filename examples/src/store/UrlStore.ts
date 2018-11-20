import { UrlArg, Text } from '@moxb/moxb';

export interface UrlStore {
    readonly color: UrlArg<string>;
    readonly search: UrlArg<string>;
    readonly number: UrlArg<string>;
    readonly bindSearch: Text;
    readonly groupId: UrlArg<string>;
    readonly objectId: UrlArg<string>;
}

export interface UsesURL {
    url: UrlStore;
}
