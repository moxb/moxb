import {useRPCResult} from '@moxb/react-html';
import {methodGetMirroredFileInfo} from 'meteor/moxb:file-mirror-service';
import type {MirroredFileInfo} from 'meteor/moxb:file-mirror-service';

export function useMirroredFile(originalUrl: string): [
    boolean, // pending
        string | undefined, // error
        MirroredFileInfo | undefined, // result
    () => void // trigger
] {
    return useRPCResult(methodGetMirroredFileInfo, originalUrl, {stable: true, swallowErrors: true});
}
