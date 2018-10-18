import { computed, action } from 'mobx';

import { BasicLocationManagerImpl } from './BasicLocationManagerImpl';

export interface Config {
    onPathChange?: (path: string[]) => void;
}

// This is a LocationManager implementation which supports
// calling a callback when the path changes.
// This might be utterly unnecessary, given the builtin features of MobX.
export class TriggeringLocationManagerImpl extends BasicLocationManagerImpl {
    // private field for storing config
    protected _config?: Config = undefined;

    // public getter for router config
    public get config(): Config {
        if (!this._config) {
            throw new Error('Router not configured yet!');
        }
        return this._config as Config;
    }

    // public getter for location. Checks if we have a valid config.
    @computed
    public get location() {
        const c = this.config;
        //        console.log("Reading location");
        return super.getLocation();
    }

    // This is where we react to location changes.
    public handleLocationChange(
        pathChanged: boolean,
        _path: string,
        pathTokens: string[],
        _searchChanged: boolean,
        _query: string
    ) {
        //        console.log("Handler: triggering");
        const { onPathChange } = this.config;
        if (pathChanged && onPathChange) {
            onPathChange(pathTokens);
        }
    }

    @action
    public watchHistory(config?: Config) {
        if (this._config) {
            throw new Error('Already watching!');
        }

        // Save the config
        this._config = config || {};

        super.watchHistory();
    }
}
