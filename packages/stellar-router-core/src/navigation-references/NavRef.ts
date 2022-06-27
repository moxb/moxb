/**
 * A NavRef is a schema for addressing a specific part of the navigation tree,
 * optionally with some parameters.
 *
 * Normally you don't create it manually: see createNavRef()
 */
import { SuccessCallback, UpdateMethod } from '../location-manager';
import { LinkResult } from './LinkGenerator';

export interface NavRef<InputTokens> {
    /**
     * Use this schema to address a specific state of the app.
     */
    call(tokens?: InputTokens): NavRefCall<InputTokens>;

    /**
     * Create a link pointing to a given state.
     *
     * This requires a LinkGenerator, so usually only works on the client.
     */
    createDirectLink(tokens?: InputTokens): LinkResult;

    /**
     * Create a direct MarkDown link to a given position.
     *
     * This requires a LinkGenerator, so usually only works on the client.
     *
     * @param title The title to display for the link
     * @param tokens Any parameters for this NavRef
     */
    createDirectMarkdownLink(title: string | undefined, tokens?: InputTokens): string;

    /**
     * Create an indirect link pointing to a given state.
     *
     * This doesn't require a LinkGenerator, so works on both the client and the server.
     */
    createIndirectLink(tokens?: InputTokens): any;

    /**
     * Create an indirect MarkDown link to a given position.
     *
     * This doesn't require a LinkGenerator, so works on both the client and the server.
     *
     * @param title The title to display for the link
     * @param tokens Any parameters for this NavRef
     */
    createIndirectMarkdownLink(title: string | undefined, tokens?: InputTokens): string;

    /**
     * Try to navigate to this specific state.
     *
     * This requires a LinkGenerator and LocationManager, so usually only works on the client.
     */
    tryGoTo(tokens?: InputTokens, updateMethod?: UpdateMethod, callback?: SuccessCallback): void;

    /**
     * Navigate to this specific state
     *
     * This requires a LinkGenerator and a LocationManager, so usually only works on the client.
     */
    doGoTo(tokens?: InputTokens, updateMethod?: UpdateMethod): void;

    /**
     * Open this specific state in a new window
     *
     * This requires a LinkGenerator and a LocationManager, so usually only works on the client.
     */
    openInNewWindow(tokens?: InputTokens): void;
}

/**
 * A NavRefCall represents a concrete attempt to address a specific part of the navigation tree.
 *
 * It contains the schema used (ie the NavRef), and the current parameters, if required.
 *
 * Normally you don't create it manually; use the call() method on a NavRef.
 */
export interface NavRefCall<InputTokens> {
    navRef: NavRef<InputTokens>;
    tokens?: InputTokens;

    /**
     * Use this to create a serialized version of this data.
     * This form can be saved as a string and restored later.
     */
    toString(): string;
}
