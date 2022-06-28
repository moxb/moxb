/**
 * Store info about where did we found the pattern inside the corpus
 */
interface MatchInfo {
    searchText: string;
    startPos: number;
}

/**
 * Identify pattern matches within a corpus
 */
const findMatch = (inValue: string | null | undefined, search: (string | undefined)[]): MatchInfo => {
    let matchStart: number;
    const value = (inValue || '').toLowerCase();
    const matches: MatchInfo[] = search
        .filter((s) => !!s && s.toLowerCase)
        .map((s) => {
            matchStart = value.indexOf(s!.toLowerCase());
            return matchStart !== -1
                ? {
                      searchText: s,
                      startPos: matchStart,
                  }
                : undefined;
        })
        .filter((m) => !!m)
        .map((m) => m as MatchInfo); // This last line is only here to make TS happy
    return matches[0];
};

/**
 * Highlight search results within a string
 */
export const highlightSearchResult = (value: string, searchText: string | undefined, className: string): string => {
    const match = findMatch(value, [searchText]);
    if (match) {
        return value.replace(RegExp(match.searchText, 'i'), (text) => `<span class="${className}">` + text + '</span>');
    } else {
        return value;
    }
};
