import { Text, UrlArg } from '@moxb/moxb';

export interface UrlStore {
    readonly color: UrlArg<string>;
    readonly search: UrlArg<string>;
    readonly number: UrlArg<string>;
    readonly bindSearch: Text;
    readonly groupId: UrlArg<string | undefined>;
    readonly objectId: UrlArg<string | undefined>;
    readonly something: UrlArg<string | undefined>;
}

export interface UsesURL {
    url: UrlStore;
}
