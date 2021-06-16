import { Value } from '../value/Value';

export type ProgressStatus = 'success' | 'exception' | 'normal' | 'active';
export type ProgressType = 'line' | 'circle' | 'dashboard';

export interface Progress extends Value<number> {
    /*
     * Status values:
     * - success: the progress finished successfully (i.e. reached 100% or the success threshold)
     * - exception: something went wrong
     * - action: for line type only, to indicate that the progress is still "alive" (active)
     *   even though the percent may not change for a long time. The UI should somehow should explicitly show the the progress is not alive.
     * - normal: otherwise
     */
    status?: ProgressStatus;
    type?: ProgressType;
    steps?: number;
}
