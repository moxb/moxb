// import { createMemoryHistory } from 'history';
import {
    BasicLocationManagerImpl,
    NativeUrlSchema,
    // QueryBasedUrlSchema,
    // HashBasedUrlSchema,
} from '@moxb/moxb';

export class LocationStoreImpl extends BasicLocationManagerImpl {
    public constructor() {
        super({
            // history: createMemoryHistory(),
            urlSchema: new NativeUrlSchema(),
            //            urlSchema: new QueryBasedUrlSchema(),
            //            urlSchema: new HashBasedUrlSchema(),
        });

        this.setRedirect({
            fromTokens: ['portal'],
            //            root: true,
            toTokens: ['foo'],
            //            copy: true,
        });

        this.watchHistory();
    }
}
