import { MeteorPublicationHandle } from './MeteorPublication';

export interface MeteorPublicationLoader<Input, Document> {
    /**
     * What is the current input we are looking at?
     */
    readonly input?: Input | undefined;

    /**
     * Are we currently loading?
     */
    readonly pending: boolean;

    /**
     * Error message to display (if any)
     */
    readonly errorMessage?: string;

    /**
     * The current output
     *
     * If no output is available, an empty array will be returned.
     */
    readonly documents: Document[];

    /**
     * Start listening
     *
     * The loader is configured to be created in sleeping mode (not the default mode), then
     * it won't automatically start to watch the input upon creation.
     * This is necessary because in some cases, the dependencies are not there yet.
     *
     * So when everything is ready (most likely, in the constructor of your class using the loader),
     * you should call this method to wake up the loader.
     */
    awaken(): void;
}

export interface MeteorPublicationLoaderProps<Input, Document> {
    /**
     * ID for debugging
     */
    id: string;

    /**
     * The publication to subscribe to
     */
    publication: MeteorPublicationHandle<Input, Document>;

    /**
     * How do I get the input for the publication?
     *
     * This should use mobx-observable data sources.
     */
    getInput: () => Input | undefined;

    /**
     * Should this loader be created in sleeping mode?
     *
     * If yes, it won't start to listen for input changes until it's awakened by awaken() method.
     */
    sleeping?: boolean;

    /**
     * Should we run in debug mode?
     */
    debug?: boolean;
}
