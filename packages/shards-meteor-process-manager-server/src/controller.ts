import { ProcessManagerControllerImpl } from './ProcessManagerControllerImpl';

export interface ProcessManagerControllerProps {
    /**
     * Do we need to restrict access to process control?
     *
     * If yes, provide a function that makes the access control decisions based on (Meteor) user ID and data scope ID.
     */
    auth?: (userId: string | null, scopeId: string, reason: string) => boolean;
}

/**
 * Launch the process manager in the controller role
 */
export function initProcessManagerController(props: ProcessManagerControllerProps = {}) {
    new ProcessManagerControllerImpl(props);
}
