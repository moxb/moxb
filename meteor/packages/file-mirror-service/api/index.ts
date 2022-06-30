import { registerMeteorMethod } from '@moxb/meteor';

export interface MirroredFileCore {
    originalUrl: string;
}

/**
 * Various data available about mirrored files
 */
export interface MirroredFileInfo {
    link: string;
    isVideo: boolean;
    isImage: boolean;
    isAudio: boolean;
    isPDF: boolean;
    isJSON: boolean;
    isText: boolean;
}

/**
 * Various data available about mirrored files, accessible on the server side
 */
export interface MirroredFileServerInfo extends MirroredFileInfo {
    path: string;
}

/**
 * Parameters for the act of mirroring a new file
 */
export interface MirrorProps<ExtraMeta = {}> {
    url: string;
    mimetype?: string;
    headers?: Record<string, any>;
    logCached?: boolean;
    logMissing?: boolean;
    overwrite?: boolean;
    meta: ExtraMeta;
}

/**
 * Top level API of the mirror service (available on the server side)
 */
export interface MirrorService<ExtraMeta = {}> {
    /**
     * Ask for info about a mirrored file
     */
    getFileInfo: (originalUrl: string) => MirroredFileServerInfo;

    /**
     * Let's mirror a new file
     */
    mirrorFileAsync: (props: MirrorProps<ExtraMeta>) => Promise<void>;

    /**
     * Remove one or more mirrored files
     */
    removeFiles: (selector: Mongo.Selector<MirroredFileCore & ExtraMeta>) => void;

    /**
     * Get some stats
     */
    getStats: (selector: Mongo.Selector<MirroredFileCore & ExtraMeta>) => Record<string, any>;
}

// ============== Singleton access

/**
 * Call this function to get a handle to the mirror service
 */
export function getMirrorService() {
    if (!_mirrorService) {
        throw new Error("Can't access mirror service");
    }
    return _mirrorService;
}

/**
 * Internal pointer to the singleton mirror service.
 *
 * Don't access this directly, only via the `getMirrorService()` function.
 */
let _mirrorService: MirrorService<any> | undefined;

/**
 * Internal method for setting up the mirror service.
 *
 * You don't have to call this manually.
 */
export function _injectMirrorService(service: MirrorService<any>): MirrorService<any> {
    if (_mirrorService) {
        throw new Error('Mirror service already initialized!');
    }
    _mirrorService = service;
    return service;
}

// =====================================================================

/**
 * This Meteor method is the main access point from the client side.
 *
 * Call this to get information about mirrored files.
 */
export const methodGetMirroredFileInfo = registerMeteorMethod(
    {
        name: 'methodGetMirroredFileInfo',
        serverOnly: true,
        execute: (originalUrl: string): MirroredFileInfo => {
            const serverInfo = getMirrorService().getFileInfo(originalUrl);
            // We remove the part of the info that only belongs to the server
            const { path, ...rest } = serverInfo;
            return rest;
        },
    },
    Meteor
);

console.log(methodGetMirroredFileInfo);
