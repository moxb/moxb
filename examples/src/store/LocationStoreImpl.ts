import {
    LocationManager,
    NativeUrlSchema,
    QueryBasedUrlSchema,
    HashBasedUrlSchema,
    BasicLocationManagerImpl,
} from '@moxb/moxb';

export class LocationStoreImpl extends BasicLocationManagerImpl {
    public constructor() {
        super({
            //            urlSchema: new NativeUrlSchema(),
            urlSchema: new QueryBasedUrlSchema(),
            //            urlSchema: new HashBasedUrlSchema(),
            cleanSeparatorFromPathEnd: true,
        });
        this.watchHistory();
    }
}
