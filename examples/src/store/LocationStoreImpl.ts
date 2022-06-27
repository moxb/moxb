// import { createMemoryHistory } from 'history';
import { BasicLocationManagerImpl, QueryBasedUrlSchema } from '@moxb/stellar-router-core';

export class LocationStoreImpl extends BasicLocationManagerImpl {
    public constructor() {
        super({
            // history: createMemoryHistory(),
            //            urlSchema: new NativeUrlSchema(),
            urlSchema: new QueryBasedUrlSchema(),
            // urlSchema: new HashBasedUrlSchema(),
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
