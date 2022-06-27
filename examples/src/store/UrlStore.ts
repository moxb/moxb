import { Text } from '@moxb/moxb';
import { UrlArg } from '@moxb/stellar-router-core';

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
