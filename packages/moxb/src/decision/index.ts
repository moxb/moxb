export interface Decision {
    allowed: boolean;
    reason?: string;
}

export const decideAccept = (reason?: string): Decision => ({ allowed: true, reason });
export const decideRefuse = (reason?: string): Decision => ({ allowed: false, reason });

export type AnyDecision = boolean | Decision;

export function readDecision(decision: AnyDecision): boolean {
    return decision === null ? false : typeof decision === 'object' ? (decision as Decision).allowed : !!decision;
}

export function readReason(decision: AnyDecision): string | undefined {
    return decision === null ? undefined : typeof decision === 'object' ? (decision as Decision).reason : undefined;
}
