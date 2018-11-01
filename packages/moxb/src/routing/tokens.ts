/**
 * Decide whether a given token is considered to be empty.
 */
export function isTokenEmpty(token: string | undefined): boolean {
    return token === '' || token === null || token === undefined;
}

/**
 * Decide whether a pair of tokens is considered to be equivalent
 */
export function doTokensMatch(token1: string | undefined, token2: string | undefined): boolean {
    const empty1 = isTokenEmpty(token1);
    const empty2 = isTokenEmpty(token2);
    return (empty1 && empty2) || token1 === token2;
}

export function doTokenStringsMatch(
    currentTokens: string[],
    wantedTokens: string[],
    parsedTokens: number,
    exactOnly: boolean
) {
    let result = true;
    wantedTokens.forEach((token, index) => {
        if (!result) {
            return;
        }
        const current = currentTokens[parsedTokens + index];
        const matches = doTokensMatch(current, token);
        if (!matches) {
            result = false;
        }
    });
    if (!result) {
        return false;
    }
    if (exactOnly) {
        const nextLevel = parsedTokens + wantedTokens.length;
        const nextToken = currentTokens[nextLevel];
        const empty = isTokenEmpty(nextToken);
        return empty;
    } else {
        return true;
    }
}

export function updateTokenString(currentTokens: string[], position: number, tokens: string[]): string[] {
    const before = currentTokens.slice(0, position);
    const newTokens = [...before, ...tokens.filter(t => t.length)];
    return newTokens;
}

export function joinTokenString(tokens: (string | undefined)[]): string {
    return tokens.filter(t => !!t && t.length).join('.');
}

export function splitTokenString(value: string): string[] {
    return value.split('.');
}
