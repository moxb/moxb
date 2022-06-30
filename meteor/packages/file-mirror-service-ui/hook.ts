import { useMeteorMethodResult } from '@moxb/meteor-react';
import { methodGetMirroredFileInfo } from 'meteor/moxb:file-mirror-service';
import type { MirroredFileInfo } from 'meteor/moxb:file-mirror-service';

export function useMirroredFile(originalUrl: string): [
    boolean, // pending
    string | undefined, // error
    MirroredFileInfo | undefined, // result
    () => void // trigger
] {
    return useMeteorMethodResult(methodGetMirroredFileInfo, originalUrl, { stable: true, swallowErrors: true });
}
