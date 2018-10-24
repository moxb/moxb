import { Path, Location as MyLocation, LocationDescriptorObject } from 'history';
import { UrlArg } from "./UrlArg";

export interface Query {
    [key: string]: string;
}

/**
 * This interface describes the responsobilities of a Location Manager
 */
export interface LocationManager {
    // These flags describe whether the current location shoulde be
    // considered stable, or it's temporary in the sense that we are
    // in the middle of an operation that will generate another
    // change very soon.
    final: boolean;

    // This flag is the opposite of the final flag.
    // You can read or write any of them.
    temporary: boolean;

    // the current location
    location: MyLocation;

    // path separator string
    readonly pathSeparator: string;

    // the path from the current location
    path: string;

    // path tokens for the current location
    pathTokens: string[];

    // the search queries for the current location
    query: Query;

    // the searc queries, concatened into a string
    queryString: string;

    // Move to a new location
    // with creating a new element in the history
    pushLocation: (location: LocationDescriptorObject) => void;

    // Move to a new location
    // without adding a new element in the history.
    replaceLocation: (location: LocationDescriptorObject) => void;

    // Move to a new path
    // with creating a new element in the history
    pushPath: (path: Path) => void;

    // Move to a new path
    // with creating a new element in the history
    replacePath: (path: Path) => void;

    // Set the last path token
    // Previous tokens will be preserved, further tokens will be dropped.
    pushPathToken: (position: number, token: string | null) => void;

    // Determine if a given link should currently be considered to be active
    isLinkActive: (wanted: string, exactOnly: boolean) => boolean;

    // Determine whether a given token at a given level matches
    doesPathTokenMatch: (token: string, level: number, exactOnly: boolean) => boolean;

    // Register a URl argument.
    registerUrlArg: (arg: UrlArg<any>) => void;
}
