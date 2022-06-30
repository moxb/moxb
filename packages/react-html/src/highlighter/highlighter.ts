import * as React from 'react';
import { styleToString } from '../util';

/**
 * Store info about where did we found the pattern inside the corpus
 */
interface MatchInfo {
    searchText: string;
    startPos: number;
}

export interface HighlightOptions {
    /**
     * Which class to use for highlighting?
     *
     * Please don't supply both class and style together.
     */
    className?: string;

    /**
     * Which styles to use for highlighting?
     *
     * Please don't supply both class and style together.
     */
    style?: React.CSSProperties;
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
 * Highlight search results within a string using HTML spans
 */
export const highlightSearchResult = (
    value: string,
    searchText: string | undefined,
    options: HighlightOptions
): string => {
    const match = findMatch(value, [searchText]);
    const { className, style } = options;
    const begin = className ? `<span class="${className}" >` : `<span style="${styleToString(style!)}">`;
    const end = '</span>';
    if (match) {
        return value.replace(RegExp(match.searchText, 'i'), (text) => `${begin}${text}${end}`);
    } else {
        return value;
    }
};
