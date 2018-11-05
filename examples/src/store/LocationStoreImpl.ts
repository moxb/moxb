// import { createMemoryHistory } from 'history';
import {
    BasicLocationManagerImpl,
    QueryBasedUrlSchema,
    // HashBasedUrlSchema,
} from '@moxb/moxb';

export class LocationStoreImpl extends BasicLocationManagerImpl {
    public constructor() {
        super({
            // history: createMemoryHistory(),
            //            urlSchema: new NativeUrlSchema(),
            urlSchema: new QueryBasedUrlSchema(),
            // urlSchema: new HashBasedUrlSchema(),
        });
        this.watchHistory();
    }
}
