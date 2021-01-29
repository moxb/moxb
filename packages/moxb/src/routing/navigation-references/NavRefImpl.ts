import atob = require('atob');
const btoa: any = require('btoa-lite');
import { NavRef, NavRefCall } from './NavRef';
import { LinkGenerator } from './LinkGenerator';
import { SuccessCallback, UpdateMethod } from '../location-manager';

/**
 * Internal: a type to store nav references
 */
type NavRefMap = Record<string, NavRef<any>>;

/**
 * Internal: a map to store nav references
 */
(global as any).__NavRefLookUpTable = {};
/**
 * TODO: we are putting this constant into the global namespace, because there seems to be a bug in parcel
 * around the module loading which makes it impossible to create a singleton object the normal way.
 */

const getReferences = (): NavRefMap => (global as any).__NavRefLookUpTable;

/**
 * The parameters used when defining NavRefs.
 *
 * What we specify here will determine the capabilities of the resulting NavRef.
 * Usually, we specify different fields, based on whether we are using it on the client
 * or on the server.
 */
export interface NavRefProps {
    /**
     * A LinkGenerator to use for generating direct links and executing jumps.
     */
    linkGenerator?: LinkGenerator;

    /**
     * The base URL to use when generating indirect (redirected) links.
     *
     * This should be the full URL of the app + some prefix.
     */
    redirectUrlBase?: string;
}

/**
 * Internal: implementation of a NavRef
 */
class NavRefImpl<InputTokens> implements NavRef<InputTokens> {
    constructor(readonly key: string, readonly props: NavRefProps = {}) {}

    call(tokens?: InputTokens): NavRefCall<InputTokens> {
        const key = this.key;
        return {
            navRef: this,
            tokens: tokens,
            toString(): string {
                return btoa(
                    JSON.stringify({
                        key,
                        tokens,
                    })
                );
            },
        };
    }

    createIndirectLink(tokens?: InputTokens) {
        const { redirectUrlBase } = this.props;
        if (!redirectUrlBase) {
            throw new Error(
                "This NavRef has been initialized without a redirect URL base, so we can't generate indirect links."
            );
        }
        return redirectUrlBase + '/' + this.call(tokens).toString();
    }

    createDirectLink(tokens?: InputTokens) {
        const { linkGenerator } = this.props;
        if (!linkGenerator) {
            throw new Error(
                "This NavRef has been initialized without a LinkGenerator, so we can't generate direct links."
            );
        }
        return linkGenerator.createLink(this.call(tokens));
    }

    createDirectMarkdownLink(title: string | undefined, tokens?: InputTokens) {
        const url = this.createDirectLink(tokens).fullUrl;
        return '[' + (title || url) + '](' + url + ')';
    }

    createIndirectMarkdownLink(title: string | undefined, tokens?: InputTokens) {
        const url = this.createIndirectLink(tokens);
        return '[' + (title || url) + '](' + url + ')';
    }

    tryGoTo(tokens?: InputTokens, updateMethod?: UpdateMethod, callback?: SuccessCallback) {
        const { linkGenerator } = this.props;
        if (!linkGenerator) {
            throw new Error("This NavRef has been initialized without a LinkGenerator, so we can't jump to links.");
        }
        linkGenerator.tryGoTo(this.call(tokens), updateMethod, callback);
    }

    doGoTo(tokens?: InputTokens, updateMethod?: UpdateMethod) {
        const { linkGenerator } = this.props;
        if (!linkGenerator) {
            throw new Error("This NavRef has been initialized without a LinkGenerator, so we can't jump to links.");
        }
        linkGenerator.doGoTo(this.call(tokens), updateMethod);
    }

    openInNewWindow(tokens?: InputTokens) {
        const { linkGenerator } = this.props;
        if (!linkGenerator) {
            throw new Error("This NavRef has been initialized without a LinkGenerator, so we can't jump to links.");
        }
        const link = linkGenerator.createLink(this.call(tokens));
        const url = link.fullUrl;
        window.open(url);
    }
}

/**
 * Use this to define a new NavRef schema for addressing a part of the application.
 *
 * The most important thing here is the interface used as the type parameter,
 * which will determine the name and type of the parameters required when
 * this NavRef is used.
 *
 * There is also a key for the new NavRef, which should be unique.
 */
export function defineNavRef<InputTokens>(key: string, props?: NavRefProps): NavRef<InputTokens> {
    if (getReferences()[key]) {
        throw new Error("We already have a NavRef called '" + key + "'!");
    }
    return (getReferences()[key] = new NavRefImpl<InputTokens>(key, props));
}

const lookUpNavRef = (key: string): NavRef<any> => {
    const result = getReferences()[key];
    if (!result) {
        throw new Error(
            "Failed to look up navigation reference '" +
                key +
                "'. Existing NavRefs: " +
                Object.keys(getReferences()).join(', ')
        );
    }
    return result;
};

/**
 * Internal. Parse a serialized form of a navigational reference
 */
export function parseNavRef(stringForm: string): NavRefCall<any> {
    const { key, tokens } = JSON.parse(atob(stringForm));
    return lookUpNavRef(key).call(tokens);
}
