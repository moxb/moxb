import { Props as BasicProps } from './BasicLocationManagerImpl';
import { Query } from './UrlSchema';
import { BasicLocationManagerImpl } from './BasicLocationManagerImpl';

const saveArgsDebug = false;

export interface ArgSavingBackend {
    save: (path: string, search: string) => void;
    load: (path: string) => Promise<string>;
}

interface SearchMap {
    [index: string]: string;
}

export class BasicArgSavingBackend implements ArgSavingBackend {
    private readonly searches: SearchMap = {};

    public save(path: string, search: string) {
        console.log('Query for', path, 'is now', search);
        this.searches[path] = search;
    }

    public load(path: string): Promise<string> {
        return new Promise(resolve => {
            resolve(this.searches[path]);
        });
    }
}

export interface Props extends BasicProps {
    backend?: ArgSavingBackend;
}

// This is a LocationManager implementation that adds the feature of
// saving and loading URL arguments for the respective paths.
export class ArgSavingLocationManagerImpl extends BasicLocationManagerImpl {
    private readonly _searches: ArgSavingBackend;

    public constructor(props: Props) {
        super(props);
        this._searches = props.backend || new BasicArgSavingBackend();
    }

    // internal method to save the URL args, when required
    private saveArgs(path: string, newSearch: string) {
        this._searches.load(path).then(
            savedSearch => {
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
            },
            error => {
                console.log('Oops', error);
            }
        );
    }

    // internal method to load the URL args, when required
    private loadArgs(pathname: string) {
        this._searches.load(pathname).then(
            queryString => {
                if (queryString && queryString.length > 2) {
                    const pathTokens = JSON.parse(pathname);
                    const query = JSON.parse(queryString);
                    const jumpLoc = this._schema.getLocation(this._location, pathTokens, query);
                    if (saveArgsDebug) {
                        console.log('Restoring saved search', jumpLoc);
                    }
                    this._setLocation(jumpLoc, 'replace');
                } else {
                    // console.log("No saved search for this path.");
                }
                this.final = true;
            },
            error => {
                console.log('Oops', error);
            }
        );
    }

    protected handleLocationChange(pathChanged: boolean, pathTokens: string[], searchChanged: boolean, query: Query) {
        //        console.log("Handler: arg saving");
        super.handleLocationChange(pathChanged, pathTokens, searchChanged, query);
        const newPath = JSON.stringify(pathTokens);
        const queryString = JSON.stringify(query);
        if (pathChanged) {
            // We are at a new path
            if (queryString.length > 2) {
                // We have arrived to a new URL, with
                // a valid path and URL args.
                // This should overwrite previously saved
                // search for this path.
                this.saveArgs(newPath, queryString);
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
                if (queryString.length > 2) {
                    // The user has simply configured a new set
                    // of URL parameters for the same path
                    this.saveArgs(newPath, queryString);
                } else {
                    // The user appears to have navigated
                    // to a state when there are no URL
                    // args. However, it was a manual action,
                    // so we save the URL anyway.
                    this.saveArgs(newPath, queryString);
                }
            } else {
                // Nothing changed, nothing to do
            }
        }
    }
}
