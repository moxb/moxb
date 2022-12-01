import { ValueOrFunction } from '@moxb/util';
import { StateSpace } from '../location-state-space/state-space/StateSpace';
import { CoreLinkProps } from '../linking/CoreLinkProps';
import { UrlSchema } from '../url-schema';
import { NavRefCall } from './NavRef';
import { MyLocation, LocationManager, SuccessCallback, UpdateMethod } from '../location-manager';

/**
 * This is the data that we need to initialize a LinkGenerator
 */
export interface LinkGeneratorProps {
    /**
     * What URL schema to use when generating the links? (is. native, query-based, hash-based, etc.)
     */
    urlSchema?: UrlSchema;

    /**
     * An optional LocationManager object which can be used to navigate the app.
     *
     * If not given, link createLink() should still work, but tryGoTo() and doGoTo() won't.
     * If given, the urlSchema will be copied automatically, so no need to give it here, too.
     */
    locationManager?: LocationManager;

    /**
     * What is the state space that we are using to find out where each NavRefs should point it?
     */
    stateSpace: ValueOrFunction<StateSpace<any, any, any>>;

    /**
     * What is the root URL that we put into the links?
     */
    rootUrl?: string;
}

/**
 * In different circumstances, we need the link in various formats.
 * This interface collects all the possible formats.
 */
export interface LinkResult {
    pathTokens: string[];
    coreProps: CoreLinkProps;
    location: MyLocation;
    fullUrl: string;
}

/**
 * The task of a LinkGenerator is to generate links to various parts of the applications
 * based on NavRefs and the corresponding menu structure.
 */
export interface LinkGenerator {
    /**
     * Create a link from a NavRefCall
     */
    createLink(navRefCall: NavRefCall<any>): LinkResult;

    /**
     * Try to navigate to where the specified location.
     */
    tryGoTo(navRefCall: NavRefCall<any>, updateMethod?: UpdateMethod, callback?: SuccessCallback): void;

    /**
     * Navigate to where the specified location.
     */
    doGoTo(navRefCall: NavRefCall<any>, updateMethod?: UpdateMethod): void;
}
