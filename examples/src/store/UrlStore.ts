import { UrlArg, Text } from '@moxb/moxb';

export interface UrlStore {
    readonly color: UrlArg<string>;
    readonly search: UrlArg<string>;
    readonly number: UrlArg<string>;
    readonly bindSearch: Text;
}
