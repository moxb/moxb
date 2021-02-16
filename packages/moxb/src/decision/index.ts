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
    const blocker = decisions.find((d) => !readDecision(d));
    return blocker === undefined
        ? decideAccept(
              // no reason to return false
              decisions
                  .map((d) => readReason(d))
                  .filter((r) => !!r)
                  .join(' and ')
          )
        : expandDecision(blocker); // return the reason why this is false
}

/**
 * Perform an OR operation on multiple decisions
 */
export function orDecisions(...decisions: AnyDecision[]): Decision {
    const pass = decisions.find((d) => readDecision(d));
    return pass === undefined
        ? decideRefuse(
              // all of them are fails, so...
              decisions
                  .map((d) => readReason(d))
                  .filter((r) => !!r)
                  .join(' and ')
          )
        : expandDecision(pass); // return the reason why this is true
}
