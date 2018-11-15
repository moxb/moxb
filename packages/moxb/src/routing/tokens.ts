/**
 * Decide whether a given token is considered to be empty.
 */
export function isTokenEmpty(token: string | null | undefined): boolean {
    return token === '' || token === null || token === undefined;
}

/**
 * Decide whether a pair of tokens is considered to be equivalent
 */
function doTokensMatch(token1: string | null | undefined, token2: string | null | undefined): boolean {
    const empty1 = isTokenEmpty(token1);
    const empty2 = isTokenEmpty(token2);
    return (empty1 && empty2) || token1 === token2;
}

/**
 * This function determines a match between token strings
 *
 * @param currentTokens The list of tokens to test
 * @param wantedTokens The test pattern we are searching for
 * @param parsedTokens The number of tokens to skip
 * @param exactOnly Only confirm matches when there are no more tokens
 * @param debugMode Debug output required
 */
export function doTokenStringsMatch(
    currentTokens: (string | null)[],
    wantedTokens: (string | null)[],
    parsedTokens: number,
    exactOnly: boolean,
    debugMode?: boolean
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
        if (debugMode) {
            console.log(
                'Testing if this is an exact match.',
                'nextLevel is',
                nextLevel,
                'nextToken is',
                nextToken,
                typeof nextToken,
                'empty?',
                empty
            );
        }
        return empty;
    } else {
        if (debugMode) {
            console.log('Not exact match required, returning true');
        }
        return true;
    }
}

export function updateTokenString(currentTokens: string[], position: number, tokens: string[]): string[] {
    const before = currentTokens.slice(0, position);
    const newTokens = [...before, ...tokens.filter(t => !isTokenEmpty(t))];
    return newTokens;
}
