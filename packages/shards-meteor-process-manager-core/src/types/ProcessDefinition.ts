/**
 * The definition of a process.
 *
 * The application must define all tasks that need to be executed using these definitions.
 */
import { ProcessContext } from './ProcessContext';

export interface ProcessDefinition<ScopeData = void> {
    /**
     * An uniq ID for this process.
     *
     * If the same thing can be done with multiple parameters (i.e. working on different data), then the ID
     * should reference the ID of the object we are working on, too, so that it's always uniq.
     */
    processId: string;

    /**
     * User-readable description of the process
     */
    name: string;

    /**
     * Is this process dangerous?
     *
     * If so, extra precautions will be taken when launching it.
     */
    warning?: string;

    /**
     * Is this process normally executed as part of something else?
     *
     * 1: top-level task (there should be only one for each use case.)
     * 2: direct sub-task of top-level task
     * 3: second level sub-task
     * 4: lowest level nitty-gritty
     */
    detailLevel: number;

    /**
     * Is this process only useful for debugging or other special purposes?
     */
    special?: boolean;

    /**
     * The actual code to be executed.
     */
    execute: (context: ProcessContext<ScopeData> & ScopeData) => void;
}
