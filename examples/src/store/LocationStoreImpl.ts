import { LocationManager, PATH_STRATEGY, BasicLocationManagerImpl } from '@moxb/moxb';

export class LocationStoreImpl extends BasicLocationManagerImpl {
    public constructor() {
        super({
            pathStrategy: PATH_STRATEGY.QUERY,
        });
        this.watchHistory();
    }
}
