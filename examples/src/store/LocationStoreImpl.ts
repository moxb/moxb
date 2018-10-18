import { LocationManager, PATH_STRATEGY, ArgSavingLocationManagerImpl } from '@moxb/moxb';

export class LocationStoreImpl extends ArgSavingLocationManagerImpl {
    public constructor() {
        super({
            pathStrategy: PATH_STRATEGY.QUERY,
        });
        this.watchHistory();
    }
}
