import { Props as BasicProps } from './BasicLocationManagerImpl';

import { TriggeringLocationManagerImpl } from './TriggeringLocationManagerImpl';

const saveArgsDebug = false;

export interface ArgSavingBackend {
    save: (path: string, search: string) => void;
    load: (path: string) => Promise<string>;
}

interface SearchMap {
    [index: string]: string;
}

export class BasicArgSavingBackend implements ArgSavingBackend {
    private searches: SearchMap = {};

    public save(path: string, search: string) {
        console.log('Query for', path, 'is now', search), (this.searches[path] = search);
    }

    public load(path: string): Promise<string> {
        return new Promise((resolve, _reject) => {
            resolve(this.searches[path]);
        });
    }
}

export interface Props extends BasicProps {
    backend?: ArgSavingBackend;
}

// This is a LocationManager implementation that adds the feature of
// saving and loading URL arguments for the respective paths.
export class ArgSavingLocationManagerImpl extends TriggeringLocationManagerImpl {
    private readonly _searches: ArgSavingBackend;

    public constructor(props: Props) {
        super(props);
        this._searches = props.backend || new BasicArgSavingBackend();
    }

    // internal method to save the URL args, when required
    private saveArgs(path: string, newSearch: string) {
        this._searches.load(path).then(savedSearch => {
            if (newSearch !== savedSearch) {
                if (saveArgsDebug) {
                    console.log(
                        'Saving new search',
                        newSearch,
                        'for path',
                        path,
                        '.',
                        '(Old search was',
                        savedSearch,
                        '.)'
                    );
                }
                this._searches.save(path, newSearch);
            } else {
                // console.log("New search is same as saved one, nothing to save");
            }
        });
    }

    // internal method to load the URL args, when required
    private loadArgs(pathname: string) {
        this._searches.load(pathname).then(search => {
            if (search && search.length) {
                const jumpLoc = {
                    pathname,
                    search,
                };
                if (saveArgsDebug) {
                    console.log('Restoring saved search', jumpLoc);
                }
                this.replaceLocation(jumpLoc);
            } else {
                // console.log("No saved search for this path.");
            }
            this.final = true;
        });
    }

    public handleLocationChange(
        pathChanged: boolean,
        newPath: string,
        pathTokens: string[],
        searchChanged: boolean,
        query: string
    ) {
        //        console.log("Handler: arg saving");
        super.handleLocationChange(pathChanged, newPath, pathTokens, searchChanged, query);
        if (pathChanged) {
            // We are at a new path
            if (!!(query && query.length)) {
                // We have arrived to a new URL, with
                // a valid path and URL args.
                // This should overwrite previously saved
                // search for this path.
                this.saveArgs(newPath, query);
            } else {
                // We have just addived at a new, clean path,
                // with no URL arguments.
                this.temporary = true;
                this.loadArgs(newPath);
            }
        } else {
            // Still the same path, only search has changed
            if (searchChanged) {
                // Path is the same, search changed.
                if (query && query.length) {
                    // The user has simply configured a new set
                    // of URL parameters for the same path
                    this.saveArgs(newPath, query);
                } else {
                    // The user appears to have navigated
                    // to a state when there are no URL
                    // args. However, it was a manual action,
                    // so we save the URL anyway.
                    this.saveArgs(newPath, query);
                }
            } else {
                // Nothing changed, nothing to do
            }
        }
    }
}
