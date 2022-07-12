import * as React from 'react';

import { findTextMatch } from '@moxb/moxb';
import type { NormalizerOptions } from '@moxb/moxb';

import { styleToString } from '../util';

export interface HighlightOptions {
    /**
     * Options for identifying the matches
     */
    findOptions?: NormalizerOptions;

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
 * Highlight search results within a string using HTML spans
 */
export const highlightSearchResult = (
    value: string,
    searchText: string | undefined,
    options: HighlightOptions
): string => {
    const match = findTextMatch(value, [searchText]);
    const { className, style } = options;
    const begin = className ? `<span class="${className}" >` : `<span style="${styleToString(style!)}">`;
    const end = '</span>';
    if (match) {
        return `${value.substring(0, match.startPos)}${begin}${value.substring(
            match.startPos,
            match.startPos + match.searchText.length
        )}${end}${value.substring(match.startPos + match.searchText.length)}`;
    } else {
        return value;
    }
};
