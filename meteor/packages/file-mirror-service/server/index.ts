import { _injectMirrorService, MirrorService } from '../api';
import { MirrorServiceImpl, MirrorServiceProps } from './MirrorServiceImpl';

export { MirrorServiceProps } from './MirrorServiceImpl';
export * from '../api';

/**
 * Call this function to set up / initialize the mirror service
 */
export function createMirrorService<Meta = {}>(props: MirrorServiceProps): MirrorService {
    return _injectMirrorService(new MirrorServiceImpl<Meta>(props));
}
