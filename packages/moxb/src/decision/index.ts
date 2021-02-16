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

/**
 * Expand AnyDecision to a (real) Decision
 */
export const expandDecision = (decision: AnyDecision): Decision => ({
    allowed: readDecision(decision),
    reason: readReason(decision),
});

/**
 * Invert a decision
 */
export function notDecision(decision: AnyDecision): Decision {
    const result = expandDecision(decision);
    result.allowed = !result.allowed;
    return result;
}

/**
 * Perform an AND operation on multiple decisions
 */
export function andDecisions(...decisions: AnyDecision[]): Decision {
    if (!decisions.length) {
        return decideAccept('Not forbidden, so why not?');
    }
    const result = expandDecision(decisions[0]);
    for (let i = 1; result.allowed && i < decisions.length; i++) {
        const decision = decisions[i];
        if (!readDecision(decision)) {
            result.allowed = false;
            result.reason = readReason(decision);
        }
    }
    return result;
}

/**
 * Perform an OR operation on multiple decisions
 */
export function orDecisions(...decisions: AnyDecision[]): Decision {
    if (!decisions.length) {
        return decideRefuse('There are no possibilities.');
    }
    const result = expandDecision(decisions[0]);
    for (let i = 1; !result.allowed && i < decisions.length; i++) {
        const decision = decisions[i];
        if (readDecision(decision)) {
            result.allowed = true;
            result.reason = readReason(decision);
        }
    }
    return result;
}
