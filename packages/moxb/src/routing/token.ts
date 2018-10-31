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
    // const debug = tokens.join('.') === '' || tokens.join('.') === 'two';
    // if (debug) {
    //     console.log(
    //         'Testing tokens:',
    //         tokens,
    //         'against',
    //         this.pathTokens,
    //         'on level:',
    //         level,
    //         'exact only?',
    //         exactOnly
    //     );
    // }

    let result = true;
    wantedTokens.forEach((token, index) => {
        if (!result) {
            return;
        }
        const current = currentTokens[parsedTokens + index];
        const matches = doTokensMatch(current, token);
        if (!matches) {
            // if (debug) {
            //     console.log('Match fails on token #', index, 'looking for:', token, 'found:', current);
            // }
            result = false;
        } else {
            // if (debug) {
            //     console.log('Match looks good on token #', index, 'looking for:', token, 'found:', current);
            // }
        }
    });
    if (!result) {
        return false;
    }
    if (exactOnly) {
        const nextLevel = parsedTokens + wantedTokens.length;
        const nextToken = currentTokens[nextLevel];
        const empty = isTokenEmpty(nextToken);
        // if (debug) {
        //     console.log(
        //         'Need an exact match, so checking if token at level',
        //         nextLevel,
        //         ',',
        //         nextToken,
        //         'is empty?',
        //         empty
        //     );
        // }
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
